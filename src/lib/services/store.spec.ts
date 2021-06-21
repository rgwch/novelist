import { Store } from './store'

describe("Store", () => {
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
