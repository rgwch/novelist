import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import os from 'os'
import path from 'path'

export async function get(request): Promise<EndpointOutput> {
  console.log(JSON.stringify(request.params));
  globals.novel = await Novel.open(path.join(os.homedir(), request.params.novelfile))
  return {
    body: {
      result: (globals.novel ? globals.novel.def.metadata : "fail")
    }
  };

}
