console.log('server.js')

//const ball = require('./ball');
import Ball from './ball'

// const http = require('http');
// http.createServer(function (req, res) {
//   res.write('Hello World!')
//   res.end()
// }).listen(8080)

Ball

const fs = require('fs');
const http = require('http').createServer(function (req, res) {
  fs.readFile('demofile1.html', function (err, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(data);
    res.end();
  });
}).listen(8080);

// var url = require('url');
// var http = require('http');
// var fs = require('fs');
// http.createServer(function (req, res) {
//     fs.readFile('demo.html', 'utf8', function (err, data) {
//         if (err) {
//             return console.log(err);
//         }

//         res.writeHead(200, { 'Content-Type': 'text/html' });

//         var result = data.replace(/wsIP = 'localhost'/g, 'wsIP = "192.168.0.12");
//     res.write(result);
//         res.end();
//     });
// }).listen(8080);
