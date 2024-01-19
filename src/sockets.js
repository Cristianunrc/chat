// web socket Server connection 

module.exports = function (io) {
  
  let nicknames = []
  
  // web socket connection
  io.on('connection', socket => {
    console.log('new user connected')

    socket.on('new user', (data, cb) => {
      if (nicknames.indexOf(data) != -1) {
        cb(false)
      } else {
        cb(true)
        socket.nickName = data
        nicknames.push(socket.nickName)
        updateNickNames()
      }
    })

    socket.on('send message', data => {
      io.sockets.emit('new message', {
        msg: data,
        nick: socket.nickName
      })

    })

    socket.on('disconnect', data => {
      if (!socket.nickName) return
      nicknames.splice(nicknames.indexOf(socket.nickName), 1)
      updateNickNames()
    })

    function updateNickNames() {
      io.sockets.emit('usernames', nicknames)
    }

  })
}