import { load, save } from './fileio'
export type TimelineEntry = {
  chapter: string   // Chapter this entry belongs to
  date: string      // Date/time for this entry as YYYY-MM-DDTHH:MM:SS
  offset: number    // Offset of this entry from the beginning  in units
  unit: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years"
}
export class Times {
  private entries: Array<TimelineEntry> = []

  private async scan() {
    try {
      const raw = await load('timeline', "")
      this.entries = JSON.parse(raw)
    } catch (err) {
      alert(err)
    }
  }

  public async fetch(): Promise<Array<TimelineEntry>> {
    await this.scan()
    return this.entries
  }

  public async save() {
    const proc = JSON.stringify(this.entries)
    await save('timeline', proc)
  }

  public add(point: string, chapter: string) {
    

  }
}