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
  socket.on('disconnect', async () => {
    if (books[socket.id]) {
      const novel: Novel = books[socket.id]
      await novel.close()
      delete books[socket.id]
    }
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
  socket.on("closeBook", async (callback) => {
    const novel: Novel = books[socket.id]
    if (!novel) {
      callback(false, "No Book selected")
    } else {
      await novel.close()
      delete books[socket.id]
      callback(true)
    }
  })
  socket.on("getCurrent", callback => {
    callback(getCurrent(socket.id))
  })

  socket.on("save", async (filetype, data, callback) => {
    const novel: Novel = books[socket.id]
    if (!novel) {
      callback(false, "No Book selected")
    }
    switch (filetype) {
      case 'metadata':
        callback(await novel.writeMetadata(data));
        break;
      case 'chapter':
        const chapter = data as chapter_def
        callback(await novel.writeChapter(chapter));
        break;
      case 'person':
        callback(await novel.writePerson(data as person_def));
        break;
      case 'place':
        callback(await novel.writePlace(data as place_def))
        break;
      case 'notes':
        callback(await novel.writeNotes(data as string))
        break;
      default:
        console.log("Bad datatype " + filetype)
        callback(false, "bad datatype")
    }
  });

  socket.on('load', async (filetype, name, callback) => {
    const novel: Novel = books[socket.id]
    if (!novel) {
      callback(undefined, "No book selected")
    }
    switch (filetype) {
      case 'metadata': callback(novel.readMetadata()); break;
      case 'chapter': callback(novel.getChapter(name)); break;
      case 'person': callback(novel.getPerson(name)); break;
      case 'place': callback(novel.getPlace(name)); break;
      case 'notes': callback(novel.getNotes()); break;
      default:
        console.log("bad datatype in load " + filetype)
        callback(undefined, "bad datatype " + filetype)
    }
  })

  socket.on("delete", async (filetype, name, callback) => {
    const novel: Novel = books[socket.id]
    if (!novel) {
      callback(undefined, "No book selected")
    }
    switch (filetype) {
      case 'chapter': callback(await novel.deleteChapter(name)); break;
      case 'person': callback(await novel.deletePerson(name)); break;
      case 'place': callback(await novel.deletePlace(name)); break;
      default:
        console.log("bad datatype in load " + filetype)
        callback(undefined, "bad datatype " + filetype)
    }
  })
  socket.on("modify", async (op, data, callback) => {
    const novel: Novel = books[socket.id]
    if (!novel) {
      callback(undefined, "No book selected")
    }
    switch (op) {
      case "changePwd":
        callback(await novel.changePassword(data));
        break;

      default:
        callback(undefined, "bad operation code " + op)
    }
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

