console.log('server.js')

const WebSocketServer = require('./socketServer.js');
const socketServer = new WebSocketServer();

console.log(socketServer)


const port = process.env.npm_package_config_port

console.log(port)



// const port = 300

// //const ball = require('./ball');
// //import Ball from './ball'

// // const http = require('http');
// // http.createServer(function (req, res) {
// //   res.write('Hello World!')
// //   res.end()
// // }).listen(8080)

// //Ball


// const fs = require('fs');
// const http = require('http');
// http.createServer(function (req, res) {
//   const url = req.url;
//   const ip = req.socket.address().address;

//   var result = data.replace(/wsIP = 'localhost'/g, 'wsIP = "192.168.0.12"');
//   //    res.write(result);

//   /*  fs.readFile('controller.html', function (err, data) {
//       res.writeHead(200, { 'Content-Type': 'text/html' });
//       res.write(data);
//       res.end();
//     });
//     */
//   res.writeHead(200, { 'Content-Type': 'text/html' });
//   res.write('bla123');
//   console.log(url);
//   console.log(ip);
//   res.end();

// }).listen(port, err => {
//   if (err) {
//     return console.log('something bad happened', err)
//   }
//   console.log(`server is listening on ${port}`)
// });


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
// //         res.end();
// //     });
// // }).listen(8080);




// const http = require('http');
// const hostname = '127.0.0.1';
// //const port = 80;
// const port = Math.floor(Math.random() * 32000);
// console.log(port)

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