console.log('server.js')

const SocketServer = require('./socketServer.js');
const socketServer = new SocketServer();
console.log(socketServer)

const WebServer = require('./webServer.js');
const webServer = new WebServer();
console.log(webServer)
