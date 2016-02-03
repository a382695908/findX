var port = 8181; 

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
 
server.listen(port, function(){
    console.log('Listening at: http://localhost:' + port);
 });
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

