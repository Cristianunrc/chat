// web socket Server connection 

module.exports = function (io) {
  
  // web socket connection
  io.on('connection', socket => {
    console.log('new user connected')

    socket.on('send message', function(data) {
      io.sockets.emit('new message', data)
    })

  })
}