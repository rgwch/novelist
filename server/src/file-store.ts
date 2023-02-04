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
  removeObject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.rm(path.join(basedir, id), err => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
  listObjects(filter:RegExp=/.+/): Promise<string[]> {
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
      fs.access(path.join(basedir, id), fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

}
export class FileStoreObject implements IStorable {
  private crypter: Crypter
  private filename: string

  constructor(private id: string, passphrase: string) {
    const salt = config.has('salt') ? config.get('salt') : 'someSalt'
    this.crypter = new Crypter(passphrase, salt.toString())
    this.filename = path.join(basedir, id)
  }


  public setPassword(pwd: string) {
    this.crypter.setPassword(pwd)
  }
  private performBackup(gen: number): void {
    const last = this.filename + '_' + gen
    if (fs.existsSync(last)) {
      const now = DateTime.fromJSDate(new Date())
      const datestring = now.toFormat('yyyy-LL-dd')
      const extname=path.extname(this.filename)
      const basename = path.basename(this.filename, extname)
      const dailybackup = path.join(basedir, basename + '_' + datestring + extname)
      if (fs.existsSync(dailybackup)) {
        fs.rmSync(last)
      } else {
        fs.renameSync(last, dailybackup)
      }
    }
    for (let i = gen - 1; i > 0; i--) {
      const check = this.filename + '_' + i
      if (fs.existsSync(check)) {
        fs.renameSync(check, this.filename + '_' + (i + 1).toString())
      }
    }
    if (fs.existsSync(this.filename)) {
      fs.renameSync(this.filename, this.filename + '_1')
    }
  }

  /**
   * Save data to a Novel file: Encrypts data and creates a filename from basedir and id. If such a file already exists, 
   * copy existing to a backup filename first.
   * @param id bare filename for the Novel
   * @param data plain contents
   */
  public async save(data: Buffer): Promise<void> {
    try {
      this.performBackup(5)
    } catch (err) {
      console.log("store:save: can't organise backups " + err)
      throw new Error('Backup ' + err)
    }

    const instream = new sb.ReadableStreamBuffer()
    const outstream = fs.createWriteStream(this.filename)
    instream.put(data)
    instream.stop()
    try {
      await this.crypter.encrypt(instream, outstream)
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
        throw (err)
      }

    } else {
      return Buffer.alloc(0)
    }
  }

}
