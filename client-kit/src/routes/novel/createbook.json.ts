import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import { EBook } from '$lib/services/ebook'
import path from 'path'

export async function post({ params, body }): Promise<EndpointOutput> {
  try {
    const novel: Novel = globals.novel;
    const meta: metadata_def = novel.readMetadata();
    const epub = new EBook()

    const p = globals.resolveDir();
    await epub.create(path.join(p, meta.title + ".epub"));
    return {
      /*
      headers: {
        'content-type': 'application/octet-stream'
      },*/
      status: 200,
      body: {
        message: 'ok'
      }
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      body: {
        message: err
      }
    };
  }
}
