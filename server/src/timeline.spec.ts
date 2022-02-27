import { Timeline } from "./timeline";
import { Novel } from './novel'
import fs from 'fs'
import path from 'path'

describe("Timeline", () => {
  const chapters = {
    eins: {
      name: "eins",
      time: "2022-01-23"
    },
    zwei: {
      name: "zwei",
      time: "+10D"
    },
    drei: {
      name: "drei",
      time: "+3w"
    },
    vier: {
      name: "vier",
      time: "18.3.2022"
    },
    fuenf: {
      name: "fünf",
      time: "-3M"
    }
  }
  afterEach(() => {
    const files = fs.readdirSync('test')
    for (const file of files) {
      if (file.match(/.+\.novel/)) {
        fs.rmSync(path.join('test', file))
      }
    }
  })

  it("analyzes a timeline", async () => {
    const novel = await Novel.fromDirectory("test/sample", 'test/timeline', 'default', true)
    for (const chapter in chapters) {
      await novel.writeChapter(chapters[chapter])
    }

    const t = new Timeline(novel)
    const arr = t.read()
    expect(arr).toBeInstanceOf(Array)
    expect(arr).toHaveLength(6)
    novel.close()
  })
})