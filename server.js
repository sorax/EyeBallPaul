const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port

const SocketServer = require('./socketServer.js')
new SocketServer(wsPort)

const WebServer = require('./webServer.js')
new WebServer(httpPort, wsPort)

// process.title = 'Server'
// console.log(`
// ${process.title} started:
// - pId: ${process.pid}
// - pTitle: ${process.title}
// - httpPort: ${httpPort}
// - wsPort: ${wsPort}
// `
// );
