/********************************************
 * This file is part of Novelist            *
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

const defaultMetadata: metadata_def = {
  title: "",
  author: "",
  created: new Date(),
  chapters: [],
  persons: [],
  places: [],
};

export class Novel {
  private store: Store;
  /**
   * Open a Novel-File. If it doesn't exist: Create a new one
   * @param pathname pathname relative to the configured base-path (defaults to user home)
   * @param password password for encryption of the book
   * @returns a Promise that resolves to the Novel object created from the file or rejects on error
   */
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
              if (lastWrite && lastWrite.getTime() === lastWrite.getTime()) {
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
          metadata: defaultMetadata,
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

  /**
   * Create a Novel-file from a directory. This is useful for debugging purposes, and to confert existing books to .novels
   * The structure of the directory must be as follows:
  <pre>
  name
    metadata.yaml
    chapters
        chapter1.md
        ...
    persons
        name1.md
        ,,, 
    places
        name1.md
    timeline.md    
    notes.md
</pre>    
  The resulting file will be name.novel in the same plase where the directory resides.
   * @param dir Directory with novel structure
   * @param password password for encryption of the resulting .novel file
   * @param force if true, overwrite existing, if false: Fail if file exists.
   * @returns a Promise resolving to the newly created Novel object
   */
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
      metadata: defaultMetadata,
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
      def.metadata = defaultMetadata;
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
        def.chapters[split.metadata.name] = split.metadata;
        def.chapters[split.metadata.name].text = split.content;
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
    password
  ) {
    this.store = new Store(password);
  }

  async changePassword(newPwd: string): Promise<boolean> {
    // console.log("changing password " + newPwd)
    this.store.setPassword(newPwd);
    return this.flush();
  }
  /**
   * Flush and close Novel
   */
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
  /**
   * Flush Novel to disk
   * @returns Promise resolving to true on success
   */
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
  async renamePerson(oldname, newname): Promise<metadata_def> {
    if (!newname) {
      throw new Error("new name is required")
    }
    const existing = this.getPerson(oldname)
    if (existing) {
      const meta = this.readMetadata()
      if (Array.isArray(meta.persons)) {
        const replace = []
        for (const i of meta.persons) {
          if (i === oldname) {
            replace.push(newname)
          } else {
            replace.push(i)
          }
        }
        existing.name = newname;
        if (await this.writePerson(existing)) {
          delete this.def.persons[oldname]
          meta.persons = replace
          await this.writeMetadata(meta)
          return meta
        } else {
          console.log("write failed")
          throw new Error("could not write")
        }
      } else {
        throw new Error("Person metadata not found " + oldname)
      }
    } else {
      throw new Error("Person doesn't exist " + oldname)
    }
  }

  deletePerson(name: string): Promise<boolean> {
    const index = this.def.metadata.persons.indexOf(name);
    if (index === -1) {
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
      if (this.def.metadata.chapters.find((c) => c === name)) {
        if (!cdef.text) {
          console.log("WriteChapter: Empty cdef Text!");
          cdef.text = "##" + name;
        }
      } else {
        this.def.metadata.chapters.push(name);
      }
      return this.flush();
    } else {
      throw new Error("no book open");
    }
  }
  async renameChapter(oldname, newname): Promise<metadata_def> {
    if (!newname) {
      throw new Error("new name is required")
    }
    const existing = this.getChapter(oldname)
    if (existing) {
      const meta = this.readMetadata()
      if (Array.isArray(meta.chapters)) {
        const replace = []
        for (const i of meta.chapters) {
          if (i === oldname) {
            replace.push(newname)
          } else {
            replace.push(i)
          }
        }
        existing.name = newname;
        if (await this.writeChapter(existing)) {
          delete this.def.chapters[oldname]
          meta.chapters = replace
          await this.writeMetadata(meta)
          return meta
        } else {
          console.log("write failed")
          throw new Error("could not write")
        }
      } else {
        throw new Error("Chapter metadata not found " + oldname)
      }
    } else {
      throw new Error("Chapter doesn't exist " + oldname)
    }
  }

  deleteChapter(name: string): Promise<boolean> {
    const index = this.def.metadata.chapters.indexOf(name);
    if (index === -1) {
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
    if (index === -1) {
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
