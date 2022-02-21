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
import { Crypter } from 'simple-crypt'
import { pipeline } from 'stream'

let plaintext = false

if (config.has('encryption')) {
  plaintext = !config.get('encryption')
}

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
export function setPlaintext(plain: boolean): void {
  plaintext = plain
}
export class Store {
  private crypter: Crypter

  constructor(passphrase: string) {
    const salt = config.has('salt') ? config.get('salt') : 'someSalt'
    this.crypter = new Crypter(passphrase, salt.toString())
  }

  performBackup(gen: number, pathname: string): void {
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

  public save(id: string, data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.performBackup(5, id)
      } catch (err) {
        console.log("store:save: can't organise backups " + err)
        reject('Backup ' + err)
      }

      const instream = new sb.ReadableStreamBuffer()
      const outstream = fs.createWriteStream(id)
      instream.put(data)
      instream.stop()
      if (plaintext) {
        pipeline(instream, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err)
          } else {
            outstream.end()
            resolve(true)
          }
        })
      } else {
        return this.crypter.encrypt(instream, outstream)
      }
    })
  }

  public load(id: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const instream = fs.createReadStream(id)
      const outstream = new sb.WritableStreamBuffer({
        initialSize: 1024,
        incrementAmount: 1024,
      })
      if (plaintext) {
        pipeline(instream, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err)
          } else {
            const buf = outstream.getContents()
            if (!buf) {
              reject('empty buffer')
            }
            resolve(buf as Buffer)
          }
        })
      } else {
        return this.crypter.decrypt(instream, outstream).then((buf) => {
          if (buf) {
            resolve(outstream.getContents() as Buffer)
          }
        })
      }
    })
  }
}
