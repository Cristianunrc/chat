// web socket Server connection 

module.exports = function (io) {
  
  let users = {}
  
  // web socket connection
  io.on('connection', socket => {
    console.log('new user connected')

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb(false)
      } else {
        cb(true)
        socket.nickName = data
        users[socket.nickName] = socket
        updateNickNames()
      }
    })

    socket.on('send message', (data, cb) => {
      
      var msg = data.trim()
      
      // Validates private message
      if (msg.substr(0, 3) === '/w ') {
        msg = msg.substr(3)
        const index = msg.indexOf(' ')
        if (index !== -1){
          var name = msg.substr(0, index)
          var msg = msg.substr(index + 1)
          if (name in users) {
            users[name].emit('whisper', {
              msg,
              nick: socket.nickName
            })
          } else {
            cb('Error! Please enter a valid user')
          }
        } else {
          cb('Error! Please enter your message')
        }
      } else {
        // Validates general message
        io.sockets.emit('new message', {
          msg: data,
          nick: socket.nickName
        })
      }
    })

    socket.on('disconnect', data => {
      if (!socket.nickName) return
      delete users[socket.nickName]
      updateNickNames()
    })

    function updateNickNames() {
      io.sockets.emit('usernames', Object.keys(users))
    }

  })
}
