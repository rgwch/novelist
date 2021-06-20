import fs from 'fs/promises';
import path from 'path';
import YAML from 'yaml';
import metadataParser from 'markdown-yaml-metadata-parser';

type metadata_def = {
	title: string;
	author?: string;
	chapters: Array<string>;
	persons: Array<string>;
	places: Array<string>;
	// [propName: string]: any;
};
const default_metadata: metadata_def = {
	title: '',
	author: '',
	chapters: [],
	persons: [],
	places: []
};
type person_def = {
	name: string;
	nicknames?: Array<string>;
	gender?: 'm' | 'f';
	height?: number;
	birthDate?: Date;
	description?: string;
};
type place_def = {
	name: string;
	surround?: string;
	description?: string;
};
type chapter_def = {
	title: string;
	persons?: Array<string>;
	places?: Array<string>;
	time: string;
	text: string;
};
type noveldef = {
	metadata: metadata_def;
	persons: {
		[name: string]: person_def;
	};
	places: {
		[name: string]: place_def;
	};
	time: string;
	chapters: {
		[name: string]: chapter_def;
	};
};
export class Novel {
	static open(pathname: string): Promise<Novel> {
		return new Promise((resolve, reject) => {
			fs.readFile(pathname)
				.then((def) => {
					resolve(new Novel(pathname, JSON.parse(def.toString('utf-8'))));
				})
				.catch((err) => {
					console.log(err);
					const def = {
						metadata: default_metadata,
						persons: {},
						places: {},
						chapters: {},
						time: ''
					};
					resolve(new Novel(pathname, def));
				});
		});
	}
	static async fromDirectory(dir: string): Promise<Novel> {
		const def: noveldef = {
			metadata: default_metadata,
			persons: {},
			places: {},
			chapters: {},
			time: ''
		};
		try {
			const time = await fs.readFile(path.resolve(dir, 'time.md'));
			def.time = time.toString('utf-8');
		} catch (err) {
			console.log('no time def found ' + err);
			def.time = '';
		}
		try {
			const meta = await fs.readFile(path.resolve(dir, 'metadata.yaml'));
			def.metadata = YAML.parse((await meta).toString('utf-8'));
		} catch (err) {
			console.log('no metadata found ' + err);
			def.metadata = default_metadata;
		}
		try {
			const persons = await fs.readdir(path.resolve(dir, 'persons'));
			for (const person of persons) {
				const data = await fs.readFile(path.resolve(dir, 'persons', person));
				const split = metadataParser(data.toString('utf-8'));
				def.persons[split.metadata.name] = split.metadata;
				def.persons[split.metadata.name].description = split.content;
			}
		} catch (err) {
			console.log('no persons ' + err);
		}
		try {
			const places = await fs.readdir(path.resolve(dir, 'places'));
			for (const place of places) {
				const data = await fs.readFile(path.resolve(dir, 'places', place));
				const split = metadataParser(data.toString('utf-8'));
				def.places[split.metadata.name] = split.metadata;
				def.places[split.metadata.name].description = split.content;
			}
		} catch (err) {
			console.log('no places ' + err);
		}
		try {
			const chapters = await fs.readdir(path.resolve(dir, 'chapters'));
			for (const chapter of chapters) {
				const data = await fs.readFile(path.resolve(dir, 'chapters', chapter));
				const split = metadataParser(data.toString('utf-8'));
				def.chapters[split.metadata.title] = split.metadata;
				def.chapters[split.metadata.title].text = split.content;
			}
		} catch (err) {
			console.log('no chapters');
		}

		const novel = new Novel(path.resolve(dir, '../..', `${dir}.novel`), def);
		await novel.flush();
		return novel;
	}

	constructor(private pathname: string, private def: noveldef) {}

	async flush(): Promise<void> {
		const file = JSON.stringify(this.def);
		await fs.writeFile(this.pathname, file);
	}

	writePerson(name: string, pdef: person_def): void {
		this.def.persons[name] = pdef;
	}
	getPerson(name: string): person_def {
		return this.def.persons[name];
	}
	readMetadata(): metadata_def {
		return this.def.metadata;
	}
	writeMetadata(meta: metadata_def): void {
		this.def.metadata = meta;
	}
	getTime(): string {
		return this.def.time;
	}
	getPlace(name: string): place_def {
		return this.def.places[name];
	}
	getChapter(name: string): chapter_def {
		return this.def.chapters[name];
	}
}
