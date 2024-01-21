// web socket Server connection 
const Chat = require('./models/Chat')

module.exports = function (io) {
  
  let users = {}
  
  // web socket connection
  io.on('connection', async socket => {
    console.log('new user connected')

    let messages = await Chat.find({}).limit(8)
    socket.emit('load old msgs', messages)

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

    socket.on('send message', async (data, cb) => {
      
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
              msg, // msg: msg
              nick: socket.nickName
            })
          } else {
            cb('Error! Please enter a valid user')
          }
        } else {
          cb('Error! Please enter your message')
        }
      } else {
        // storage dates in db
        var newMsg = new Chat({
          msg,
          nick: socket.nickName
        })
        await newMsg.save()
        
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
