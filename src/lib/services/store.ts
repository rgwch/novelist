import fs from 'fs'
import { createGzip, createGunzip } from 'zlib';
import crypto from 'crypto';

export class Store {

  constructor(private password: string) { }

  private generateKey(password: string): any {
    const algo = 'aes-192-cbc';
    const key = crypto.scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16.0);
    const cipher = crypto.createCipheriv(algo, key, iv);
    const decipher = crypto.createDecipheriv(algo, key, iv);
    return { cipher, decipher };
  }

  public save(id: string, data: Buffer): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const gz = createGzip()
      const output = fs.createWriteStream(id)
      gz.pipe(output)
      gz.write(data)
      gz.end()
      resolve(true);
    })

  }

  public load(id: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const input = fs.createReadStream(id)
      const gz = createGunzip()
      const chunks = []
      let buffer
      input.pipe(gz)
      gz.on('data', chunk => chunks.push(chunk))
      gz.on('end', () => {
        buffer = Buffer.concat(chunks)
        resolve(buffer)
      })
      gz.on("error", err => {
        reject(err)
      })
    })

  }
}