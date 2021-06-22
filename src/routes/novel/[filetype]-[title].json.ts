import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';

export async function get({ params, headers }): Promise<EndpointOutput> {
	console.log(JSON.stringify(params));
	console.log(JSON.stringify(headers));
	return {
		body: {
			result: 'ok',
			params
		}
	};
}

export async function post({ params, body, query }): Promise<EndpointOutput> {
	console.log(JSON.stringify(params));
	console.log(body);

	const def = JSON.parse(body);

	if (!globals.novel) {
		return {
			status: 500
		};
	}
	const novel: Novel = globals.novel;

	switch (params.filetype) {
		case 'chapter':
			await novel.writeChapter(def);
			break;
		default:
			return {
				status: 403
			};
	}

	return {
		body: {
			result: 'ok'
		}
	};
}
