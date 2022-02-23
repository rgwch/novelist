/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs';
import { Exporter } from './exporter';

xdescribe('Ebook', () => {
  beforeAll(async () => {
    await Novel.fromDirectory('test/sample', 'default', true);
  });

  afterAll(() => {
    fs.rmSync('test/sample.novel', { force: true });
    fs.rmSync('test/sample.novel_1', { force: true });
    fs.rmSync('test/sample.novel_2', { force: true });
    fs.rmSync('test/sample.novel_3', { force: true });
    fs.rmSync('test/sample.epub', { force: true });
  });
  it('creates an eBook from a Novel', async () => {
    const novel = await Novel.open('test/sample.novel', 'default');
    expect(novel).toBeDefined();
    const ebook = new Exporter(novel);
    const ret = await ebook.toEpub('test/sample.epub');
    expect(fs.existsSync('test/sample.epub')).toBe(true);
  });
});
