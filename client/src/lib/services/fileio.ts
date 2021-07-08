/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable } from "svelte/store";
import { io } from "socket.io-client";

export const socket = io("http://localhost:2999", { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("connect_failed", err => {
  console.log("Connection failure " + err)
})
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

export function openCurrent(): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    socket.emit('getCurrent', (res: metadata_def) => {
      current.set(res)
      resolve(res)
    })
  })
}

export function openBook(title: string, password: string): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    socket.emit('openBook', title, password, (meta: metadata_def) => {
      if (meta) {
        resolve(meta)
      } else {
        console.log("could not open")
        reject("bad file or incorrect password")
      }
    })
  })
}

export function closeBook(): Promise<boolean>{
  return new Promise((resolve,reject)=>{
    socket.emit("closeBook",result=>{
      resolve(result)
    })
  })
}

export function save(type: string, data: any): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit("save", type, data, (result: boolean) => {
      if (result) {
        resolve(true)
      } else {
        reject("save error")
      }
    })
  })
}

export function load(type: string, name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    socket.emit("load", type, name, result => {
      if (typeof result !== 'undefined') {
        resolve(result)
      } else {
        reject("load error")
      }
    })
  })

}


export function changePwd(newPwd: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit('modify', "changePWD", newPwd, result => {
      if (result) {
        resolve(true)
      } else {
        reject("can't change PWD")
      }
    })
  })

}


export function remove(type: string, name: string): Promise<boolean> {
  return new Promise((resolve,reject)=>{
    socket.emit("delete",type,name,result=>{
      resolve(result)
    })
  })
}
