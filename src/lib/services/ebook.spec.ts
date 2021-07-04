/* eslint-disable @typescript-eslint/no-empty-function */
import { Novel } from './novel';
import fs from 'fs';
import {EBook} from '../services/ebook'
import globals from '../global'
import {setPlaintext} from '../services/store'

xdescribe('Ebook', () => {
	beforeAll(async () => {
        setPlaintext(true)
		await Novel.fromDirectory('test/sample', 'default', true);
   
	});

    afterAll(async () => {
        fs.rm('test/sample.novel', () => { });
        fs.rm('test/sample.novel_1', () => { });
        fs.rm('test/sample.novel_2', () => { });
        fs.rm('test/sample.novel_3', () => { });
        setPlaintext(false)
      });
	it('creates an eBook from a Novel', async () => {
        globals.novel = await Novel.open('test/sample.novel',"default");
        expect(globals.novel).toBeDefined;
        const ebook=new EBook()
        const ret=ebook.create()
        expect(fs.existsSync("test/sample.epub")).toBe(true)
    });
});
