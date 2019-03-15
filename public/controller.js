'use strict'

import { Player } from './player.js'
import { WebSocketClient } from './WebSocketClient.js'

document.addEventListener('DOMContentLoaded', () => {
  new Controller()
})

class Controller {
  constructor() {
    this.player = new Player()
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

  onDataReceived(data) {
    // console.log('Received: ', data)
    switch (data.type) {
      case 'setTeam':
        this.setTeam(data.team)
        break
    }
  }

  onConnectionClosed() {
    // console.log('ConnectionClosed')
    $('#connection').text('Reconnecting ...')
    this.showConnectionScreen()
    this.hideLoginScreen()
  }

  setTeam(team) {
    this.player.team = team
    $('#login-send').attr('class', 'team' + this.player.team)
    $('#play-deg').attr('class', 'team' + this.player.team)
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
      this.onDataReceived(event.detail)
    })

    window.on('WebSocketClosed', () => {
      this.onConnectionClosed()
    })

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
        this.hideLoginScreen()
        this.showPlayScreen()
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
