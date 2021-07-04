import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import type { metadata_def } from '$lib/services/noveltypes';
import {EBook} from '$lib/services/ebook'

export async function post({ params, body }): Promise<EndpointOutput> {
	try {
		const novel: Novel = globals.novel;
		// const request=JSON.parse(body)
		// console.log(body.filename);
		const meta: metadata_def = novel.readMetadata();
        const epub=new EBook()
		epub.create(meta)
		const p = globals.resolveDir();
		console.log('writing to ' + p + ', ' + meta.title);
		await epub.writeEPUB(p, meta.title);
		return {
			headers: {
				'content-type': 'application/octet-stream'
			},
			status: 200,
			body: {
				message: 'ok'
			}
		};
	} catch (err) {
		console.log(err);
		return {
			status: 500,
			body: {
				message: err
			}
		};
	}
}