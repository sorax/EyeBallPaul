'use strict'

//   get area() {
//     return this.height * this.width;
//   }
//   set area(value) {
//     this.height = this.width = Math.sqrt(value);
//   }

document.addEventListener('DOMContentLoaded', () => {
  const controller = new Controller(wsAddress)
})

class Controller {
  constructor(wsAddress) {
    this.player = {}

    this.setEvents()
    this.webSocket = new WebSocketClient(wsAddress)
  }

  onConnectionEstablished() {
    $('#connection').css('display', 'none')
    $('#login').css('display', 'block')

    // Set client type
    this.webSocket.send({
      type: 'setClientType',
      clientType: 'controller',
    })
  }

  onDataReceived(data) {
    //console.log('Received: ', data);
    switch (data.type) {
      case 'setTeam':
        setTeam(data.team)
        break
    }
  }

  onConnectionClosed() {
    $('#connection').css('display', 'block')
    $('#login').css('display', 'none')
  }

  setTeam(team) {
    this.player.team = team
    $('#login-send').attr('class', 'team' + this.player.team)
    $('#play-deg').attr('class', 'team' + this.player.team)
  }

  setEvents() {
    // Listen for the event.
    document.addEventListener(
      'onWebSocketOpen',
      () => {
        this.onConnectionEstablished()
      },
      false,
    )

    if (localStorage.getItem('playerName') !== '') {
      this.player.name = localStorage.getItem('playerName')
    } else {
      this.player.name = ''
    }

    var loginName = $('#login-name')
    var loginSend = $('#login-send')

    loginName.val(this.player.name).focus()
    loginName.on('keyup', event => {
      if (event.keyCode === 13) {
        loginSend.click()
      }
    })

    loginSend.on('click', () => {
      this.player.name = loginName.val()

      if (this.player.name === '') {
        alert('Bitte Name ausfüllen')
      } else {
        localStorage.setItem('playerName', this.player.name)

        $('#login').css('display', 'none')
        $('#play').css('display', 'block')

        this.webSocket.send({
          type: 'setName',
          name: this.player.name,
        })
      }
    })

    $('#play-deg').on('input', event => {
      this.webSocket.send({
        type: 'setDeg',
        deg: $(event.currentTarget).val(),
      })
    })
  }
}
