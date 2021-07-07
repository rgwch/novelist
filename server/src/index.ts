import { createServer } from "http";
import { Server, Socket } from "socket.io";
import fs from 'fs'
import path from 'path'
import { StrictEventEmitter } from "socket.io/dist/typed-events";

const httpServer = createServer((req, res) => {
  const read = fs.createReadStream(path.join(__dirname, "..", "public", "index.html"))
  read.on('end', () => {
    res.end()
  })
  read.pipe(res)
});
const io = new Server(httpServer, {

});

io.on("connection", (socket: Socket) => {
  console.log("connect")
  socket.on('disconnect', () => {
    console.log("disconnected")
  })
  //socket.on()
});

httpServer.listen(3000);
console.log("server ready")
