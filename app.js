var express = require('express');
var multer = require('multer');
var util = require('util');
var app = express();
var sys = require('sys');
var fs = require('fs');

var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(multer({
    dest: './public/images/'
}));
app.use(express.static(__dirname + '/public'));

app.post("/upload", function(req, res, next){ 
    var img = req.body.snapshot.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFile(__dirname + '/public/images/' + req.body.id + '.jpg', img, 'base64', function(err){
        if (err) throw err;

        io.sockets.emit('newPic', {id: req.body.id});

        res.end('done');
    });
});

io.on('connection', function (socket) {
    socket.emit('connect', {success: true});

    socket.on('disconnect', function() {
        fs.unlink(__dirname + '/public/images/' + socket.id + '.jpg', function(){
            io.sockets.emit('offline', {id: socket.id});
        });
    });
});

//server.listen(process.env.PORT || 3000);
server.listen(17555);