const http = require('http')
const path = require('path')
const express = require('express')
const { Server } = require('socket.io') // framework para conexiones en tiempo real
const mongoose = require('mongoose')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

// db connection
mongoose.connect('mongodb://localhost/chat-db')
  .then(db => console.log('db is connected'))
  .catch(err => console.log(err))

const PORT = process.env.PORT || 3000

require('./sockets')(io)

// send static files
app.use(express.static(path.join(__dirname, 'public')))

// starting server
server.listen(PORT, () => {
  console.log('Server on port', PORT)
})