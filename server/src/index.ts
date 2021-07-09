import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'
import { config } from './config'
import { Novel } from './novel'

const books = {}

const httpServer = createServer((req, res) => {
  let file = req.url
  if (!file || file === "/" || file === "") {
    file = "index.html"
  }
  const read = fs.createReadStream(path.join(__dirname, "..", "public", file))
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
  console.log("connect " + socket.id)
  socket.on('disconnect', async () => {
    if (books[socket.id]) {
      const novel: Novel = books[socket.id]
      await novel.close()
      delete books[socket.id]
    }
    console.log("disconnected " + socket.id)
  })
  socket.onAny(args => {
    console.log(JSON.stringify(args))
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
      throw (noBook)
    }
    return novel
  }

  socket.on("closeBook", async (callback) => {
    try {
      const novel = checkNovel()
      await novel.close()
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
      callback({ status: "error", message: err })
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

        default:
          result.message = "bad operation code in modify: " + op
          result.status = "error"
      }
      callback(result)
    } catch (err) {
      callback({ status: "error", message: err })
    }
  })

});

httpServer.listen(2999);
console.log("server ready")

function listfiles(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    fs.readdir(config.resolveDir(), (err, files) => {
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
    Novel.open(path.join(config.resolveDir(), title), password).then((novel: Novel) => {
      books[owner] = novel
      resolve(novel.readMetadata())
    }).catch(err => {
      reject(err)
    })
  })
}


