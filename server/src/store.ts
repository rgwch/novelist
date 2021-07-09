/********************************************
 * This file is part of Novelist            *
 * License and Terms see LICENSE            *
 ********************************************/

import fs from 'fs';
import path from 'path';
import { createGzip, createGunzip } from 'zlib';
import crypto from 'crypto';
import sb from 'stream-buffers';
import { pipeline } from 'stream';
import { DateTime } from 'luxon';
import {config} from './config'

let plaintext = false;

export function setPlaintext(plain: boolean): void {
  plaintext = plain;
}
export class Store {
  private algo = 'aes-192-cbc';
  private key: any;
  private iv: Buffer = Buffer.alloc(16, 0);

  constructor(passphrase: string) {
    this.setPassword(passphrase);
  }

  setPassword(passphrase: string): void {
    // console.log("Store: Setting password " + password)
    const hash = crypto.createHash('sha256')
    const pwd = hash.update(passphrase)
    this.key = crypto.scryptSync(passphrase, config.salt || 'salt', 24);

    const ivraw = pwd.digest();
    this.iv = Buffer.from(ivraw.subarray(0, 16));
  }
  performBackup(gen: number, pathname: string): void {
    const last = pathname + '_' + gen;
    if (fs.existsSync(last)) {
      const now = DateTime.fromJSDate(new Date());
      const datestring = now.toFormat('yyyy-LL-dd');
      const basename = path.basename(pathname, '.novel');
      const dir = path.dirname(pathname);
      const dailybackup = path.join(dir, basename + '_' + datestring + '.novel');
      if (fs.existsSync(dailybackup)) {
        fs.rmSync(last);
      } else {
        fs.renameSync(last, dailybackup);
      }
    }
    for (let i = gen - 1; i > 0; i--) {
      const check = pathname + '_' + i;
      if (fs.existsSync(check)) {
        fs.renameSync(check, pathname + '_' + (i + 1).toString());
      }
    }
    if (fs.existsSync(pathname)) {
      fs.renameSync(pathname, pathname + '_1');
    }
  }

  public save(id: string, data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.performBackup(5, id);
      } catch (err) {
        console.log("store:save: can't organise backups " + err);
        reject('Backup ' + err);
      }

      const instream = new sb.ReadableStreamBuffer();
      // const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv(this.algo, this.key, this.iv);
      const gz = createGzip();
      try {
        const outstream = fs.createWriteStream(id);

        instream.on('error', (err) => {
          reject('instream ' + err);
        });
        outstream.on('error', (err) => {
          reject('outstream ' + err);
        });
        instream.put(data);
        instream.stop();
        if (plaintext) {
          pipeline(instream, outstream, (err) => {
            if (err) {
              reject('pipeline ' + err);
            } else {
              outstream.end();
              resolve(true);
            }
          });
        } else {
          pipeline(instream, gz, cipher, outstream, (err) => {
            if (err) {
              reject('pipeline ' + err);
            } else {
              outstream.end();
              resolve(true);
            }
          });
        }
      } catch (err) {
        console.log('store: save error ' + err);
        reject(err);
      }
    });
  }

  public load(id: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv(this.algo, this.key, this.iv);
      const gz = createGunzip();
      const instream = fs.createReadStream(id);
      const outstream = new sb.WritableStreamBuffer({
        initialSize: 1024,
        incrementAmount: 1024
      });
      instream.on('error', (err) => {
        console.log('store.load: Instream error ' + err);
        reject('instream ' + err);
      });
      gz.on('error', (err) => {
        console.log('store.load: gzip error ' + err);
        reject('gzip ' + err);
      });
      if (plaintext) {
        pipeline(instream, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err);
          } else {
            const buf = outstream.getContents();
            if (!buf) {
              reject('empty buffer');
            }
            resolve(buf as Buffer);
          }
        });
      } else {
        pipeline(instream, decipher, gz, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err);
          } else {
            const buf = outstream.getContents();
            if (!buf) {
              reject('empty buffer');
            }
            resolve(buf as Buffer);
          }
        });
      }
    });
  }
}
