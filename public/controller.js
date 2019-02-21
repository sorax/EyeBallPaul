'use strict'

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
    console.log('onConnectionEstablished')
    $('#connection').css('display', 'none')
    $('#login').css('display', 'block')

    // Set client type
    this.webSocket.send({
      type: 'setClientType',
      clientType: 'controller',
    })
  }

  onDataReceived(data) {
    // console.log('Received: ', data)
    switch (data.type) {
      case 'setTeam':
        this.setTeam(data.team)
        break
    }
  }

  onConnectionClosed() {
    console.log('onConnectionClosed')
    $('#connection').text('Reconnecting ...')
    $('#connection').css('display', 'block')
    $('#login').css('display', 'none')
  }

  setTeam(team) {
    this.player.team = team
    $('#login-send').attr('class', 'team' + this.player.team)
    $('#play-deg').attr('class', 'team' + this.player.team)
  }

  setEvents() {
    window.listen('onWebSocketConnect', event => {
      console.log('event.detail', event.detail)
      $('#connection').text('Connecting ...')
    })

    window.listen('onWebSocketOpen', () => {
      this.onConnectionEstablished()
    })

    window.listen('onWebSocketClosed', () => {
      this.onConnectionClosed()
    })

    window.listen('onWebSocketMessage', event => {
      this.onDataReceived(event.detail)
    })

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