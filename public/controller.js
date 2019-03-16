'use strict'

// import { Player } from './player.js'
// const Player = require('./player.js')
import { WebSocketClient } from './WebSocketClient.js'

document.addEventListener('DOMContentLoaded', () => {
  new Controller()
})

class Controller {
  constructor() {
    this.playername
    this.setEvents()
    this.webSocket = new WebSocketClient()
  }

  showConnectionScreen() {
    $('#connection').css('display', 'block')
  }

  hideConnectionScreen() {
    $('#connection').css('display', 'none')
  }

  showLoginScreen() {
    $('#login').css('display', 'block')
  }

  hideLoginScreen() {
    $('#login').css('display', 'none')
  }

  showPlayScreen() {
    $('#play').css('display', 'block')
  }

  sendClientType() {
    this.webSocket.send({
      type: 'setClientType',
      clientType: 'controller',
    })
  }

  onConnectionEstablished() {
    // console.log('ConnectionEstablished')
    this.hideConnectionScreen()
    this.showLoginScreen()
    this.sendClientType()
  }

  onConnectionClosed() {
    // console.log('ConnectionClosed')
    $('#connection').text('Reconnecting ...')
    this.showConnectionScreen()
    this.hideLoginScreen()
  }

  setEvents() {
    window.on('WebSocketConnecting', () => {
      $('#connection').text('Connecting ...')
    })

    window.on('WebSocketReconnecting', event => {
      $('#connection').text(`Reconnecting ... (${event.detail})`)
    })

    window.on('WebSocketOpen', () => {
      this.onConnectionEstablished()
    })

    window.on('WebSocketMessage', event => {
      console.log(event.detail)
    })

    window.on('WebSocketClosed', () => {
      this.onConnectionClosed()
    })

    var loginName = $('#login-name')
    var loginSend = $('#login-send')
    loginName.val(this.playername).focus()
    loginName.on('keyup', event => {
      if (event.keyCode === 13) {
        loginSend.click()
      }
    })
    loginSend.on('click', () => {
      this.playername = loginName.val()
      if (this.playername === '') {
        alert('Bitte Name ausfüllen')
      } else {
        localStorage.setItem('playerName', this.playername)
        this.hideLoginScreen()
        this.showPlayScreen()
        this.webSocket.send({
          type: 'setName',
          name: this.playername,
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
