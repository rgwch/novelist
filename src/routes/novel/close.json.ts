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
  if (novel) {
    await novel.close();
    globals.novel = undefined
    return {
      status: 200
    };
  } else {
    return {
      status: 200,
      body: {
        "message": "No file was open"
      }
    }
  }
}
