
import fsp from 'fs/promises';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import metadataParser from 'markdown-yaml-metadata-parser';
import { Store } from './store'

type metadata_def = {
  title: string;
  author?: string;
  created: Date;
  modified?: Date;
  chapters: Array<string>;
  persons: Array<string>;
  places: Array<string>;
  // [propName: string]: any;
};
const default_metadata: metadata_def = {
  title: '',
  author: '',
  created: new Date(),
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
  summary?: string;
  time?: string;
  text?: string;
};
type noveldef = {
  metadata: metadata_def;
  expose?: string
  persons?: {
    [name: string]: person_def;
  };
  places?: {
    [name: string]: place_def;
  };
  timeline?: string;
  chapters: {
    [name: string]: chapter_def;
  };
};


export class Novel {
  private store: Store
  static open(pathname: string, password = 'default'): Promise<Novel> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(pathname)) {
        const store = new Store(password)
        store.load(pathname).then(buffer => {
          resolve(new Novel(pathname, JSON.parse(buffer.toString('utf-8'))));
        })
      } else {
        const def = {
          metadata: default_metadata,
          persons: {},
          places: {},
          chapters: {},
          time: ''
        };
        def.metadata.created = new Date();
        resolve(new Novel(pathname, def));
      }
    });
  }

  static async fromDirectory(dir: string, password?: string): Promise<Novel> {
    const def: noveldef = {
      metadata: default_metadata,
      persons: {},
      places: {},
      chapters: {},
      timeline: ''
    };
    def.metadata.created = new Date();
    try {
      const time = await fsp.readFile(path.resolve(dir, 'time.md'));
      def.timeline = time.toString('utf-8');
    } catch (err) {
      console.log('no time def found ' + err);
      def.timeline = '';
    }
    try {
      const meta = await fsp.readFile(path.resolve(dir, 'metadata.yaml'));
      def.metadata = YAML.parse((await meta).toString('utf-8'));
    } catch (err) {
      console.log('no metadata found ' + err);
      def.metadata = default_metadata;
    }
    try {
      const persons = await fsp.readdir(path.resolve(dir, 'persons'));
      for (const person of persons) {
        const data = await fsp.readFile(path.resolve(dir, 'persons', person));
        const split = metadataParser(data.toString('utf-8'));
        def.persons[split.metadata.name] = split.metadata;
        def.persons[split.metadata.name].description = split.content;
      }
    } catch (err) {
      console.log('no persons ' + err);
    }
    try {
      const places = await fsp.readdir(path.resolve(dir, 'places'));
      for (const place of places) {
        const data = await fsp.readFile(path.resolve(dir, 'places', place));
        const split = metadataParser(data.toString('utf-8'));
        def.places[split.metadata.name] = split.metadata;
        def.places[split.metadata.name].description = split.content;
      }
    } catch (err) {
      console.log('no places ' + err);
    }
    try {
      const chapters = await fsp.readdir(path.resolve(dir, 'chapters'));
      for (const chapter of chapters) {
        const data = await fsp.readFile(path.resolve(dir, 'chapters', chapter));
        const split = metadataParser(data.toString('utf-8'));
        def.chapters[split.metadata.title] = split.metadata;
        def.chapters[split.metadata.title].text = split.content;
      }
    } catch (err) {
      console.log('no chapters');
    }

    const novel = new Novel(path.resolve(dir, '../..', `${dir}.novel`), def, password);
    await novel.flush();
    return novel;
  }

  constructor(private pathname: string, private def: noveldef, private password = 'default') {
    this.store = new Store(this.password)
  }

  flush(): Promise<boolean> {
    this.def.metadata.modified = new Date();
    const buff = Buffer.from(JSON.stringify(this.def));
    return this.store.save(this.pathname, buff)
  }

  writeExpose(text: string): void {
    this.def.expose = text
    this.flush()
  }

  writePerson(pdef: person_def): void {
    const name = pdef.name;
    this.def.persons[name] = pdef;
    if (!this.def.metadata.persons.find((p) => p == name)) {
      this.def.metadata.persons.push(name);
    }
    this.flush();
  }
  writeChapter(cdef: chapter_def): void {
    const title = cdef.title;
    this.def.chapters[title] = cdef;
    if (!this.def.metadata.chapters.find((c) => c == title)) {
      this.def.metadata.chapters.push(title);
    }
    this.flush();
  }
  writePlace(pdef: place_def): void {
    const name = pdef.name;
    this.def.places[name] = pdef;
    if (!this.def.metadata.places.find((p) => p == name)) {
      this.def.metadata.places.push(name);
    }
    this.flush();
  }
  getPerson(name: string): person_def {
    return this.def.persons[name];
  }
  getChapter(title: string): chapter_def {
    return this.def.chapters[title];
  }
  getPlace(name: string): place_def {
    return this.def.places[name];
  }

  getExpose(): string {
    return this.def.expose
  }
  readMetadata(): metadata_def {
    return this.def.metadata;
  }
  writeMetadata(meta: metadata_def): void {
    this.def.metadata = meta;
  }
  getTimeline(): string {
    return this.def.timeline;
  }
  addTimestamp(ds: string): void {
    const t = this.def.timeline + ds;
    this.def.timeline = t;
  }
}
