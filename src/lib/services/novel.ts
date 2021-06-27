/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import metadataParser from 'markdown-yaml-metadata-parser';
import { Store } from './store';
import { promisify } from 'util';
import type * as n from './novel.d';

const preadFile = promisify(fs.readFile);
const preaddir = promisify(fs.readdir);

const default_metadata: n.metadata_def = {
	title: '',
	author: '',
	created: new Date(),
	chapters: [],
	persons: [],
	places: []
};

export class Novel {
	private store: Store;
	static open(pathname: string, password = 'default'): Promise<Novel> {
		// console.log("opening " + pathname + " from " + __dirname)
		return new Promise((resolve, reject) => {
			if (!pathname.endsWith('.novel')) {
				pathname += '.novel';
			}
			if (fs.existsSync(pathname)) {
				const lockfile = pathname + '.lock';
				/*
        if (fs.existsSync(lockfile)) {
          throw new Error("Book already opened")
        }
        fs.writeFileSync(lockfile, new Date().toString())
        */
				const store = new Store(password);
				store.load(pathname).then((buffer) => {
					try {
						const json: n.noveldef = JSON.parse(buffer.toString('utf-8'));
						const lastWrite = new Date(json.metadata.modified);
						if (lastWrite && lastWrite.getTime() == lastWrite.getTime()) {
							resolve(new Novel(pathname, json));
						} else {
							reject('invalid date ' + json.metadata.modified);
						}
					} catch (err) {
						reject('structure error ' + err);
					}
				});
			} else {
				const def = {
					metadata: default_metadata,
					persons: {},
					places: {},
					chapters: {},
					time: ''
				};
				def.metadata.title = path.basename(pathname, '.novel');
				def.metadata.created = new Date();
				const novel = new Novel(pathname, def);
				novel.flush().then(() => {
					resolve(novel);
				});
			}
		});
	}

	static async fromDirectory(dir: string, password?: string): Promise<Novel> {
		const filepath = path.join(dir, '../..', `${dir}.novel`);
		if (fs.existsSync(filepath)) {
			throw new Error('file exists');
		}
		const def: n.noveldef = {
			metadata: default_metadata,
			persons: {},
			places: {},
			chapters: {},
			timeline: ''
		};
		def.metadata.created = new Date();
		try {
			const time = await preadFile(path.resolve(dir, 'time.md'));
			def.timeline = time.toString('utf-8');
		} catch (err) {
			console.log('Novel.fromDirectory: no time def found ' + err);
			def.timeline = '';
		}
		try {
			const meta = await preadFile(path.resolve(dir, 'metadata.yaml'));
			def.metadata = YAML.parse((await meta).toString('utf-8'));
		} catch (err) {
			console.log('Novel.fromDirectoryno metadata found ' + err);
			def.metadata = default_metadata;
		}
		try {
			const persons = await preaddir(path.resolve(dir, 'persons'));
			for (const person of persons) {
				const data = await preadFile(path.resolve(dir, 'persons', person));
				const split = metadataParser(data.toString('utf-8'));
				def.persons[split.metadata.name] = split.metadata;
				def.persons[split.metadata.name].description = split.content;
			}
		} catch (err) {
			console.log('Novel.fromDirectory: no persons ' + err);
		}
		try {
			const places = await preaddir(path.resolve(dir, 'places'));
			for (const place of places) {
				const data = await preadFile(path.resolve(dir, 'places', place));
				const split = metadataParser(data.toString('utf-8'));
				def.places[split.metadata.name] = split.metadata;
				def.places[split.metadata.name].description = split.content;
			}
		} catch (err) {
			console.log('Novel.fromDirectory: no places ' + err);
		}
		try {
			const chapters = await preaddir(path.resolve(dir, 'chapters'));
			for (const chapter of chapters) {
				const data = await preadFile(path.resolve(dir, 'chapters', chapter));
				const split = metadataParser(data.toString('utf-8'));
				def.chapters[split.metadata.title] = split.metadata;
				def.chapters[split.metadata.title].text = split.content;
			}
		} catch (err) {
			console.log('Novel.fromDirectory: no chapters');
		}

		const novel = new Novel(filepath, def, password);
		await novel.flush();
		return novel;
	}

	constructor(private pathname: string, private def: n.noveldef, private password = 'default') {
		this.store = new Store(this.password);
	}

	async close(): Promise<void> {
		return this.flush().then((success) => {
			if (!success) {
				throw new Error('could not write contents to file');
			}
			this.def = undefined;
			const lockfile = this.pathname + '.lock';
			if (fs.existsSync(lockfile)) {
				fs.rm(lockfile, (err) => {
					if (err) {
						throw new Error('could not remove lockfile');
					}
				});
			}
			this.pathname = undefined;
		});
	}
	flush(): Promise<boolean> {
		if (this.def) {
			this.def.metadata.modified = new Date();
			const buff = Buffer.from(JSON.stringify(this.def));
			return this.store.save(this.pathname, buff);
		}
	}

	writeExpose(text: string): void {
		this.def.metadata.expose = text;
		this.flush();
	}

	writePerson(pdef: n.person_def): Promise<boolean> {
		if (this.def) {
			const name = pdef.name;
			this.def.persons[name] = pdef;
			if (!this.def.metadata.persons.find((p) => p == name)) {
				this.def.metadata.persons.push(name);
			}
			return this.flush();
		} else {
			throw new Error('no book open');
		}
	}
	writeChapter(cdef: n.chapter_def): Promise<boolean> {
		if (this.def) {
			const name = cdef.name;
			this.def.chapters[name] = cdef;
			if (!this.def.metadata.chapters.find((c) => c == name)) {
				this.def.metadata.chapters.push(name);
			}
			return this.flush();
		} else {
			throw new Error('no book open');
		}
	}
	writePlace(pdef: n.place_def): Promise<boolean> {
		const name = pdef.name;
		this.def.places[name] = pdef;
		if (!this.def.metadata.places.find((p) => p == name)) {
			this.def.metadata.places.push(name);
		}
		return this.flush();
	}
	getPerson(name: string): n.person_def {
		return this.def ? this.def.persons[name] : undefined;
	}
	getChapter(title: string): n.chapter_def {
		return this.def ? this.def.chapters[title] : undefined;
	}
	getPlace(name: string): n.place_def {
		return this.def ? this.def.places[name] : undefined;
	}

	getExpose(): string {
		return this.def ? this.def.metadata.expose : undefined;
	}
	readMetadata(): n.metadata_def {
		return this.def ? this.def.metadata : undefined;
	}
	writeMetadata(meta: n.metadata_def): Promise<boolean> {
		if (this.def) {
 			this.def.metadata = meta;
			return this.flush();
		} else {
			throw new Error('no book open');
		}
	}
	getTimeline(): string {
		return this.def ? this.def.timeline : undefined;
	}
	addTimestamp(ds: string): void {
		if (this.def) {
			if (!this.def.timeline) {
				this.def.timeline = '';
			}
			const t = this.def.timeline + ds;
			this.def.timeline = t;
		} else {
			throw new Error('no book open');
		}
	}
}
