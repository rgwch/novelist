import { Novel } from './novel'
import { DateTime } from 'luxon'


export class Timeline {
    private entries: Array<timeline_entry> = []
    constructor(private novel?: Novel) {
        if (this.novel) {
            const meta: metadata_def = this.novel.readMetadata()
            this.entries = this.analyze(meta.chapters)
        }
    }

    analyze(chapters, startdate: Date=new Date()) {
        const start=DateTime.fromJSDate(startdate)
        const entries: Array<timeline_entry> = []
        for (const ch in chapters) {
            const t = (chapters[ch] as chapter_def).time
            if (t) {
                let dt: DateTime
                let offset: number = 0
                let unit: time_unit = "days"
                dt = DateTime.fromISO(t)
                if (!dt.isValid) {
                    if (t.startsWith("+")) {
                        offset = parseInt(t.substring(1, t.length - 1))
                        switch (t.substring(t.length)) {
                            case "s": unit = "seconds"; break
                            case "m": unit = "minutes"; break;
                            case "h": unit = "hours"; break;
                            case "D": unit = "days"; break;
                            case "M": unit = "months"; break;
                            case "Y": unit = "years"; break;
                            default:
                                throw new Error("inalid qualifyer " + t)

                        }
                        dt = start.plus({ [unit]: offset })
                    } else {
                        throw new Error("invalid date format " + t)
                    }
                } else {
                    //offset=start
                }
                entries.push({
                    date: dt.toJSDate(),
                    offset,
                    unit,
                    chapter: (ch as chapter_def).name
                })
            }
        }
        return entries
    }

}