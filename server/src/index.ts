/**
 * Main entry of the Novelist server. Setup HTTP-Server and SocketIO
 */
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import fs from 'fs'
import path from 'path'
import { Novel } from './novel'
import { Exporter } from './exporter'
import config from 'config'
import md5 from 'md5'

const books = {}
const sockets = {}
const tokens = {}
console.log('run mode: ' + process.env.NODE_ENV)

/**
 * Create HTTP server
 */
const httpServer = createServer((req, res) => {
  let file = req.url
  if (!file || file === '/' || file === '') {
    file = 'index.html'
  }

  const fullpath = path.join(__dirname, '../../', 'client_v2/dist', file)
  let mime = 'text/html; charset="utf-8"'
  if (file.endsWith('js')) {
    mime = 'text/javascript'
  } else if (file.endsWith('css')) {
    mime = 'text/css'
  } else if (file.endsWith('svg')) {
    mime = 'text/svg+xml'
  } else if (file.endsWith('jpg')) {
    mime = 'image/jpeg'
  } else if (file.endsWith('txt')) {
    mime = 'text/plain'
  }

  console.log('serving ' + fullpath)
  if (fs.existsSync(fullpath)) {
    res.setHeader('Content-Type', mime)
    const read = fs.createReadStream(fullpath)
    read.on('end', () => {
      res.end()
    })
    read.pipe(res)
  } else {
    res.statusCode = 404
    res.end()
  }
})
/**
 * Create Socket server
 */
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'develop' ? '*' : 'http://localhost:3000',
  },
})
/**
 * If a timeout is configured, check in that interval if there was an access to the novel, and close it, if not.
 */
const timeout: number = config.has('timeout') ? config.get('timeout') : 300

/**
 * If timeout is exceeded without read or wreite access to a Novel, save and close it after a warning to the client.
 */
if (timeout !== 0) {
  console.log(`setting timeout to ${timeout * 1000} Milliseconds`)
  setInterval(async () => {
    const now = new Date().getTime()
    // console.log("timeout check " + now)
    for (const s in sockets) {
      if (sockets.hasOwnProperty(s)) {
        if (books[s]) {
          const then = sockets[s].last
          if ((now - then) / 1000 > timeout) {
            console.log('timeout: ' + s)
            if (sockets[s].warned) {
              if (books[s]) {
                const novel: Novel = books[s]
                if (novel) {
                  try {
                    await novel.close()
                    console.log('Timeout closed ' + s)
                  } catch (err) {
                    console.log(err.message)
                  } finally {
                    sockets[s].socket.emit('closed')
                    delete books[s]
                  }
                }
              }
            } else {
              sockets[s].socket.emit('timeout')
              sockets[s].warned = true
            }
          }
        }
      }
    }
  }, timeout * 1000)
}

