console.log('webServer.js')

const http = require('http')
const fs = require('fs')
const httpPort = process.env.npm_package_config_http_port
const wsPort = process.env.npm_package_config_ws_port
let ip = ''
const publicFolder = 'http'
const publicFiles = {
    html: ['404', 'index', 'controller', 'observer'],
    css: ['styles'],
    js: ['controller', 'observer']
}
const contentTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript'
}

class WebServer {
    constructor() {
        var server = http.createServer(function (request, response) {
            const ip = request.socket.address().address;
            const ip2 = request.connection.remoteAddress;


            let responseData = ''
            let responseType = ''

            // 1 - config

            // 1.) http://www.eyeballpaul.de/
            // 2.) http://www.eyeballpaul.de/controller.html oder http://www.eyeballpaul.de/observer.html
            // 3.) -> http://www.eyeballpaul.de/config.js
            

            if (request.url === '/config.js'){
                responseData = `const = '${ip}:${wsPort}';`
                responseType = contentTypes[js]
            } else {
                const fileType = url.split('.').slice(-1)
                //console.log(fileType)
    
                const fileName = url.split('/')[1].split('.')[0]
                //console.log('fileName', fileName + '.' + fileType);
    
                let filePath = publicFolder + '/404.html'
                //console.error(publicFiles[fileType].indexOf(fileName))
    
                if (publicFiles[fileType].indexOf(fileName) !== -1) {
                    filePath = publicFolder + '/' + fileName + '.' + fileType
                    //console.log('A')
                } else {
                    //console.log('B')
                }
                //console.log('filePath', filePath);
    
            }

            // 2 - datei die nicht existiert
            // 3 - datei die existiert




            //console.log('---')
            const url = request.url !== '/' ? request.url : '/index.html'
            //console.log('url', url);

            

            

            // console.log(ip);
            // console.log(ip2);
            // console.log(this.address().address)
            // console.log(request)
            // response.write('Hello World!')
            // response.end()


            //console.log('readFile')
            try {
                fs.readFile(filePath, function (error, data) {
                    responseData = data
                });
            } catch (e) {
                console.log(e)
            }

            response.writeHead(200, { 'Content-Type': contentTypes[fileType] });
            response.write(responseData);
            response.end();
        })
        server.listen(port, error => {
            if (error) {
                return console.log('WebServer could not be started', error)
            }
            const ip = server.address()
            console.log('WebServer is now listening on:', ip, port)
        });
    }
};
module.exports = WebServer;





// http.createServer(function (req, res) {

//   var result = data.replace(/wsIP = 'localhost'/g, 'wsIP = "192.168.0.12"');
//   //    res.write(result);

//     */

// })


// // var url = require('url');
// // var http = require('http');
// // var fs = require('fs');
// // http.createServer(function (req, res) {
// //     fs.readFile('demo.html', 'utf8', function (err, data) {
// //         if (err) {
// //             return console.log(err);
// //         }

// //         res.writeHead(200, { 'Content-Type': 'text/html' });

// //         




// try {
//     const server = http.createServer((req, res) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('Hello World\n');
//     });

//     server.listen(port, hostname, () => {
//         console.log(`Server running at http://${hostname}:${port}/`);
//     });
// } catch (e) { console.log('foo') }

// try {
//     const server = http.createServer((req, res) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('Hello World\n');
//     });

//     server.listen(port + 3, hostname, () => {
//         console.log(`Server running at http://${hostname}:${port}/`);
//     });
// } catch (e) { console.log('foo') }