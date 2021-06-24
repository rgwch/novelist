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
  // console.log("get: " + JSON.stringify(headers));
  if (!globals.novel) {
    return {
      status: 420,
      body: {
        Error: "No book selected"
      }
    }
  }
  try {
    const novel: Novel = globals.novel
    let result = {}
    switch (params.filetype) {
      case 'chapter':
        result = await novel.getChapter(params.title)
        break;
      default:
        return {
          status: 400
        }

    }
    return {
      body: result
    };
  } catch (err) {
    console.log(err)
    return {
      status: 500
    }
  }
}

export async function post({ params, body }): Promise<EndpointOutput> {
  console.log("post " + JSON.stringify(params));
  try {
    const def = JSON.parse(body);
    const novel: Novel = globals.novel;
    if (!novel) {
      return {
        status: 420,
        body: {
          Error: "No book selected"
        }
      };
    }
    try {
      switch (params.filetype) {
        case 'chapter':
          await novel.writeChapter(def);
          break;
        default:
          return {
            status: 400
          };
      }

      return {
        body: {
          result: 'ok'
        }
      };
    } catch (serverErr) {
      console.log(serverErr)
      return {
        status: 500
      }
    }
  } catch (clientErr) {
    console.log(clientErr)
    return {
      status: 400
    }
  }


}
