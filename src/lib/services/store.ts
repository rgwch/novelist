/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import fs from 'fs';
import path from 'path'
import { createGzip, createGunzip } from 'zlib';
import crypto from 'crypto';
import sb from 'stream-buffers';
import { pipeline } from 'stream';
import config from '$lib/config.json'
import { DateTime } from 'luxon';

export class Store {
  private algo = 'aes-192-cbc';
  private key;
  private iv

  constructor(password: string) {
    this.setPassword(password)
  }

  setPassword(password: string) {
    console.log("Store: Setting password "+password)
    this.key = crypto.scryptSync(password, 'salt', 24);
    let ivraw = ""
    while (ivraw.length < 16) {
      ivraw += password
    }
    this.iv = Buffer.from(ivraw.substr(0, 16))
  }
  performBackup(gen: number, pathname: string): void {
    const last = pathname + "_" + gen
    if (fs.existsSync(last)) {
      const now = DateTime.fromJSDate(new Date())
      const datestring = now.toFormat("yyyy-LL-dd")
      const basename = path.basename(pathname, ".novel")
      const dir = path.dirname(pathname)
      const dailybackup = path.join(dir, basename + "_" + datestring + ".novel")
      if (fs.existsSync(dailybackup)) {
        fs.rmSync(last);
      } else {
        fs.renameSync(last, dailybackup)
      }
    }
    for (let i = gen - 1; i > 0; i--) {
      if (fs.existsSync(pathname + "_" + i)) {
        fs.renameSync(pathname + "_" + i, pathname + "_" + (i + 1).toString())
      }
    }
  }
  public save(id: string, data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.performBackup(5, id)
        /*
        if (fs.existsSync(id + '_5')) {
          const now = DateTime.fromJSDate(new Date())
          const datestring = now.toFormat("yyyy-LL-dd")
          const basename = path.basename(id, ".novel")
          const dir = path.dirname(id)
          const dailybackup = path.join(dir, basename + "_" + datestring + ".novel")
          if (fs.existsSync(dailybackup)) {
            fs.rmSync(id + '_5');
          } else {
            fs.renameSync(id + "_5", dailybackup)
          }
        }
        if (fs.existsSync(id + '_4')) {
          fs.renameSync(id + '_4', id + '_5');
        }
        if (fs.existsSync(id + '_3')) {
          fs.renameSync(id + '_3', id + '_4');
        }
        if (fs.existsSync(id + '_2')) {
          fs.renameSync(id + '_2', id + '_3');
        }
        if (fs.existsSync(id + '_1')) {
          fs.renameSync(id + '_1', id + '_2');
        }
        if (fs.existsSync(id)) {
          fs.renameSync(id, id + '_1');
        }
        */
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
        pipeline(instream, gz, cipher, outstream, (err) => {
          if (err) {
            reject('pipeline ' + err);
          } else {
            outstream.end();
            resolve(true);
          }
        });
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

      pipeline(instream, decipher, gz, outstream, (err) => {
        if (err) {
          reject('pipeline ' + err);
        } else {
          const buf = outstream.getContents();
          if (!buf) {
            reject('empty buffer');
          }
          resolve(buf);
        }
      });
    });
  }
}
