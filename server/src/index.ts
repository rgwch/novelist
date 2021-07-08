import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'
import cfg from './config.json'
import globals from './base'
import { Novel } from './novel'
import { assertBlock } from "@babel/types";

const books = {}

const httpServer = createServer((req, res) => {
  const read = fs.createReadStream(path.join(__dirname, "..", "public", "index.html"))
  read.on('end', () => {
    res.end()
  })
  read.pipe(res)
});
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },

});

io.on("connection", (socket: Socket) => {
  console.log("connect")
  socket.on('disconnect', () => {
    console.log("disconnected")
  })
  socket.on("listfiles", async (data, callback) => {
    const list = await listfiles()
    callback(list)
  })
  socket.on("openBook", async (title, password, callback) => {
    try {
      const metadata = await openBook(socket.id, title, password)
      callback(metadata)
    } catch (err) {
      callback(undefined)
    }
  })
  socket.on("getCurrent", callback => {
    callback(getCurrent(socket.id))
  })
});

httpServer.listen(2999);
console.log("server ready")

function listfiles(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(globals.resolveDir(), (err, files) => {
      if (err) {
        reject(err);
      } else {
        const list = files.filter((file) => file.endsWith('.novel'));
        resolve(list);
      }
    });
  })
}

function openBook(owner: string, title: string, password: string): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    Novel.open(path.join(globals.resolveDir(), title), password).then((novel: Novel) => {
      books[owner] = novel
      resolve(novel.readMetadata())
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

function getCurrent(owner: string): metadata_def {
  const novel: Novel = books[owner]
  if (novel) {
    return novel.readMetadata()
  }
  return undefined
}

