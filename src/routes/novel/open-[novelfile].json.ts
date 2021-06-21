import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import fs from 'fs/promises'

export async function get({ params }): Promise<EndpointOutput> {
	console.log(JSON.stringify(params));
	return Novel.open("/home/gerry/"+params.novelfile).then((novel) => {
		globals.novel = novel;
		return {
			body: {
				result: 'ok'
			}
		};
	});
}
