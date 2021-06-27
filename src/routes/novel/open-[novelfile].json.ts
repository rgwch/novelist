/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import path from 'path';

export async function get(request): Promise<EndpointOutput> {
	globals.novel = await Novel.open(path.join(globals.resolveDir(), request.params.novelfile));
	return {
		body: {
			result: globals.novel ? globals.novel.def.metadata : 'fail'
		}
	};
}
