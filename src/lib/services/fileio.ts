/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function save(type: string, title: string, data: any): Promise<any> {

  const res = await fetch(`/novel/${type}-${title}.json`, {
    method: "POST",
    body: JSON.stringify(data)
  })
  if (res.ok) {
    const ret = await res.json()
    return ret
  } else {
    throw new Error("Write error " + res.status)
  }
}

export async function load(type: string, title: string): Promise<any> {
  const res = await fetch(`/novel/${type}-${title}.json`)
  if (res.ok) {
    const ret = await res.json()
    return ret
  } else {
    throw new Error("Read error " + res.status)
  }
}