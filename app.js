var server = require('http').createServer(handler);
var io = require('socket.io')(server);
var static = require('node-static');
var fileServer = new static.Server(__dirname + '/public');

function handler(req, res) {
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
}

io.on('connection', function (socket) {
    socket.emit('connect', {success: true});

    socket.on('disconnect', function() {
        io.sockets.emit('offline', {id: socket.id});
    });

    socket.on('snapshot', function(data) {
        io.sockets.emit('newPic', data);
    });
});

//server.listen(process.env.PORT || 3000);
server.listen(17555);
