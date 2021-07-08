/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import fs from "fs";
import path from "path";
import YAML from "yaml";
import metadataParser from "markdown-yaml-metadata-parser";
import { Store } from "./store";
import { promisify } from "util";

const preadFile = promisify(fs.readFile);
const preaddir = promisify(fs.readdir);

const default_metadata: metadata_def = {
  title: "",
  author: "",
  created: new Date(),
  chapters: [],
  persons: [],
  places: [],
};

export class Novel {
  private store: Store;
  static open(pathname: string, password: string): Promise<Novel> {
    // console.log('opening ' + pathname);
    return new Promise((resolve, reject) => {
      if (!pathname.endsWith(".novel")) {
        pathname += ".novel";
      }
      if (fs.existsSync(pathname)) {
        const lockfile: string = pathname + ".lock";
        /*
        if (fs.existsSync(lockfile)) {
          throw new Error("Book already opened")
        }
        fs.writeFileSync(lockfile, new Date().toString())
        */
        const store = new Store(password);
        store
          .load(pathname)
          .then((buffer) => {
            try {
              const json: noveldef = JSON.parse(buffer.toString("utf-8"));
              const lastWrite = new Date(json.metadata.modified);
              if (lastWrite && lastWrite.getTime() == lastWrite.getTime()) {
                resolve(new Novel(pathname, json, password));
              } else {
                reject("invalid date " + json.metadata.modified);
              }
            } catch (err) {
              reject("structure error " + err);
            }
          })
          .catch((err) => {
            console.log("rejected store.load in novel: " + err);
            reject(err);
          });
      } else {
        const def = {
          metadata: default_metadata,
          persons: {},
          places: {},
          chapters: {},
          time: "",
        };
        def.metadata.title = path.basename(pathname, ".novel");
        def.metadata.created = new Date();
        const novel = new Novel(pathname, def, password);
        novel.flush().then(() => {
          resolve(novel);
        });
      }
    });
  }

  static async fromDirectory(
    dir: string,
    password: string,
    force = false
  ): Promise<Novel> {
    const filepath = path.join(dir, "../..", `${dir}.novel`);
    if (fs.existsSync(filepath)) {
      if (force) {
        fs.rmSync(filepath);
      } else {
        throw new Error("file exists " + filepath);
      }
    }
    const def: noveldef = {
      metadata: default_metadata,
      persons: {},
      places: {},
      chapters: {},
      timeline: "",
    };
    def.metadata.created = new Date();
    try {
      const time = await preadFile(path.join(dir, "time.md"));
      def.timeline = time.toString("utf-8");
    } catch (err) {
      console.log("Novel.fromDirectory: no time def found " + err);
      def.timeline = "";
    }
    try {
      const meta = await preadFile(path.join(dir, "metadata.yaml"));
      def.metadata = YAML.parse((await meta).toString("utf-8"));
    } catch (err) {
      console.log("Novel.fromDirectoryno metadata found " + err);
      def.metadata = default_metadata;
    }
    try {
      const persons = await preaddir(path.join(dir, "persons"));
      for (const person of persons) {
        const data = await preadFile(path.join(dir, "persons", person));
        const split = metadataParser(data.toString("utf-8"));
        def.persons[split.metadata.name] = split.metadata;
        def.persons[split.metadata.name].description = split.content;
      }
    } catch (err) {
      console.log("Novel.fromDirectory: no persons " + err);
    }
    try {
      const places = await preaddir(path.join(dir, "places"));
      for (const place of places) {
        const data = await preadFile(path.join(dir, "places", place));
        const split = metadataParser(data.toString("utf-8"));
        def.places[split.metadata.name] = split.metadata;
        def.places[split.metadata.name].description = split.content;
      }
    } catch (err) {
      console.log("Novel.fromDirectory: no places " + err);
    }
    try {
      const chapters = await preaddir(path.join(dir, "chapters"));
      for (const chapter of chapters) {
        const data = await preadFile(path.join(dir, "chapters", chapter));
        const split = metadataParser(data.toString("utf-8"));
        def.chapters[split.metadata.title] = split.metadata;
        def.chapters[split.metadata.title].text = split.content;
      }
    } catch (err) {
      console.log("Novel.fromDirectory: no chapters");
    }

    const novel = new Novel(filepath, def, password);
    await novel.flush();
    return novel;
  }

