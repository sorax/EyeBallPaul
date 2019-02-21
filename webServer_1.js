const http = require('http')
const fs = require('fs')
const publicFolder = 'public'
const contentTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
}

class WebServer {
  constructor(httpPort, wsPort) {
    const server = http.createServer(function(request, response) {
      const address = request.socket.address()

      if (request.url === '/config.js') {
        const wsIp =
          address.family === 'IPv6'
            ? `[${address.address}]`
            : `${address.address}`
        const wsAddress = `127.0.0.1:${wsPort}` //`${wsIp}:${wsPort}`
        response.writeHead(200, { 'Content-Type': contentTypes['js'] })
        response.write(`const wsAddress = '${wsAddress}';`)
        response.end()
      } else {
        const url = request.url === '/' ? '/index.html' : request.url

        fs.readFile(publicFolder + url, (error, data) => {
          if (!error) {
            response.writeHead(200, {
              'Content-Type': contentTypes[url.split('.').slice(-1)],
            })
            response.write(data)
            response.end()
          } else {
            fs.readFile(publicFolder + '/404.html', (error, data) => {
              if (error) {
                throw error
              }
              response.writeHead(404, { 'Content-Type': contentTypes['html'] })
              response.write(data)
              response.end()
            })
          }
        })
      }
    })
    server.listen(httpPort, error => {
      if (error) {
        console.log('WebServer could not be started', error)
        return
      }
      console.log('WebServer is now listening on:', server.address(), httpPort)
    })
  }
}
module.exports = WebServer
