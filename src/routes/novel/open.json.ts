import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import path from 'path';

export async function post({ params, body }): Promise<EndpointOutput> {
  try {
    if (globals.novel) {
      const novel: Novel = globals.novel
      await novel.close()
    }
    const request = JSON.parse(body)
    globals.novel = await (Novel.open(path.join(globals.resolveDir(), request.filename), request.password))
    return {
      body: {
        result: globals.novel ? globals.novel.def.metadata : 'fail'
      }
    }
  } catch (err) {
    return {
      status: 500,
      body: {
        message: "Open error: Bad password or file corrupt."
      }
    }
  }
}