io.on('connection', (socket: Socket) => {
  // console.log("connect " + socket.id)
  sockets[socket.id] = {
    last: new Date().getTime(),
    loggedIn: false,
    socket: socket,
  }
  socket.on('disconnect', async () => {
    if (books[socket.id]) {
      try {
        // console.log("index: disconnect " + socket.id)
        const novel: Novel = books[socket.id]
        await novel.close()
      } catch (err) {
        console.log(err.message)
      } finally {
        delete books[socket.id]
        delete sockets[socket.id]
      }
    }
    console.log('disconnected ' + socket.id)
  })
  socket.use(([event, ...args], next) => {
    // console.log("use: " + event)
    if (event === 'login') {
      next()
    } else if (sockets[socket.id].loggedIn) {
      next()
    } else {
      socket.emit("unauthorized")
    }
  })
  socket.on('error', err => {
    console.log(err)
  })
  socket.onAny((args) => {
    // console.log(JSON.stringify(args))
    sockets[socket.id].last = new Date().getTime()
    sockets[socket.id].warned = false
  })
  socket.on('ping', () => {
    sockets[socket.id].warned = false
  })
  socket.on('login', async (cred, callback) => {
    if (config.has("users")) {
      if (cred.token) {
        if (tokens[cred.token]) {
          tokens[cred.token] = new Date()
          sockets[socket.id].loggedIn = true
          callback({ status: "ok", result: cred.token })
        } else {
          sockets[socket.id].loggedIn = false
          callback(err("Invalid token"))
        }
      } else {
        const users = config.get("users")
        if (users.has(cred.username) && (users.get(cred.username) == cred.password)) {
          const token = md5(cred.username + cred.password + new Date().toString())
          tokens[token] = new Date()
          sockets[socket.id].loggedIn = true
          callback({ status: "ok", result: token })
        } else {
          sockets[socket.id].loggedIn = false
          callback({ status: "error", message: "Invalid username or password" })
        }
      }
    } else {
      sockets[socket.id].loggedIn = true
      callback({ status: "ok" })
    }

  })
  socket.on('listfiles', async (data, callback) => {
    try {
      const list = await Novel.list()
      callback({ status: 'ok', result: list })
    } catch (err) {
      callback({ status: 'error', message: err })
    }
  })
  socket.on('openBook', async (title, password, callback) => {
    try {
      const metadata = await openBook(socket.id, title, password)
      callback({ status: 'ok', result: metadata })
    } catch (err) {
      callback({ status: 'error', message: err.message })
    }
  })
  const noBook = new Error('no book selected')

  /**
   * find the Novel related to the current socket
   * @returns The connected Novel
   * @Throws Error if there is no suvch Novel
   */
  function checkNovel(): Novel {
    const novel = books[socket.id]
    if (!novel) {
      // console.log(JSON.stringify(books, null, 2))
      throw noBook
    }
    return novel
  }

  socket.on('closeBook', async (callback) => {
    try {
      const novel = checkNovel()
      await novel.close()
      console.log('closeBook: closed ' + socket.id)
      delete books[socket.id]
      callback({ status: 'ok' })
    } catch (err) {
      callback({ status: 'error', message: err.message })
    }
  })
  socket.on('getCurrent', (callback) => {
    try {
      const novel = checkNovel()
      const meta = novel.readMetadata()
      if (!meta) {
        console.log('no book on getMeta!')
      }
      callback({ status: 'ok', result: meta })
    } catch (err) {
      callback({ status: 'error', message: err })
    }
  })

  /**
   * Save an element
   * @param filetype: One of the supported data types (persons, chapters and so on)
   * @param data: Contents
   * @param callback is called with a {status, result,message} answer.
   */
  socket.on('save', async (filetype, data, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: 'ok', result: 'saved', message: undefined }
      switch (filetype) {
        case 'metadata':
          await novel.writeMetadata(data)
          break
        case 'chapters':
          const chapter = data as chapter_def
          await novel.writeChapter(chapter)
          break
        case 'persons':
          await novel.writePerson(data as person_def)
          break
        case 'places':
          await novel.writePlace(data as place_def)
          break
        case 'notes':
          await novel.writeNotes(data as note_def)
          break
        case 'timeline':
          await novel.writeTimeline(data as string)
          break
        default:
          result.message = 'bad datatype in save: ' + filetype
          console.log(result.message)
          result.result = 'not saved'
          result.status = 'error'
      }
      callback(result)
    } catch (err) {
      callback({ status: 'ok', result: false, message: err })
    }
  })

  /**
   * Load an element of a given data type
   * @param filetype: One of the supported data types (persons, chapters and so on)
   * @param name: name of the element to retrieve
   */
  socket.on('load', (filetype, name, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: 'ok', result: undefined, message: undefined }
      switch (filetype) {
        case 'metadata':
          result.result = novel.readMetadata()
          break
        case 'chapters':
          result.result = novel.getChapter(name)
          break
        case 'persons':
          result.result = novel.getPerson(name)
          break
        case 'places':
          result.result = novel.getPlace(name)
          break
        case 'notes':
          result.result = novel.getNotes()
          break
        case 'timeline':
          result.result = novel.getTimeline()
          break
        default:
          result.message = 'bad datatype in load:' + filetype
          console.log(result.message)
          result.status = 'error'
      }
      callback(result)
    } catch (err) {
      callback({ status: 'error', message: err })
    }
  })

  /**
   * remove an element of a given type
   */
  socket.on('delete', async (filetype, name, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: 'ok', result: 'deleted', message: undefined }
      switch (filetype) {
        case 'chapters':
          await novel.deleteChapter(name)
          break
        case 'persons':
          await novel.deletePerson(name)
          break
        case 'places':
          await novel.deletePlace(name)
          break
        default:
          result.message = 'bad datatype in delete ' + filetype
          console.log(result.message)
          result.result = 'nothing deleted'
          result.status = 'error'
      }
      callback(result)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: err })
    }
  })

  /**
   * Modify the Novel
   */
  socket.on('modify', async (op, data, callback) => {
    try {
      const novel = checkNovel()
      const result = { status: 'ok', result: undefined, message: undefined }
      switch (op) {
        case 'changePwd':
          result.result = novel.changePassword(data)
          break
        case 'rename':
          switch (data.type) {
            case 'chapters':
              result.result = await novel.renameChapter(
                data.oldname,
                data.newname,
              )
              break
            case 'persons':
              result.result = await novel.renamePerson(
                data.oldname,
                data.newname,
              )
              break
            case 'places':
              result.result = await novel.renamePlace(
                data.oldname,
                data.newname,
              )
              break
            default:
              result.message = 'object type not supported ' + data.type
              result.status = 'error'
          }
          break
        case 'check':
          await novel.ensureIntegrity()
          result.result = true
          break
        default:
          result.message = 'bad operation code in modify: ' + op
          result.status = 'error'
      }
      callback(result)
    } catch (err) {
      callback({ status: 'error', message: err })
    }
  })

  /**
   * Export the Novel to an ePub or HTML
   */
  socket.on('export', async (op, data, callback) => {
    try {
      const novel = checkNovel()
      const ex = new Exporter(novel)
      if (op === 'epub') {
        if (!data.endsWith('.epub')) {
          data = data + '.epub'
        }
        const outfile = path.join(".", data)
        await ex.toEpub(outfile)
        callback({ status: 'ok', result: data })
      } else if (op === 'html') {
        const html = await ex.toHtml()
        callback({ status: 'ok', result: html })
      }
    } catch (err) {
      callback({ status: 'error', message: err })
    }
  })
})

let port = 2999

if (config.has('port')) {
  port = config.get('port')
}

httpServer.listen(port)
console.log('server ready on port ' + port)

function err(msg: string) {
  return { status: "error", message: msg }
}
/**
 * Open a Novel
 * @param owner SocketId
 * @param title Filename
 * @param password encryption password
 * @returns
 */
function openBook(
  owner: string,
  title: string,
  password: string,
): Promise<metadata_def> {
  return new Promise((resolve, reject) => {
    Novel.open(title, password)
      .then((novel: Novel) => {
        books[owner] = novel
        resolve(novel.readMetadata())
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}
