/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs'

describe('Novel', () => {
  beforeAll(async () => {
    await Novel.fromDirectory('test/sample');
  });

  afterAll(async () => {
    fs.rm('test/sample.novel', () => { });
    fs.rm('test/sample1.novel', () => { });
    fs.rm('test/sample1.novel_1', () => { });
    fs.rm('test/sample1.novel_2', () => { });

  });
  it('opens a noveldef', async () => {
    const novel = await Novel.open('test/sample.novel');
    expect(novel).toBeDefined;
  });
  it('reads files from the noveldef', async () => {
    const novel = await Novel.open('test/sample.novel');
    const brutus = novel.getPerson('Brutus Allerdice');
    expect(brutus).toBeDefined;
    expect(novel.readMetadata()).toBeDefined;
    expect(novel.getTimeline()).toBeDefined;
  });
  it('creates a new noveldef', async () => {
    const novel = await Novel.open('test/sample1.novel');
    const metadata = novel.readMetadata();
    expect(metadata).toBeDefined;
    expect(metadata.title).toEqual('sample1');
  });

  it('adds and modifies a file', async () => {
    const novel = await Novel.open('test/sample1.novel');
    novel.writePerson({
      name: 'Elvis Aalborg',
      nicknames: ['fish', 'elvis'],
      description: 'A Sample person'
    });
    const meta = novel.readMetadata();
    expect(meta).toBeDefined;
    expect(meta.persons).toBeDefined;
    expect(meta.persons).toBeInstanceOf(Array);
    expect(meta.persons[0]).toEqual('Elvis Aalborg');
    const elvis = novel.getPerson('Elvis Aalborg');
    expect(elvis).toBeDefined;
    expect(elvis.description).toBeDefined;
    elvis.description = 'This is only a sample person';
    elvis.nicknames = ['elv', 'elvis', 'HIM'];
    novel.writePerson(elvis);
  });
});
