/********************************************
 * This file is part of Novelist            *
 * Copyright (c) 2021 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';

export async function get({ params, headers }): Promise<EndpointOutput> {
  console.log("get:" + JSON.stringify(params));
  console.log("get: " + JSON.stringify(headers));
  return {
    body: {
      result: 'ok',
      params
    }
  };
}

export async function post({ params, body, query }): Promise<EndpointOutput> {
  console.log("post " + JSON.stringify(params));

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
