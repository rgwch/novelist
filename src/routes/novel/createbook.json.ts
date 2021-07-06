import type { EndpointOutput } from '@sveltejs/kit';
import type { Novel } from '$lib/services/novel';
import globals from '$lib/global';
import { EBook } from '$lib/services/ebook'
import path from 'path'

export async function post({ params, body }): Promise<EndpointOutput> {
  try {
    const novel: Novel = globals.novel;
    // const request=JSON.parse(body)
    // console.log(body.filename);
    const meta: metadata_def = novel.readMetadata();
    const epub = new EBook()

    const p = globals.resolveDir();
    console.log('writing to ' + p + ', ' + meta.title);
    await epub.create(path.join(globals.resolveDir(), meta.title + ".epub"));
    return {
      headers: {
        'content-type': 'application/octet-stream'
      },
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
