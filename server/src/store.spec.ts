/* eslint-disable @typescript-eslint/no-empty-function */

import { Store } from './store'
import fs from 'fs'


describe("Store", () => {
  afterAll(() => {
    fs.rm("test/dump.store", () => { })
    fs.rm("test/dump.store_1", () => { })
    fs.rm("test/dump.store_2", () => { })
    fs.rm("test/dump.store_3", () => { })
  })

  it("saves and retrieves serialized data", async () => {
    const store = new Store('default');
    const buffer = Buffer.alloc(100, "*", "utf-8")
    const saved = await store.save("test/dump.store", buffer)
    expect(saved).toBe(true)
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
