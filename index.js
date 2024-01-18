const http = require('http')
const express = require('express')
const { Server } = require('socket.io') // framework para conexiones en tiempo real

const app = express()
const server = http.createServer(app)
const io = new Server(server)

io.on('connection', socket => {
  console.log('new user connected')
})

// send static files
app.use(express.static('public'))

// starting server
server.listen(3000, () => {
  console.log('Server on port 3000')
})