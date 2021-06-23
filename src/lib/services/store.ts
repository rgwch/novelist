/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

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
			try {
				if (fs.existsSync(id + '_3')) {
					fs.rmSync(id + '_3');
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
			} catch (err) {
				console.log("can't organise backups " + err);
				reject('Backup ' + err);
			}
			const instream = new sb.ReadableStreamBuffer();
			const iv = Buffer.alloc(16, 0);
			const cipher = crypto.createCipheriv(this.algo, this.key, iv);
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
				pipeline(instream, /*gz, cipher, */ outstream, (err) => {
					if (err) {
						reject('pipeline ' + err);
					} else {
						outstream.end();
						resolve(true);
					}
				});
			} catch (err) {
				console.log('save error ' + err);
				reject(err);
			}
		});
	}

	public load(id: string): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const iv = Buffer.alloc(16, 0);
			const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
			const gz = createGunzip();
			const instream = fs.createReadStream(id);
			const outstream = new sb.WritableStreamBuffer({
				initialSize: 1024,
				incrementAmount: 1024
			});
			instream.on('error', (err) => {
				console.log('Instream error ' + err);
				reject('instream ' + err);
			});
			gz.on('error', (err) => {
				console.log('gzip error ' + err);
				reject('gzip ' + err);
			});

			pipeline(instream, /*decipher, gz,*/ outstream, (err) => {
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