  constructor(
    private pathname: string,
    private def: noveldef,
    private password
  ) {
    this.store = new Store(this.password);
  }

  async changePassword(newPwd: string): Promise<boolean> {
    // console.log("changing password " + newPwd)
    this.store.setPassword(newPwd);
    return this.flush();
  }
  async close(): Promise<void> {
    return this.flush().then((success) => {
      if (!success) {
        throw new Error("could not write contents to file");
      }
      this.def = undefined;
      const lockfile = this.pathname + ".lock";
      if (fs.existsSync(lockfile)) {
        fs.rm(lockfile, (err) => {
          if (err) {
            throw new Error("could not remove lockfile");
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

  writePerson(pdef: person_def): Promise<boolean> {
    if (this.def) {
      const name = pdef.name;
      this.def.persons[name] = pdef;
      if (!this.def.metadata.persons.find((p) => p == name)) {
        this.def.metadata.persons.push(name);
      }
      return this.flush();
    } else {
      throw new Error("no book open");
    }
  }
  deletePerson(name: string): Promise<boolean> {
    const index = this.def.metadata.persons.indexOf(name);
    if (index == -1) {
      throw new Error("person does not exist " + name);
    }
    this.def.metadata.persons.splice(index, 1);

    delete this.def.persons[name];
    return this.flush();
  }
  writeChapter(cdef: chapter_def): Promise<boolean> {
    if (this.def) {
      if (!cdef) {
        throw new Error("Empty chapter definition");
      }
      const name = cdef.name;
      this.def.chapters[name] = cdef;
      if (this.def.metadata.chapters.find((c) => c == name)) {
        if (!cdef.text) {
          console.log("WriteChapter: Empty cdef Text!");
        }
      } else {
        this.def.metadata.chapters.push(name);
      }
      return this.flush();
    } else {
      throw new Error("no book open");
    }
  }
  deleteChapter(name: string): Promise<boolean> {
    const index = this.def.metadata.chapters.indexOf(name);
    if (index == -1) {
      throw new Error("chapter does not exist " + name);
    }
    this.def.metadata.chapters.splice(index, 1);
    delete this.def.chapters[name];
    return this.flush();
  }
  writePlace(pdef: place_def): Promise<boolean> {
    const name = pdef.name;
    this.def.places[name] = pdef;
    if (!this.def.metadata.places.find((p) => p == name)) {
      this.def.metadata.places.push(name);
    }
    return this.flush();
  }
  deletePlace(name: string): Promise<boolean> {
    const index = this.def.metadata.places.indexOf(name);
    if (index == -1) {
      throw new Error("place does not exist " + name);
    }
    this.def.metadata.places.splice(index, 1);

    delete this.def.places[name];
    return this.flush();
  }
  getPerson(name: string): person_def {
    return this.def ? this.def.persons[name] : undefined;
  }
  getChapter(title: string): chapter_def {
    return this.def ? this.def.chapters[title] : undefined;
  }
  getPlace(name: string): place_def {
    return this.def ? this.def.places[name] : undefined;
  }
  getNotes(): string {
    return this.def ? this.def.notes : undefined;
  }
  getExpose(): string {
    return this.def ? this.def.metadata.expose : undefined;
  }
  readMetadata(): metadata_def {
    return this.def ? this.def.metadata : undefined;
  }
  writeMetadata(meta: metadata_def): Promise<boolean> {
    if (this.def) {
      this.def.metadata = meta;
      return this.flush();
    } else {
      throw new Error("no book open");
    }
  }
  getTimeline(): string {
    return this.def ? this.def.timeline : undefined;
  }
  addTimestamp(ds: string): void {
    if (this.def) {
      if (!this.def.timeline) {
        this.def.timeline = "";
      }
      const t = this.def.timeline + ds;
      this.def.timeline = t;
    } else {
      throw new Error("no book open");
    }
  }
  writeNotes(notes: string): Promise<boolean> {
    if (this.def) {
      this.def.notes = notes;
      return this.flush();
    } else {
      throw new Error("no book open");
    }
  }
}
