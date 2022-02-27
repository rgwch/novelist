import { Novel } from './novel'
import { DateTime } from 'luxon'

/**
 * Pulls the time-descriptions out of chapter metadata. Following entry types are recognized:
 * - date as YYYY-MM-DD with or without time part: YYYY-MM-DDThh:mm:ss
 * - positive or negative offset: +8h, -8D, relative to previous time entry
 *   where the suffix is one of Y,M,W,D,h,m,s for years, months, weeks, days, hours, minutes, seconds
 * Everything after the first space is treated as comment
 * If first chapter does not have an absolute date, reference is current date.
 */
export class Timeline {
  private entries: Array<timeline_entry> = []
  constructor(private novel?: Novel) {
    if (this.novel) {
      this.entries = this.analyze(this.novel)
    }
  }

  public read() {
    return this.entries
  }
  analyze(novel: Novel, startdate: Date = new Date()) {
    let ref = DateTime.fromJSDate(startdate)
    let meta: metadata_def = novel.readMetadata()
    const entries: Array<timeline_entry> = []
    for (const name of meta.chapters) {
      const chapter = novel.getChapter(name)
      const ct = chapter.time
      if (ct) {
        const t = ct.split(" ")[0]
        let remark=ct.substring(t.length+1)
        let dt: DateTime
        let offset: number = 0
        let unit: time_unit = 'days'
        dt = DateTime.fromISO(t,{zone: 'utc'})
        if (!dt.isValid) {
          dt = DateTime.fromFormat(t, 'd.L.y',{zone:'utc'})
        }
        if (!dt.isValid) {
          if (t.startsWith('+') || t.startsWith('-')) {
            offset = parseInt(t.substring(1, t.length - 1))
            switch (t.substring(t.length - 1)) {
              case 's':
                unit = 'seconds'
                break
              case 'm':
                unit = 'minutes'
                break
              case 'h':
                unit = 'hours'
                break
              case 'd':
              case 'D':
                unit = 'days'
                break
              case 'W':
              case 'w':
                unit = 'weeks'
                break
              case 'L':
              case 'M':
                unit = 'months'
                break
              case 'y':
              case 'Y':
                unit = 'years'
                break
              default:
                throw new Error('inalid qualifyer ' + t)
            }
            if (t.startsWith('+')) {
              dt = ref.plus({ [unit]: offset })
            } else {
              dt = ref.minus({ [unit]: offset })
            }
          } else {
            remark=ct
          }
        } else {
          offset = dt.diff(ref).as('days')
          if (offset < 0) {
            offset = 0
          }
        }
        entries.push({
          date: dt.toJSDate(),
          offset,
          unit,
          remark,
          chapter: chapter.name,
          summary: chapter.summary,
        })
        ref=dt
      }
    }
    return entries
  }
}
