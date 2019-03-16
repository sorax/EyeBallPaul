const wsPort = process.env.npm_package_config_ws_port

const SocketServer = require('./server/socketServer.js')
new SocketServer(wsPort)

require('./server/webServer.js')

// process.title = 'Server'
// console.log(`
// ${process.title} started:
// - pId: ${process.pid}
// - pTitle: ${process.title}
// - httpPort: ${httpPort}
// - wsPort: ${wsPort}
// `
// );
