const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let port = 3000;
this.taxiSocket = null;
this.pasengerSocket = null;

io.on('connection', socket => {
    console.log('connected to socket ');
    // socket.emit('pasengerLocationID', 'ChIJaYEywC31OxARdqWJNqOhhXg')
    socket.on('taxiRequest', routeResponse => {
        this.pasengerSocket = socket;
        console.log(routeResponse);
        if (this.taxiSocket) {
            // console.log('we are here')
            this.taxiSocket.emit('taxiRequest', routeResponse)
        } 
    });
    socket.on('lookingForPassenger', () => {
        // console.log('someone is looking for passenger');
        this.taxiSocket = socket;
    });

    socket.on('driverLocation', driverLocation => {
        this.pasengerSocket.emit('driverLocation', driverLocation);
    });

})

server.listen(port, () => console.log(`app listening on port: ${port}`))
