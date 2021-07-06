import { DateTime } from 'luxon';
import marked from 'marked';
import globals from '../global';
import type { Novel } from './novel';
import epub from 'epub-gen'

/**
 * Generate ePub from .novel
 */
export class EBook {
  async create(output: string): Promise<any> {
    const novel: Novel = globals.novel;
    const meta: metadata_def = novel.readMetadata();
    meta.id = meta.id || meta.title;
    meta.author = meta.author || 'anonymous';
    meta.genre = meta.genre || 'fiction';
    // meta.cover = meta.cover || `${meta.title}.jpg`;

    let dt = DateTime.fromJSDate(new Date(meta.published));
    const md = marked.setOptions({});
    if (!dt.isValid) {
      dt = DateTime.fromJSDate(new Date());
    }
    meta.published = dt.toFormat('yyyy-LL-dd');
    const options = {
      title: meta.title,
      author: meta.author,
      content: meta.chapters.map(chapter => {
        const text = novel.getChapter(chapter)
        const html = marked(md.parse(text.text));
        return {
          title: chapter,
          data: html
        }
      }),
      verbose: false,
      output
    }
    console.log("writing to " + output)
    return new epub(options, output).promise.then(() =>
      console.log("success"), err => {
        console.log("Error " + err)
      }
    )

  }

}
