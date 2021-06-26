/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const novel: Novel = globals.novel;
	await novel.close();
	return {
		status: 200
	};
}
