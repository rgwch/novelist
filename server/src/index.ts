/**
 * Main entry of the Novelist server. Setup HTTP-Server and SocketIO
 */
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'
import { Novel } from './novel'
import { resolveDir } from './store'
import { Exporter } from "./exporter";
import config from 'config'

const books = {}
const sockets = {}
console.log("run mode: " + process.env.NODE_ENV)

const httpServer = createServer((req, res) => {
  let file = req.url
  if (!file || file === "/" || file === "") {
    file = "index.html"
  }
  const fullpath = path.join(__dirname, "public", file)
  console.log("serving " + path.join(__dirname, "public", file))
  if (fs.existsSync(fullpath)) {
    const read = fs.createReadStream(fullpath)
    read.on('end', () => {
      res.end()
    })
    read.pipe(res)
  } else {
    res.statusCode = 404
    res.end()
  }
});
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },

});
/**
 * If a timeout is configured, check in that interval if there was an access to the novel, and close it, if not.
 */
const timeout:number = config.has("timeout") ? config.get("timeout") : 300

if (timeout !== 0) {
  console.log(`setting timeout to ${timeout * 1000} Milliseconds`)
  setInterval(async () => {
    const now = new Date().getTime()
    // console.log("timeout check " + now)
    for (const s in sockets) {
      if (sockets.hasOwnProperty(s)) {
        const then = sockets[s].last
        if ((now - then) / 1000 > timeout) {
          console.log("timeout: " + s)
          if (sockets[s].warned) {
            if (books[s]) {
              const novel: Novel = books[s]
              if (novel) {
                await novel.close()
                console.log("Timeout closed " + s)
                delete books[s]
                sockets[s].socket.emit("closed")
              }
            }
          } else {
            sockets[s].socket.emit("timeout")
            sockets[s].warned = true
          }
        }
      }
    }
  }, timeout * 1000)
}

io.on("connection", (socket: Socket) => {
  // console.log("connect " + socket.id)
  sockets[socket.id] = {
    last: new Date().getTime(),
    socket: socket
  }
  socket.on('disconnect', async () => {
    if (books[socket.id]) {
      // console.log("index: disconnect " + socket.id)
      const novel: Novel = books[socket.id]
      await novel.close()
      delete books[socket.id]
      delete sockets[socket.id]
    }
    console.log("disconnected " + socket.id)
  })
  socket.onAny(args => {
    // console.log(JSON.stringify(args))
    sockets[socket.id].last = new Date().getTime()
    sockets[socket.id].warned = false
  })
  socket.on("ping", () => {
    sockets[socket.id].warned = false
  })
  socket.on("listfiles", async (data, callback) => {
    try {
      const list = await listfiles()
      callback({ status: "ok", result: list })
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })
  socket.on("openBook", async (title, password, callback) => {
    try {
      const metadata = await openBook(socket.id, title, password)
      callback({ status: "ok", result: metadata })
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })
  const noBook = "no book selected"


  function checkNovel(): Novel {
    const novel = books[socket.id]
    if (!novel) {
      // console.log(JSON.stringify(books, null, 2))
      throw (noBook)
    }
    return novel
  }

  socket.on("closeBook", async (callback) => {
    try {
      const novel = checkNovel()
      await novel.close()
      console.log("closeBook: closed " + socket.id)
      delete books[socket.id]
      callback({ status: "ok" })

    } catch (err) {
      callback({ status: "error", message: err })
    }
  })
  socket.on("getCurrent", callback => {
    try {
      const novel = checkNovel()
      const meta = novel.readMetadata()
      if (!meta) {
        console.log("no book on getMeta!")
      }
      callback({ status: "ok", result: meta })
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })

  socket.on("save", async (filetype, data, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: "ok", result: undefined, message: undefined }
      switch (filetype) {
        case 'metadata':
          result.result = await novel.writeMetadata(data);
          break;
        case 'chapters':
          const chapter = data as chapter_def
          result.result = await novel.writeChapter(chapter);
          break;
        case 'persons':
          result.result = await novel.writePerson(data as person_def);
          break;
        case 'places':
          result.result = await novel.writePlace(data as place_def)
          break;
        case 'notes':
          result.result = await novel.writeNotes(data as string)
          break;
        default:
          result.message = "bad datatype in save: " + filetype
          console.log(result.message)
          result.status = "error"
      }
      callback(result)
    } catch (err) {
      callback({ status: "ok", result: false, message: "no book" })
    }
  });

  socket.on('load', async (filetype, name, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: "ok", result: undefined, message: undefined }
      switch (filetype) {
        case 'metadata': result.result = novel.readMetadata(); break;
        case 'chapters': result.result = novel.getChapter(name); break;
        case 'persons': result.result = novel.getPerson(name); break;
        case 'places': result.result = novel.getPlace(name); break;
        case 'notes': result.result = novel.getNotes(); break;
        default:
          result.message = "bad datatype in load:" + filetype
          console.log(result.message)
          result.status = "error"
      }
      callback(result)
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })

  socket.on("delete", async (filetype, name, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: "ok", result: undefined, message: undefined }
      switch (filetype) {
        case 'chapters': result.result = await novel.deleteChapter(name); break;
        case 'persons': result.result = await novel.deletePerson(name); break;
        case 'places': result.result = await novel.deletePlace(name); break;
        default:
          result.message = "bad datatype in delete " + filetype
          console.log(result.message)
          result.status = "error"
      }
      callback(result)
    } catch (err) {
      console.log(err)
      callback({ status: "error", message: err })
    }
  })
  socket.on("modify", async (op, data, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: "ok", result: undefined, message: undefined }
      switch (op) {
        case "changePwd":
          result.result = novel.changePassword(data);
          break;
        case "rename":
          switch (data.type) {
            case "chapters":
              result.result = await novel.renameChapter(data.oldname, data.newname)
              break;
            case "persons":
              result.result = await novel.renamePerson(data.oldname, data.newname)
              break;
            case "places":
              result.result = await novel.renamePlace(data.oldname, data.newname)
              break;
            default:
              result.message = "object type not supported " + data.type
              result.status = "error"
          }
          break;
        case "check":
          result.result = await novel.checkIntegrity()
          break;
        default:
          result.message = "bad operation code in modify: " + op
          result.status = "error"
      }
      callback(result)
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })

  socket.on("export", async (op, data, callback) => {
    try {
      const novel = checkNovel()
      const ex = new Exporter(novel)
      if (op === "epub") {
        if (!data.endsWith(".epub")) {
          data = data + ".epub"
        }
        const outfile = path.join(resolveDir(), data)
        await ex.toEpub(outfile)
        callback({ status: "ok", result: data })
      } else if (op === "html") {
        const html = await ex.toHtml()
        callback({ status: "ok", result: html })
      }

    } catch (err) {
      callback({ status: "error", message: err })
    }
  })

});

let port = 2999

if (config.has("port")) {
  port = config.get("port")
}

httpServer.listen(port);
console.log("server ready on port " + port)

function listfiles(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(resolveDir(), (err, files) => {
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
    Novel.open(path.join(resolveDir(), title), password).then((novel: Novel) => {
      books[owner] = novel
      resolve(novel.readMetadata())
    }).catch(err => {
      reject(err)
    })
  })
}


