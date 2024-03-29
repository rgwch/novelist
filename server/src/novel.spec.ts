import { storeFactory } from './store-factory';
// tslint:disable:no-empty

import { Novel } from './novel';
import fs from 'fs'
import path from 'path'
// jest.setTimeout(100000)

describe('Novel', () => {


  afterEach(async () => {
    await storeFactory.removeAll(/sample[0-9].*/)
  })

  afterAll(async () => {
    await storeFactory.removeAll(/novelspec[0-9].*/)
    // await storeFactory.removeAll(/novelspec_[0-9]{4}-[0-9]{2}-[0-9]{2}.novel/)
  })

  it("creates a novel from a directory", async () => {
    await Novel.fromDirectory('test/sample', "novelspec1", "default", true)
    const novel = await Novel.open('novelspec1.novel', "default");
    expect(novel).toBeDefined();
    await novel.close()
  })
  it('reads files from the noveldef', async () => {
    await Novel.fromDirectory('test/sample', "novelspec2", "default", true)
    const novel = await Novel.open('novelspec2.novel', "default");
    const brutus = novel.getPerson('Brutus Allerdice');
    expect(brutus).toBeDefined();
    const chapter = novel.getChapter('First Chapter')
    expect(chapter).toBeDefined()
    expect(novel.readMetadata()).toBeDefined();
    expect(novel.getTimeline()).toBeDefined();
    await novel.close()
  });
  it('creates a new noveldef', async () => {
    const novel = await Novel.open('sample1', "default");
    const metadata = novel.readMetadata();
    expect(metadata).toBeDefined();
    expect(metadata.title).toEqual('sample1');
    await novel.close()
  });

  it('adds and modifies a file', async () => {
    const novel = await Novel.open('sample2', "default");
    await novel.writePerson({
      name: 'Elvis Aalborg',
      nicknames: 'fish, elvis',
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
    elvis.nicknames = 'elv, elvis, HIM';
    await novel.writePerson(elvis)
    await novel.close()
    expect(novel.readMetadata()).toBeUndefined()

  });
  it('renames a chapter', async () => {
    await Novel.fromDirectory('test/sample', "novelspec3", "default", true)
    const novel = await Novel.open('novelspec3.novel', "default");
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
    await novel.close()
  })

  it('deletes a chapter', async () => {
    await Novel.fromDirectory('test/sample', "novelspec4", "default", true)
    const novel = await Novel.open('novelspec4.novel', "default");
    expect(novel).toBeDefined()
    const chapter = novel.getChapter("First Chapter")
    expect(chapter).toBeTruthy()
    expect(chapter.name).toEqual("First Chapter")
    await novel.writeChapter({ name: "Chapter 2", text: "# 2" })
    await novel.writeChapter({ name: "Chapter 3", text: "# 3" })
    await novel.writeChapter({ name: "Chapter 4", text: "# 4" })
    await novel.deleteChapter("First Chapter")
    expect(novel.getChapter("First Chapter")).toBeUndefined()
    await novel.deleteChapter("Chapter 3")
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
    await novel.close()
  })

  it("adds a person only once", async () => {
    await Novel.fromDirectory('test/sample', "novelspec5", "default", true)
    const novel = await Novel.open("novelspec5.novel", "default");
    await novel.writePerson({
      name: "hans",
      nicknames: "peter"
    })
    await novel.writePerson({
      name: "Peter",
      nicknames: "hans"
    }),
      await novel.writePerson({
        name: "hans",
        nicknames: "fritz"
      })
    const meta = novel.readMetadata()
    expect(meta.persons.length).toEqual(3)
  })
  it("crossrefs persons and places", async () => {
    await Novel.fromDirectory('test/sample', "novelspec6", "default", true)
    const novel = await Novel.open("novelspec6.novel", "default");
    const chapter = novel.getChapter("First Chapter")
    chapter.text = "There was Brutus Allerdice waiting in Illyria."
    await novel.writeChapter(chapter)
    const modified = novel.getChapter("First Chapter")
    expect(modified.persons).toBeInstanceOf(Array)
    expect(modified.persons.length).toBe(2)
    expect(modified.persons[0]).toEqual("Brutus Allerdice")
    expect(modified).toHaveProperty("places")
    expect(modified.places).toBeInstanceOf(Array)
    expect(modified.places.length).toBe(1)
    expect(modified.places[0]).toEqual("Illyria")
    await novel.writeChapter({ name: "Second Chapter", text: "Then, the Commander came aboard" })
    const nicknamed = novel.getChapter("Second Chapter")
    expect(nicknamed.persons).toBeInstanceOf(Array)
    expect(nicknamed.persons.length).toBe(1)
    expect(nicknamed.persons[0]).toEqual("Brutus Allerdice (Commander)")
    await novel.writeChapter({ name: "Third Chapter", text: "Brute joined the crew" })
    const c3 = novel.getChapter("Third Chapter")
    expect(c3.persons.length).toBe(1)
    expect(c3.persons[0]).toEqual("Brutus Allerdice (Brute)")
    await novel.close()
  })
  it('fixes structural problems', async () => {
    await Novel.fromDirectory('test/sample', "novelspec7", "default", true)
    const novel = await Novel.open('novelspec7.novel', "default");
    expect(novel).toBeDefined()
    await novel.ensureIntegrity()
    const meta = novel.readMetadata()
    const personsNumber = meta.persons.length
    const check = meta.persons[0]
    meta.persons.push(null)
    meta.persons.push(check)
    meta.persons.push(check)
    meta.persons.push("tst")
    await novel.writeMetadata(meta)
    await novel.ensureIntegrity()
    const korr = novel.readMetadata()
    expect(meta.persons.length).toBe(personsNumber + 1)
    expect(novel.getPerson(check)).toBeTruthy()
    expect(novel.getPerson("tst")).toBeTruthy()
    expect(novel.getPerson(undefined)).toBeFalsy()
    await novel.close()
  })
});

