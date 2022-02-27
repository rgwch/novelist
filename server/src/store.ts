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
 * @returns a directory to find ans store Novels (Which is the users homedir, if nothing else was defined)
 */
export function resolveDir() {
  let ret: string = os.homedir()
  if (process.env.NOVELS_DIR && fs.existsSync(process.env.NOVELS_DIR)) {
    ret = process.env.NOVELS_DIR
  }
  if (config.has('basedir')) {
    const basedir: string = config.get('basedir')
    if (basedir && fs.existsSync(basedir)) {
      ret = basedir
    }
  }
  return ret
}
/**
 * Class to manage Novel-Files. 
 */
export class Store {
  private crypter: Crypter

  constructor(passphrase: string) {
    const salt = config.has('salt') ? config.get('salt') : 'someSalt'
    this.crypter = new Crypter(passphrase, salt.toString())
  }

  public setPassword(pwd: string) {
    this.crypter.setPassword(pwd)
  }
  private performBackup(gen: number, pathname: string): void {
    const last = pathname + '_' + gen
    if (fs.existsSync(last)) {
      const now = DateTime.fromJSDate(new Date())
      const datestring = now.toFormat('yyyy-LL-dd')
      const basename = path.basename(pathname, '.novel')
      const dir = path.dirname(pathname)
      const dailybackup = path.join(dir, basename + '_' + datestring + '.novel')
      if (fs.existsSync(dailybackup)) {
        fs.rmSync(last)
      } else {
        fs.renameSync(last, dailybackup)
      }
    }
    for (let i = gen - 1; i > 0; i--) {
      const check = pathname + '_' + i
      if (fs.existsSync(check)) {
        fs.renameSync(check, pathname + '_' + (i + 1).toString())
      }
    }
    if (fs.existsSync(pathname)) {
      fs.renameSync(pathname, pathname + '_1')
    }
  }

  /**
   * Save data to a Novel file: Encrypts data and creates a filename from basedir and id. If such a file already exists, 
   * copy existing to a backup filename first.
   * @param id bare filename for the Novel
   * @param data plain contents
   */
  public async save(id: string, data: Buffer): Promise<void> {
    try {
      this.performBackup(5, id)
    } catch (err) {
      console.log("store:save: can't organise backups " + err)
      throw new Error('Backup ' + err)
    }

    const instream = new sb.ReadableStreamBuffer()
    const outstream = fs.createWriteStream(id)
    instream.put(data)
    instream.stop()
    try {
      await this.crypter.encrypt(instream, outstream)
    } catch (err) {
      console.log("Encryption error " + err)
      throw err
    }
  }

  /**
   * Load a Novel file
   * @param id bare filename
   * @returns plain contents
   * @throws Error
   */
  public async load(id: string): Promise<Buffer> {
    const instream = fs.createReadStream(id)
    const outstream = new sb.WritableStreamBuffer({
      initialSize: 1024,
      incrementAmount: 1024,
    })
    try {
      await this.crypter.decrypt(instream, outstream)
      return outstream.getContents() as Buffer
    } catch (err) {
      console.log("Decryption error: " + err)
      throw(err)
    }
  }
}
