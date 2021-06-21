import type { EndpointOutput } from '@sveltejs/kit';

export async function get({params, headers}): Promise<EndpointOutput> {
	console.log(JSON.stringify(params));
	console.log(JSON.stringify(headers));
	return {
		body: {
			result: 'ok',
			pwd: __dirname

		}
	};
}
