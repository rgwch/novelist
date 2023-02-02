/* eslint-disable @typescript-eslint/no-empty-function */

import fs from 'fs'
import { storeFactory } from './store-factory'

describe("Store", () => {
  afterAll(() => {
    fs.rmSync("test/dump.store", { force: true })
    fs.rmSync("test/dump.store_1", { force: true })
    fs.rmSync("test/dump.store_2", { force: true })
    fs.rmSync("test/dump.store_3", { force: true })
  })

  it("saves and retrieves serialized data", async () => {
    const store = storeFactory.createStore("dump.store", "default");
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    const retrieved = await store.load()
    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(buffer)
  })
  it("generates multiple generations of backup", async () => {
    const store:IStore = storeFactory.createStore("dump.store","default")
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    await store.save(buffer)
    await store.save(buffer)
    expect(fs.existsSync("test/dump.store_1")).toBe(true)
    expect(fs.existsSync("test/dump.store_2")).toBe(true)
    expect(fs.existsSync("test/dump.store")).toBe(true)
  })
})
