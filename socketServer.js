console.log('socketServer.js')

const port = process.env.npm_package_config_ws_port
console.log(port)


// const WebSocket = require('ws');

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', function connection(ws, req) {
//   const ip = req.connection.remoteAddress;
// });

class SocketServer {
    constructor(height, width) {
        this.name = 'Rectangle';
        this.height = height;
        this.width = width;
    }

    sayName() {
        console.log('Hi, I am a ', this.name + '.');
    }
    get area() {
        return this.height * this.width;
    }
    set area(value) {
        this.height = this.width = Math.sqrt(value);
    }
};

// class Square extends Rectangle {
//     constructor(length) {
//         this.height; // ReferenceError, super needs to be called first!

//         // Here, it calls the parent class' constructor with lengths
//         // provided for the Polygon's width and height
//         super(length, length);

//         // Note: In derived classes, super() must be called before you
//         // can use 'this'. Leaving this out will cause a reference error.
//         this.name = 'Square';
//     }
// }

module.exports = SocketServer;