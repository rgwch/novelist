/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs';
import { Exporter } from './exporter';

xdescribe('Ebook', () => {

  afterAll(() => {
    fs.rmSync("test/ebook.novel", { force: true })
    fs.rmSync('test/ebook.epub', { force: true });
  });
  it('creates an eBook from a Novel', async () => {
    const novel = await Novel.fromDirectory('test/sample', 'test/ebook','default', true);
    expect(novel).toBeDefined();
    const ebook = new Exporter(novel);
    const ret = await ebook.toEpub('test/ebook.epub');
    expect(fs.existsSync('test/ebook.epub')).toBe(true);
    await novel.close()
  });
});
