const SocketServer = require('./socketServer.js');
const socketServer = new SocketServer();
console.log(socketServer)

const WebServer = require('./webServer.js');
new WebServer();
