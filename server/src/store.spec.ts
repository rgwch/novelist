/* eslint-disable @typescript-eslint/no-empty-function */

import { storeFactory } from './store-factory'

describe("Store", () => {

  const stor=storeFactory.getFileStore()
  
  /*
  afterAll(async () => {
    const files=await stor.listObjects()
    for(const f of files){
      if(f.match(/dump.+/)){
        await stor.removeObject(f)
      }
    }
  }) 
*/
  xit("creates a new store, if it doesn't exist", async ()=>{
    
  })
  xit("saves and retrieves serialized data", async () => {
    const store:IStorable = stor.createStorable("dump1.store", "default");
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    const retrieved = await store.load()
    expect(retrieved).toBeDefined()
    expect(retrieved).toEqual(buffer)
  })
  it("generates multiple generations of backup", async () => {
    const store:IStorable = stor.createStorable("dump2.store","default")
    const buffer = Buffer.alloc(100, "*", "utf-8")
    await store.save(buffer)
    await store.save(buffer)
    await store.save(buffer)
    expect(await stor.queryObject("dump2.store_1")).toBe(true)
    expect(await stor.queryObject("dump2.store_2")).toBe(true)
    expect(await stor.queryObject("dump2.store")).toBe(true)
  })
})
