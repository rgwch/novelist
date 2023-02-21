import { DateTime } from 'luxon';
import marked from 'marked';
import { Novel } from './novel';
import epub from 'epub-gen'
import path from 'path'
import config from 'config'
/**
 * Generate ePub from .novel
 */
export class Exporter {
  constructor(private novel: Novel) { }

  async toEpub(output: string): Promise<any> {
    const meta: metadata_def = this.novel.readMetadata();
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
      const text = this.novel.getChapter(chapter)
      if (text && text.text) {
        const html = marked(text.text);
        return {
          title: chapter,
          data: html
        }
      }
    }).filter(el => el)

    // console.log(JSON.stringify(options))
    // console.log("writing ebook to " + output)
    return new epub(options, output).promise.then(() => {
      return output
    }
      /* console.log("success"), (err: any) => {
        console.log("Error " + err) 
      } */
    )
  }

  async toHtml(): Promise<string> {
    const metadata = this.novel.readMetadata()

    const chapters = metadata.chapters;

    let html = '';
    marked.setOptions({});

    for (const chapter of chapters) {
      const text: chapter_def = this.novel.getChapter(chapter);
      if (text && text.text) {
        const compiled = marked(text.text);
        html = html + '<p>' + compiled + '</p>';
      }
    }
    return html

  }
}
