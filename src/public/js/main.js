// web socket Client connection

$(function () {
  
  const socket = io()

  // obtaining DOM elements (id's) from the index.html
  const $messageForm = $('#message-form')
  const $message = $('#message')
  const $chat = $('#chat')

  // events
  $messageForm.submit( e => {
    e.preventDefault()
    socket.emit('send message', $message.val())
    $message.val('')
  })

  socket.on('new message', function (data) {
    $chat.append(data + '<br/>')
  })

})