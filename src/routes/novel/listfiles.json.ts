import globals from '$lib/global';
import fs from 'fs';
import type { EndpointOutput} from '@sveltejs/kit';

export async function get(request): Promise<EndpointOutput> {
	const files = fs.readdirSync(globals.resolveDir());
	const list = files.filter((file) => file.endsWith('.novel'));
	return {
		status: 200,
		body: {
			result: list
		}
	};
}
