'use strict'

import { wsAddress } from './config.js'

export class WebSocketClient {
  constructor() {
    this._reconnectTimeout
    this._reconnectTime = 2000
    this._reconnectCount = 0

    this._socket = null

    this.connect()
  }

  connect() {
    window.emit('WebSocketConnecting', { address: wsAddress })

    this._socket = new WebSocket('ws://' + wsAddress)
    this.setEvents()
  }

  reconnect() {
    this._reconnectCount++
    window.emit('WebSocketReconnecting', this._reconnectCount)

    clearTimeout(this._reconnectTimeout)
    this._reconnectTimeout = setTimeout(() => {
      this.connect()
    }, this._reconnectTime)
  }

  setEvents() {
    this._socket.onopen = () => {
      // console.log('WebSocket Open')
      this._reconnectCount = 0
      window.emit('WebSocketOpen', { status: this._socket.readyState })
    }

    this._socket.onmessage = message => {
      // console.log(message)
      window.emit('WebSocketMessage', JSON.parse(message.data))
    }

    this._socket.onerror = error => {
      window.emit('WebSocketError', error)
    }

    this._socket.onclose = () => {
      window.emit('WebSocketClosed')
      this.reconnect()
    }
  }

  send(data) {
    this._socket.send(JSON.stringify(data))
  }
}
