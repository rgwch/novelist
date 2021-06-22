import type { EndpointOutput } from '@sveltejs/kit';
import { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import os from 'os'
import path from 'path'

export async function get(request): Promise<EndpointOutput> {
  console.log(JSON.stringify(request.params));
  return Novel.open(path.join(os.homedir(), request.params.novelfile)).then((novel) => {
    globals.novel = novel;
    return {
      body: {
        result: 'ok'
      }
    };
  });
}
