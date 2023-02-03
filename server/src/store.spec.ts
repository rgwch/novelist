/* eslint-disable @typescript-eslint/no-empty-function */

import { storeFactory } from './store-factory'

describe("Store", () => {
  const stor=storeFactory.getFileStore()
  afterAll(async () => {
    await stor.removeObject("dump.store")
    await stor.removeObject("dump.store_1")
    await stor.removeObject("dump.store_2")
    await stor.removeObject("dump.store_3")
  })

  it("creates a new store, if it doesn't exist", async ()=>{
    
  })
  it("saves and retrieves serialized data", async () => {
    const store = stor.createStoreObject("dump.store", "default");
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    const retrieved = await store.load()
    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(buffer)
  })
  it("generates multiple generations of backup", async () => {
    const store:IStoreObject = stor.createStoreObject("dump.store","default")
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    await store.save(buffer)
    await store.save(buffer)
    expect(stor.queryObject("dump.store_1")).toBe(true)
    expect(stor.queryObject("test/dump.store_2")).toBe(true)
    expect(stor.queryObject("test/dump.store")).toBe(true)
  })
})
