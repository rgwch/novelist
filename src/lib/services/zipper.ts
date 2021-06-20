import Zip from 'adm-zip';
import YAML from 'yaml';
import metadataParser from 'markdown-yaml-metadata-parser';

const metadata = {
	title: 'unknown',
	author: 'unknown',
	chapters: [],
	persons: [],
	places: []
};

type person_props = {
	name: string;
	nicknames?: Array<string>;
	gender?: 'm' | 'f';
	height?: number;
	birthdate?: Date;
};
type person = {
	properties: person_props;
	description: string;
};
export class Zipper {
	zipper;
	constructor(private zipname: string, private password?: string) {
		try {
			this.zipper = new Zip(zipname);
		} catch (err) {
			console.log('Error ' + err);
			this.zipper = new Zip();
			this.zipper.addFile('metadata.yaml', YAML.stringify(metadata));
			this.zipper.addFile('persons/', Buffer.alloc(0));
			this.zipper.addFile('places/', Buffer.alloc(0));
			this.zipper.addFile('time.md', '# t0');
			this.zipper.writeZip(zipname);
		}
	}

	list(): Array<string> {
		return this.zipper
			.getEntries()
			.filter((e) => e.isDirectory == false)
			.map((e) => e.entryName);
	}

	getFile(name: string): string {
		const entry = this.zipper.getEntry(name);
		if (entry) {
			return this.zipper.readAsText(entry, 'utf-8');
		} else {
			throw name + ' does not exist';
		}
	}
	writeFile(name: string, content: string): void {
		const entry = this.zipper.getEntry(name);
		if (entry) {
			this.zipper.updateFile(entry, content);
		} else {
			this.zipper.addFile(name, content);
		}
	}
	writePerson(name: string, properties: person_props, content: string): void {
		const output = '---\n' + YAML.stringify(properties) + '\n---\n' + content;
		this.writeFile('persons/' + name + '.md', output);
        const meta=this.readMetadata()
        meta.persons.push(properties.name)
        this.writeMetadata(meta)
	}
	readPerson(name: string): person {
		const raw = this.getFile(name);
		const split = metadataParser(raw);
		return {
			properties: split.metadata,
			description: split.content
		};
	}
	readMetadata(): any {
		const yaml = this.getFile('metadata.yaml');
		return YAML.parse(yaml);
	}

	writeMetadata(json:any): void {
		const yaml = YAML.stringify(json);
		this.writeFile('metadata.yaml', yaml);
	}
}
