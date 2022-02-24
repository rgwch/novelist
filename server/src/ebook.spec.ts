/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs';
import { Exporter } from './exporter';

describe('Ebook', () => {
  beforeAll(async () => {
    await Novel.fromDirectory('test/sample', 'default', true);
    fs.renameSync("test/sample.novel", "test/ebook.novel")
  });

  afterAll(() => {
    fs.rmSync('test/ebook.novel', { force: true });
    fs.rmSync("test/sample.novel", { force: true })
    fs.rmSync('test/sample.epub', { force: true });
  });
  it('creates an eBook from a Novel', async () => {
    const novel = await Novel.open('test/ebook.novel', 'default');
    expect(novel).toBeDefined();
    const ebook = new Exporter(novel);
    const ret = await ebook.toEpub('test/sample.epub');
    expect(fs.existsSync('test/sample.epub')).toBe(true);
  });
});
