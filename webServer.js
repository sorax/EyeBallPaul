const http = require('http')
const fs = require('fs')
const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port
const publicFolder = 'http'
const contentTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript'
}

class WebServer {
  constructor() {
    const server = http.createServer(function (request, response) {
      const ip = request.socket.address().address;
      // const ip2 = request.connection.remoteAddress;

      if (request.url === '/config.js') {
        response.writeHead(200, { 'Content-Type': contentTypes['js'] });
        response.write(`const wssAddress = '${ip}:${wsPort}';`);
        response.end();
      } else {
        const url = request.url === '/' ? '/index.html' : request.url

        fs.readFile(publicFolder + url, (error, data) => {
          if (!error) {
            response.writeHead(200, { 'Content-Type': contentTypes[url.split('.').slice(-1)] });
            response.write(data);
            response.end();
          } else {
            fs.readFile(publicFolder + '/404.html', (error, data) => {
              if (error) {
                throw error;
              }
              response.writeHead(404, { 'Content-Type': contentTypes['html'] });
              response.write(data);
              response.end();
            });
          }
        });
      }
    })
    server.listen(httpPort, error => {
      if (error) {
        return console.log('WebServer could not be started', error)
      }
      // console.log('WebServer is now listening on:', server.address(), httpPort)
    });
  }
};
module.exports = WebServer;
