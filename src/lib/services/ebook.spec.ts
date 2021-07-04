import { Novel } from './novel';
import fs from 'fs';
import {EBook} from '../services/ebook'

describe('Ebook', () => {
	beforeAll(async () => {
		await Novel.fromDirectory('test/sample', 'default');
	});

	it('creates an eBook from a Novel', async () => {
        const novel = await Novel.open('test/sample.novel',"default");
        expect(novel).toBeDefined;
        const ebook=new EBook()
        const ret=ebook.create()
        expect(fs.existsSync("test/sample.epub")).toBe(true)
    });
});
