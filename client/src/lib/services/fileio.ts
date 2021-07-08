/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from "svelte/store";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_error", (err) => {
  console.log("Error: " + err);
});
export const current = writable(undefined);

export function showBooks(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    socket.emit('listfiles', "data", (res: Array<string>) => {
      resolve(res)
    })
  })

}

export async function openCurrent() {
  try {
    const res = await fetch("/novel/metadata.json");
    if (res.ok) {
      const result = await res.json();
      current.set(result);
    } else {
      current.set(undefined);
    }
  } catch (err) {
    alert(err);
    throw err;
  }
}


export async function saveMetadata(meta: metadata_def): Promise<boolean> {
  try {
    const res = await fetch("/novel/metadata.json", {
      method: "POST",
      body: JSON.stringify(meta),
    });
    if (res.ok) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err);
  }
}

export async function changePwd(newPwd: string): Promise<boolean> {
  const res = await fetch("/novel/modify.json", {
    method: "POST",
    body: JSON.stringify({
      op: "changePwd",
      password: newPwd,
    }),
  });
  if (res.ok) {
    return true;
  }
  return false;
}

export async function loadNotes(): Promise<string> {
  try {
    const res = await fetch("/novel/notes.json");
    if (res.ok) {
      const ret = await res.json();
      return ret.notes;
    }
  } catch (err) {
    throw new Error(err);
  }
}

export async function saveNotes(notes: string): Promise<boolean> {
  try {
    const res = await fetch("/novel/notes.json", {
      method: "POST",
      body: JSON.stringify(notes),
    });
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(err);
  }
}
export async function save(
  type: string,
  name: string,
  data: any
): Promise<any> {
  try {
    const res = await fetch(`/novel/${type}-${name}.json`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const ret = await res.json();
      return ret;
    } else {
      throw new Error("Write error " + res.status);
    }
  } catch (err) {
    throw new Error("Write error " + err);
  }
}

export async function load(type: string, name: string): Promise<any> {
  try {
    const res = await fetch(`/novel/${type}-${name}.json`);
    if (res.ok) {
      const ret = await res.json();
      return ret;
    } else {
      throw new Error("Read error " + res.status);
    }
  } catch (err) {
    throw new Error("Read error " + err);
  }
}

export async function remove(type: string, name: string): Promise<boolean> {
  const res = await fetch(`/novel/${type}-${name}.json`, {
    method: "DELETE",
  });
  if (res.ok) {
    return true;
  } else {
    return false;
  }
}
