import { DateTime } from 'luxon';
import { load } from './fileio';
import nodepub from 'nodepub';
import marked from 'marked';
import path from 'path';
import globals from '../global';
import type { metadata_def } from './noveltypes';
import type { Novel } from './novel';

export class EBook {
	async create() {
		const novel: Novel = globals.novel;
		const meta: metadata_def = novel.readMetadata();
		meta.id = meta.id || meta.title;
		meta.author = meta.author || 'anonymous';
		meta.genre = meta.genre || 'fiction';
		meta.cover = meta.cover || `${meta.title}.jpg`;
		let dt = DateTime.fromJSDate(new Date(meta.published));
		const md = marked.setOptions({});
		if (!dt.isValid) {
			dt = DateTime.fromJSDate(new Date());
		}
		meta.published = dt.toFormat('yyyy-LL-dd');
		try {
			const epub = nodepub.document(meta);
			for (const chapter of meta.chapters) {
				const text = novel.getChapter(chapter);
				const html = marked(md.parse(text.text));
				epub.addSection(chapter, html);
			}

			await epub.writeEPUB(globals.resolveDir(), meta.title);
		} catch (err) {
			console.log(err);
			throw new Error('epub creation failed ' + err);
		}
	}
}
