'use strict'

class WebSocketClient {
  constructor(wsAddress) {
    this.wsAddress = wsAddress

    this.reconnectTimeout
    this.reconnectTime = 2000
    this.reconnectCount = 0

    this.connect()
    this.setEvents()
  }
  connect() {
    // console.log('WebSocket Connect')
    $('#connection').text('Connecting ...')
    this.socket = new WebSocket('ws://' + this.wsAddress)
  }
  setEvents() {
    this.socket.onopen = () => {
      this.reconnectCount = 0
      // console.log('WebSocket Open: (STATUS: ' + this.socket.readyState + ')')
      $('#connection').text('Connected')

      window.emit('onWebSocketOpen')
    }

    this.socket.onmessage = message => {
      // console.log(message)
      const data = JSON.parse(message.data)
      window.emit('onWebSocketMessage', data)
    }

    this.socket.onerror = error => {
      console.log('WebSocket Error: ' + error)
    }

    this.socket.onclose = () => {
      console.log('WebSocket Close')
    }
  }
  send(data) {
    this.socket.send(JSON.stringify(data))
  }
}

// function WebSocketClient() {

//   var setEvents = function () {
//
//     socket.onmessage = function (message) {
//       //console.log('Received: %s', message.data);

//       var data = JSON.parse(message.data);
//       //console.log(data);

//       controller.onDataReceived(data);
//       //onMessage(data);
//     };

//     socket.onerror = function (error) {
//       //console.log('WebSocket Error: ' + error);
//     };

//     socket.onclose = function () {
//       //console.log('WebSocket Close');

//       controller.onConnectionClosed();
//       //onClose();
//       reConnect();
//     };
//   };

//   var reConnect = function () {
//     clearTimeout(reconnectTimeout);
//     reconnectCount++;

//     //console.log('WebSocket ReConnect ('+reconnectCount+')');
//     $('#connection').text('ReConnecting (' + reconnectCount + ')...');

//     reconnectTimeout = setTimeout(function () {
//       connect();
//     }, reconnectTime);
//   };

//   var init = function () {
//     //$('#connection').text('Connecting ...');
//     connect();
//   };

//   // INIT
//   init();
// }
