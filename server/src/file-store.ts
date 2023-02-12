/********************************************
 * This file is part of Novelist            *
 * License and Terms see LICENSE            *
 ********************************************/

import fs from 'fs'
import path from 'path'
import sb from 'stream-buffers'
import { DateTime } from 'luxon'
import os from 'os'
import config from 'config'
import { Crypter } from '@rgwch/simple-crypt'

/**
 * find the directory where Novels are stored. Consider Environment variable NOVELS_DIR and configuration option "basedir". 
 * @returns a directory to find and store Novels (Which is the users homedir, if nothing else was defined)
 */


let basedir

export class FileStore implements IStore {
  constructor(cfg) {
    basedir = os.homedir()
    if (cfg.basedir) {
      basedir = cfg.basedir
    } else {
      if (process.env.NOVELS_DIR && fs.existsSync(process.env.NOVELS_DIR)) {
        basedir = process.env.NOVELS_DIR
      }
    }
  }
  createStorable(id: string, passphrase: string): IStorable {
    return new FileStoreObject(id, passphrase)
  }
  removeObject(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.queryObject(id)) {
        console.log("delete: " + id + " dies not exist")
        resolve(false)
      }
      fs.rm(path.join(basedir, id), err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
  listObjects(filter: RegExp = /.*/): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(basedir, (err, files) => {
        if (err) {
          reject(err)
        } else {
          const list = files.filter((file) => file.match(filter))
          resolve(list)
        }
      })
    })
  }
  queryObject(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.access(path.join(basedir, id), fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }
  renameObject(id: string, newId: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!await this.queryObject(id)) {
        console.log("rename: " + id + " does not exist")
        resolve(false)
      }
      fs.rename(path.join(basedir, id), path.join(basedir, newId), err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
  copyObject(id: string, newId: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!await this.queryObject(id)) {
        console.log("copy: " + id + " does not exist")
        resolve(false)
      }
      fs.copyFile(path.join(basedir, id), path.join(basedir, newId), err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
}
export class FileStoreObject implements IStorable {
  private crypter: Crypter
  private filename: string

  constructor(private id: string, passphrase: string | Crypter) {
    this.filename = path.join(basedir, id)
    const salt = config.has('salt') ? config.get('salt') : 'someSalt'
    if (typeof (passphrase) == 'string') {
      this.crypter = new Crypter(passphrase, salt.toString())
    } else {
      this.crypter = passphrase
    }

  }

  public clone(cid: string): IStorable {
    return new FileStoreObject(cid, this.crypter)
  }
  public setPassword(pwd: string) {
    this.crypter.setPassword(pwd)
  }

  /**
   * Save data to a Novel file: Encrypts data and creates a filename from basedir and id. If such a file already exists, 
   * copy existing to a backup filename first.
   * @param id bare filename for the Novel
   * @param data plain contents
   */
  public async save(data: Buffer): Promise<boolean> {
    const instream = new sb.ReadableStreamBuffer()
    const outstream = fs.createWriteStream(this.filename)
    instream.put(data)
    instream.stop()
    try {
      await this.crypter.encrypt(instream, outstream)
      return true
    } catch (err) {
      console.log("Encryption error " + err)
      throw err
    }
  }

  public async load(): Promise<Buffer> {
    if (fs.existsSync(this.filename)) {
      const instream = fs.createReadStream(this.filename)
      const outstream = new sb.WritableStreamBuffer({
        initialSize: 1024,
        incrementAmount: 1024,
      })
      try {
        await this.crypter.decrypt(instream, outstream)
        return outstream.getContents() as Buffer
      } catch (err) {
        console.log("Decryption error: " + err)
        throw new Error("Decrypt error")
      }

    } else {
      return Buffer.alloc(0)
    }
  }

}
