// tslint:disable:no-empty

import { Novel } from './novel';
import fs from 'fs'

describe('Novel', () => {
  beforeEach(async () => {
    await Novel.fromDirectory('test/sample', "default", true);
    const exists = fs.existsSync('test/sample.novel')
    expect(exists).toBe(true)

  });

  afterAll(async () => {

    fs.rm('test/sample.novel', () => { });
    fs.rm("test/sample.novel_1",()=>{})
    fs.rm("test/sample.novel_2",()=>{})
   
    fs.rm('test/sample1.novel', () => { });
    fs.rm('test/sample1.novel_1', () => { });
    fs.rm('test/sample1.novel_2', () => { });
    fs.rm('test/sample1.novel_3', () => { });

  });
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
});
