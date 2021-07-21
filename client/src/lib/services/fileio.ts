/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from "svelte/store";
import { io } from "socket.io-client";
import props from './properties'
import hash from 'object-hash'


export const current = writable(undefined);

let socket
let lastState = {}


// Note: rollup will change this to "true" or "false" on build
if (props.production === "true") {
  // console.log("production mode")
  socket = io()
} else {
  // console.log("development mode")
  socket = io("http://localhost:2999", { autoConnect: true });
}

type result = {
  status: "ok" | "error"
  result?: any
  message?: string
}

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("closed", () => {
  current.set(undefined)
})
socket.on('disconnect', () => {
  current.set(undefined)
})

socket.on("timeout", () => {
  const warner = window.document.getElementById("warner")
  warner.style.display = "inline-block"

})
socket.on("connect_failed", err => {
  console.log("Connection failure " + err)
})
socket.on("connect_error", (err) => {
  console.log("Error: " + err);
});

export function ping() {
  socket.emit("ping")
}

export function showBooks(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    socket.emit('listfiles', "data", (res: result) => {
      if (res.status === "ok") {
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })

}

export function openCurrent(): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    socket.emit('getCurrent', (res: result) => {
      if (res.status === "ok") {
        current.set(res.result)
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })
}

export function openBook(title: string, password: string): Promise<metadata_def> {
  lastState = {}
  return new Promise((resolve, reject) => {
    socket.emit('openBook', title, password, (res: result) => {
      if (res.status === "ok") {
        resolve(res.result)
      } else {
        console.log("could not open " + res.message)
        reject(res.message)
      }
    })
  })
}

export function closeBook(): Promise<boolean> {
  lastState = {}
  return new Promise((resolve, reject) => {
    socket.emit("closeBook", (res: result) => {
      if (res.status === "ok") {
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })
}

export function save(type: string, data: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const str = hash.MD5(data || {})
    if (data && (lastState[type + data.name] !== str)) {
      socket.emit("save", type, data, (res: result) => {
        if (res.status === "ok") {
          lastState[type + data.name] = str
          resolve(true)
        } else {
          reject("save error " + res.message)
        }
      })
    } else {
      console.log("same data, no save")
      resolve(true)
    }
  })
}

export function load(type: string, name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit("load", type, name, (res: result) => {
      if (res.status === "ok") {
        lastState[type + name] = res.result ? hash.MD5(res.result) : ""
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })

}


export function changePwd(newPwd: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit('modify', "changePwd", newPwd, (res: result) => {
      if (res.status == "ok") {
        resolve(true)
      } else {
        reject(res.message)
      }
    })
  })

}

export function remove(type: string, name: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit("delete", type, name, (res: result) => {
      if (res.status === "ok") {
        delete lastState[type + name]
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })

}

export function integrityCheck(): Promise<boolean> {
  console.log("checking integrity")
  return new Promise((resolve, reject) => {
    socket.emit("modify", "check", "", (res: result) => {
      if (res.status === "ok") {
        resolve(true)
      } else {
        reject(res.message)
      }
    })
  })
}

export function rename(type, oldname, newname): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    socket.emit("modify", "rename", { type, oldname, newname }, (res: result) => {
      if (res.status === "ok") {
        delete lastState[type + oldname]
        lastState[type + newname] = hash.MD5(res.result)
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })
}
export function toEpub(file: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit("export", "epub", file, (res: result) => {
      if (res.status == "ok") {
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })
}

export function toHtml(): Promise<string> {
  return new Promise((resolve, reject) => {
    socket.emit("export", "html", "", (res: result) => {
      if (res.status == "ok") {
        resolve(res.result)
      } else {
        reject(res.message)
      }
    })
  })
}

