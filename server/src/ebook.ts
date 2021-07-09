import { DateTime } from 'luxon';
import marked from 'marked';
import {config} from './config';
import { Novel } from './novel';
import epub from 'epub-gen'
import { globalAgent } from 'http';

/**
 * Generate ePub from .novel
 */
export class EBook {
  async create(output: string): Promise<any> {
    const novel: Novel = config.novel as unknown as Novel
    const meta: metadata_def = novel.readMetadata();

    meta.id = meta.id || meta.title;
    meta.author = meta.author || 'anonymous';
    meta.genre = meta.genre || 'fiction';
    // meta.cover = meta.cover || `${meta.title}.jpg`;

    let dt = DateTime.fromJSDate(new Date(meta.published as string));
    marked.setOptions({});
    if (!dt.isValid) {
      dt = DateTime.fromJSDate(new Date());
    }
    meta.published = dt.toFormat('yyyy-LL-dd');
    const options: any = Object.assign({}, meta)
    delete options.chapters
    delete options.persons
    delete options.places
    options.content = meta.chapters?.map(chapter => {
      const text = novel.getChapter(chapter)
      if (text && text.text) {
        const html = marked(text.text);
        return {
          title: chapter,
          data: html
        }
      }
    }).filter(el => el)

    // console.log(JSON.stringify(options))
    console.log("writing ebook to " + output)
    return new epub(options, output).promise.then(() =>
      console.log("success"), (err: any) => {
        console.log("Error " + err)
      }
    )
  }


}
