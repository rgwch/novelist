/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import global from '$lib/global';
import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';

export async function get(/* request: EndpointData */): Promise<EndpointOutput> {
	if (global.novel) {
		return {
			status: 200,
			body: {
				metadata: global.novel.def.metadata
			}
		};
	} else {
		return {
			status: 404,
			body: {
				result: 'not found'
			}
		};
	}
}
export async function post({ body }): Promise<EndpointOutput> {
	console.log('write metadata ' + JSON.stringify(body));
	try {
		const novel: Novel = global.novel;
		if (!novel) {
			return {
				status: 420,
				body: {
					Error: 'No book selected'
				}
			};
		} else {
			await novel.writeMetadata(JSON.parse(body));
			return {
				status: 200,
				body: {
					message: 'ok'
				}
			};
		}
	} catch (err) {
		return {
			status: 500,
			body: {
				Error: err
			}
		};
	}
}
