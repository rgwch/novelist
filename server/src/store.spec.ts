/* eslint-disable @typescript-eslint/no-empty-function */

import { Store } from './store'
import fs from 'fs'


describe("Store", () => {
  afterAll(() => {
    fs.rmSync("test/dump.store", { force: true })
    fs.rmSync("test/dump.store_1", { force: true })
    fs.rmSync("test/dump.store_2", { force: true })
    fs.rmSync("test/dump.store_3", { force: true })
  })

  it("saves and retrieves serialized data", async () => {
    const store = new Store('default');
    const buffer = Buffer.alloc(100, "*", "utf-8")
    expect(async ()=>await store.save("test/dump.store", buffer)).not.toThrow()
    const retrieved = await store.load("test/dump.store")
    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(buffer)
  })
  it("generates multiple generations of backup", async () => {
    const store = new Store('default');
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save("test/dump.store", buffer)
    await store.save("test/dump.store", buffer)
    await store.save("test/dump.store", buffer)
    expect(fs.existsSync("test/dump.store_1")).toBe(true)
    expect(fs.existsSync("test/dump.store_2")).toBe(true)
    expect(fs.existsSync("test/dump.store_3")).toBe(true)
  })
})
