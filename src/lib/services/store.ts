import fs from 'fs'
import { createGzip, createGunzip } from 'zlib';
import crypto from 'crypto';
import sb from 'stream-buffers'
import { createModuleResolutionCache } from 'typescript';

export class Store {
  private algo = 'aes-192-cbc'
  private key

  constructor(private password: string) {
    this.key = crypto.scryptSync(this.password, 'salt', 24);
  }

  public save(id: string, data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const instream = new sb.ReadableStreamBuffer()
      const iv = Buffer.alloc(16.0);
      const cipher = crypto.createCipheriv(this.algo, this.key, iv);
      const gz = createGzip()
      const outstream = fs.createWriteStream(id)
      /*
      gz.pipe(output)
      gz.write(data)
      gz.end()
      resolve(true);
      */

      instream.on("error", err => {
        console.log(err)
        reject(err)
      })
      instream.on('end', () => {
        gz.flush()
        gz.end()
        outstream.end()
        resolve(true)
      })
      outstream.on("error", (err) => {
        console.log(err)
        reject(err)
      })
      /*
      instream.on('data',chunk=>{
       outstream.write(chunk)
      })
      */
      instream.put(data)
      instream.stop()
      instream.pipe(gz).pipe(outstream)
      // instream.pipe(outstream)
    })

  }

  public load(id: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const iv = Buffer.alloc(16.0);
      const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
      const gz = createGunzip()
      const instream = fs.createReadStream(id)
      const outstream = new sb.WritableStreamBuffer({
        initialSize: 1024,
        incrementAmount: 1024
      })
      instream.on('error', (err) => {
        console.log("Instream error " + err)
        reject(null)
      })
      gz.on('error', err => {
        console.log("gzip error " + err)
        reject(null)
      })
      gz.on('end', () => {
        console.log(outstream.size())
        const buf = outstream.getContents()
        if (!buf) {
          reject(null)
        }
        resolve(buf)
      })
      instream.pipe(gz).pipe(outstream)
    })

  }
}