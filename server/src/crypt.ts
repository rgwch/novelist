import { createGzip, createGunzip } from 'zlib'
import { Readable, Writable } from 'stream'
import { pipeline } from 'stream'

import crypto from 'crypto'

export class Crypter {
  private algo = 'aes-192-cbc'
  private key: any
  private iv: Buffer = Buffer.alloc(16, 0)

  constructor(private passphrase: string, private salt: string) {
    this.setPassword(passphrase, salt)
  }
  setPassword(passphrase: string, salt: string): void {
    // console.log("Store: Setting password " + password)
    const hash = crypto.createHash('sha256')
    const pwd = hash.update(passphrase)
    this.key = crypto.scryptSync(passphrase, salt, 24)

    const ivraw = pwd.digest()
    this.iv = Buffer.from(ivraw.subarray(0, 16))
  }
  encrypt(instream: Readable, outstream: Writable): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const cipher = crypto.createCipheriv(this.algo, this.key, this.iv)
      const gz = createGzip()
      try {
        instream.on('error', (err) => {
          reject('instream ' + err)
        })
        outstream.on('error', (err) => {
          reject('outstream ' + err)
        })
        pipeline(instream, gz, cipher, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err)
          } else {
            outstream.end()
            resolve(true)
          }
        })
      } catch (err) {
        console.log('store: save error ' + err)
        reject(err)
      }
    })
  }
  decrypt(instream: Readable, outstream: Writable): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const decipher = crypto.createDecipheriv(this.algo, this.key, this.iv)
      const gz = createGunzip()
      instream.on('error', (err) => {
        console.log('store.load: Instream error ' + err)
        reject('instream ' + err)
      })
      gz.on('error', (err) => {
        console.log('store.load: gzip error ' + err)
        reject('gzip ' + err)
        pipeline(instream, decipher, gz, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err)
          } else {
            resolve(true)
          }
        })
      })
    })
  }
}
