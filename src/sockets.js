
module.exports = function (io) {
  
  // web socket connection
  io.on('connection', socket => {
    console.log('new user connected')
  })
}