// web socket Client connection

$(function () {
  
  const socket = io()

  // obtaining DOM elements (id's) from the Chat
  const $messageForm = $('#message-form')
  const $message = $('#message')
  const $chat = $('#chat')
  const $user = $('#usernames')

  // obtaining DOM elements (id's) from the Login
  const $nickError = $('#nickError')
  const $nickForm = $('#nickForm')
  const $nickName = $('#nickName')

  $nickForm.submit( e => {
    e.preventDefault()
    socket.emit('new user', $nickName.val(), data => {
      if (data) {
        $('#nickWrap').hide()
        $('#contentWrap').show()
      } else {
        $nickError.html(`
          <div class="alert alert-danger">
            That username already exists
          </div>
        `)
      }
      $nickName.val('')
    })
  })

  // events
  $messageForm.submit( e => {
    e.preventDefault()
    socket.emit('send message', $message.val(), data => {
      $chat.append(`<p class="error">${data}</p>`)
    })
    $message.val('')
  })

  socket.on('new message', function (data) {
    $chat.append('<b>' + data.nick + '</b>: ' + data.msg + '</br>')
  })

  socket.on('usernames', data => {
    let html = ''
    for (let i = 0; i < data.length; i++) {
      html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
    }
    $user.html(html)
  })

  socket.on('whisper', data => {
    displayMsg(data)
  })

  socket.on('load old msgs', msgs => {
    for (let i = 0; i < msgs.length; i++) {
      displayMsg(msgs[i])
    }
  })

  function displayMsg(data) {
    $chat.append(`<p class="whisper"><b>${data.nick}:</b> ${data.msg}</p>`)
  }

})
