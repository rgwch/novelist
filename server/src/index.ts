import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'
import cfg from './config.json'
import globals from './base'

const httpServer = createServer((req, res) => {
  const read = fs.createReadStream(path.join(__dirname, "..", "public", "index.html"))
  read.on('end', () => {
    res.end()
  })
  read.pipe(res)
});
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5000",
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
});

httpServer.listen(3000);
console.log("server ready")

export async function listfiles(/* request */): Promise<Array<string>> {
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