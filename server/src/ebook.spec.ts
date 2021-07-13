/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs';
import { Exporter } from './exporter';
import { setPlaintext } from './store';

describe('Ebook', () => {
  beforeAll(async () => {
    setPlaintext(true);
    await Novel.fromDirectory('test/sample', 'default', true);
  });

  afterAll(async () => {
    fs.rm('test/sample.novel', () => { });
    fs.rm('test/sample.novel_1', () => { });
    fs.rm('test/sample.novel_2', () => { });
    fs.rm('test/sample.novel_3', () => { });
    fs.rm('test/sample.epub', () => { });
    setPlaintext(false);
  });
  it('creates an eBook from a Novel', async () => {
    const novel = await Novel.open('test/sample.novel', 'default');
    expect(novel).toBeDefined();
    const ebook = new Exporter(novel);
    const ret = await ebook.toEpub('test/sample.epub');
    expect(fs.existsSync('test/sample.epub')).toBe(true);
  });
});
