// tslint:disable:no-empty

import { Novel } from './novel';
import fs from 'fs'
import path from 'path'

describe('Novel', () => {
  beforeEach((done) => {
    Novel.fromDirectory('test/sample', "default", true).then(res=>{
      const exists = fs.existsSync('test/sample.novel')
      expect(exists).toBe(true)
      setTimeout(()=>done(),100)
    });
  });

  afterEach(() => {
    const files = fs.readdirSync('test')
    for (const file of files) {
      if (file.match(/.+\.novel/)) {
        fs.rmSync(path.join('test', file))
      }
    }
  })


  it("creates a novel from a directory", async () => {
    const novel = await Novel.open('test/sample.novel', "default");
    expect(novel).toBeDefined();
  })
  it('reads files from the noveldef', async () => {
    const novel = await Novel.open('test/sample.novel', "default");
    const brutus = novel.getPerson('Brutus Allerdice');
    expect(brutus).toBeDefined();
    const chapter = novel.getChapter('First Chapter')
    expect(chapter).toBeDefined()
    expect(novel.readMetadata()).toBeDefined();
    expect(novel.getTimeline()).toBeDefined();
  });
  it('creates a new noveldef', async () => {
    const novel = await Novel.open('test/sample1.novel', "default");
    const metadata = novel.readMetadata();
    expect(metadata).toBeDefined();
    expect(metadata.title).toEqual('sample1');
  });

  it('adds and modifies a file', async () => {
    const novel = await Novel.open('test/sample1.novel', "default");
    novel.writePerson({
      name: 'Elvis Aalborg',
      nicknames: ['fish', 'elvis'],
      description: 'A Sample person'
    });
    const meta = novel.readMetadata();
    expect(meta).toBeDefined();
    expect(meta.persons).toBeDefined();
    expect(meta.persons).toBeInstanceOf(Array);
    expect(meta.persons[0]).toEqual('Elvis Aalborg');
    const elvis = novel.getPerson('Elvis Aalborg');
    expect(elvis).toBeDefined();
    expect(elvis.description).toBeDefined();
    elvis.description = 'This is only a sample person';
    elvis.nicknames = ['elv', 'elvis', 'HIM'];
    const written = await novel.writePerson(elvis);
    expect(written).toBeTruthy()
    await novel.close()
    expect(novel.readMetadata()).toBeUndefined()

  });
  it('renames a chapter', async () => {
    const novel = await Novel.open('test/sample.novel', "default");
    expect(novel).toBeDefined()
    const chapter = novel.getChapter("First Chapter")
    expect(chapter).toBeTruthy()
    expect(chapter.name).toEqual("First Chapter")
    const newmeta = await novel.renameChapter("First Chapter", "Chapter One")
    expect(newmeta.chapters.indexOf("First Chapter")).toEqual(-1)
    expect(newmeta.chapters.indexOf("Chapter One")).toBeGreaterThan(-1)
    const newChapter = novel.getChapter("Chapter One")
    expect(newChapter).toBeTruthy()
    const oldChapter = novel.getChapter("First Chapter")
    expect(oldChapter).toBeUndefined()
  })

  it('deletes a chapter', async () => {
    const novel = await Novel.open('test/sample.novel', "default");
    expect(novel).toBeDefined()
    const chapter = novel.getChapter("First Chapter")
    expect(chapter).toBeTruthy()
    expect(chapter.name).toEqual("First Chapter")
    expect(await novel.writeChapter({ name: "Chapter 2", text: "# 2" })).toBeTruthy()
    expect(await novel.writeChapter({ name: "Chapter 3", text: "# 3" })).toBeTruthy()
    expect(await novel.writeChapter({ name: "Chapter 4", text: "# 4" })).toBeTruthy()
    expect(await novel.deleteChapter("First Chapter")).toBeTruthy()
    expect(novel.getChapter("First Chapter")).toBeUndefined()
    expect(await novel.deleteChapter("Chapter 3")).toBeTruthy()
    const ch2 = novel.getChapter("Chapter 2")
    const ch3 = novel.getChapter("Chapter 3")
    const ch4 = novel.getChapter("Chapter 4")
    expect(ch2).toBeDefined()
    expect(ch2.text).toEqual("# 2")
    expect(ch3).toBeUndefined()
    expect(ch4).toBeDefined()
    expect(ch4.text).toEqual("# 4")
    const meta = novel.readMetadata();
    expect(meta.chapters).toHaveLength(2)
  })
});

