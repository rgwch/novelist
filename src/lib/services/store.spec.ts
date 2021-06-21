import { Store } from './store'
import fs from 'fs'


describe("Store", () => {
  afterAll(()=>{
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fs.rm("test/dump.store",()=>{})
  })

  it("saves and retrieves serialized data", async () => {
    const store = new Store('default');
    const buffer = Buffer.alloc(100, "*", "utf-8")
    const saved=await store.save("test/dump.store", buffer)
    expect(saved).toBeTruthy
    const retrieved = await store.load("test/dump.store")
    expect(retrieved).toBeDefined
    expect(retrieved).toEqual(buffer)
  })
})
