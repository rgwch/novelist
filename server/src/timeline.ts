import { Novel } from './novel'


export class Timeline {
    private entries: Array<timeline_entry> = []
    constructor(private novel: Novel) {
        const meta: metadata_def = novel.readMetadata()
        for (const ch in meta.chapters) {
            const t = (ch as chapter_def).time
            if (t) {
                this.entries.push({
                    date: t,
                    offset: 0,
                    chapter: (ch as chapter_def).name
                })
            }
        }
    }
}