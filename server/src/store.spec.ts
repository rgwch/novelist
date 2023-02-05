/* eslint-disable @typescript-eslint/no-empty-function */

import { storeFactory } from './store-factory'
import { DateTime } from 'luxon'
// jest.setTimeout(200000)
const today = DateTime.now().toFormat("yyyy-LL-dd")
describe("Store", () => {


  afterAll(async () => {
    const files = await storeFactory.listObjects(/dump.+/)
    for (const f of files) {
      await storeFactory.removeObject(f)
    }
  })


  it("parses the name correctly", () => {
    expect(storeFactory.basename("someweird/path.exten")).toEqual("someweird/path")
    expect(storeFactory.extname("someweird/path.exten")).toEqual(".exten")
    expect(storeFactory.basename("someweird/path")).toEqual("someweird/path")
    expect(storeFactory.extname("someweird/path")).toEqual("")
  })

  it("rotates backup files", async () => {
    const store: IStorable = storeFactory.createStorable("dump0.store", "default");
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    expect(await storeFactory.queryObject("dump0.store")).toBe(true)
    await storeFactory.rotate("dump0.store", 2)
    await store.save(buffer)
    expect(await storeFactory.queryObject("dump0_1.store")).toBe(true)
    await storeFactory.rotate("dump0.store", 2)
    await store.save(buffer)
    expect(await storeFactory.queryObject("dump0_2.store")).toBe(true)
    await storeFactory.rotate("dump0.store", 2)
    await store.save(buffer)
    // expect(await storeFactory.queryObject("dump0_" + today + ".store")).toBe(true)


  })

  it("saves and retrieves serialized data", async () => {
    const store: IStorable = storeFactory.createStorable("dump1.store", "default");
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    const retrieved = await store.load()
    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(buffer)
  })

})
