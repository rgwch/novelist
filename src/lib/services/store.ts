import fs from 'fs';
import { createGzip, createGunzip } from 'zlib';
import crypto from 'crypto';
import sb from 'stream-buffers';
import { pipeline } from 'stream';

export class Store {
	private algo = 'aes-192-cbc';
	private key;

	constructor(private password: string) {
		this.key = crypto.scryptSync(this.password, 'salt', 24);
	}

	public save(id: string, data: Buffer): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const instream = new sb.ReadableStreamBuffer();
			const iv = Buffer.alloc(16.0);
			const cipher = crypto.createCipheriv(this.algo, this.key, iv);
			const gz = createGzip();
			const outstream = fs.createWriteStream(id);
		
			instream.on('error', (err) => {
				console.log(err);
				reject(err);
			});
			outstream.on('error', (err) => {
				console.log(err);
				reject(err);
			});
			instream.put(data);
			instream.stop();
			pipeline(instream, gz, cipher, outstream, (err) => {
				if (err) {
					reject(err);
				} else {
					outstream.end();
					resolve(true);
				}
			});
		});
	}

	public load(id: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const iv = Buffer.alloc(16.0);
			const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
			const gz = createGunzip();
			const instream = fs.createReadStream(id);
			const outstream = new sb.WritableStreamBuffer({
				initialSize: 1024,
				incrementAmount: 1024
			});
			instream.on('error', (err) => {
				console.log('Instream error ' + err);
				reject(null);
			});
			gz.on('error', (err) => {
				console.log('gzip error ' + err);
				reject(null);
			});

			pipeline(instream, decipher, gz, outstream, (err) => {
				if (err) {
					reject(err);
				} else {
					const buf = outstream.getContents();
					if (!buf) {
						reject(null);
					}
					resolve(buf);
				}
			});
		});
	}
}
