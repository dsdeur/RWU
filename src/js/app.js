var SayCheese = require('say-cheese');
var SocketIO = require('socket.io-client');
var RWURoot = require('RWU_root');
var React = require('react');
var jquery = require('jquery');

// Enable React developer tools
window.React = require('react');

var Worker = function(id) {
    this.id = id;
    this.snapshot = null;
}

var RWUModel = function() {
    this.self = this;
    this.sayCheese = new SayCheese('#campreview');
    this.socket = SocketIO();
    this.me = {
        id: null,
        snapshot: null
    },
    this.workers = {};

    this.initSayCheese = function() {
        var self = this;
        this.sayCheese.on('start', function() {
            looper();
            console.log('SayCheese started');
        });

        this.sayCheese.on('error', function(error){
            console.log('error:', error);
        });

        this.sayCheese.on('snapshot', function(snapshot){
            snapshot = snapshot.toDataURL('image/jpeg');
            console.log('snapshot :D');
            self.uploadImage(snapshot);
            self.me.snapshot = snapshot;
            window.RWURoot.refresh();
        });

        this.sayCheese.start();
    },

    this.stopSayCheese = function() {
        this.sayCheese.stop();
    }

    this.uploadImage = function(img) {
        var data = new FormData();
        data.append('snapshot', img);
        data.append('id', this.me.id);

        var req = new XMLHttpRequest();
        req.open('POST', '/upload');
        req.send(data);

        console.log('upload')
    },

    this.setId = function(id) {
        RWU.me.id = id;
    }

    this.newPic = function(id) {
        if(id == this.me.id) {
            return;
        }

        this.workers[id] = this.workers[id] || new Worker(id);
        this.workers[id].snapshot = '/images/' + id + '.jpg' + '?' + Date.now();
        
        window.RWURoot.refresh();
    },

    this.removeWorker = function(id) {
        delete this.workers[id];
    }

    this.takeSnapshot = function() {
        this.sayCheese.takeSnapshot(350, 260);
    }
}
var RWU = new RWUModel();

function looper() {
    console.log('loop');
    RWU.takeSnapshot();

    setTimeout(looper, 30000);
}

RWU.socket.on('connect', function() {
    RWU.setId(this.io.engine.id);
});

RWU.socket.on('newPic', function(data) {
   RWU.newPic(data.id)
});

RWU.socket.on('offline', function(data) {
    RWU.removeWorker(data.id)
});


document.addEventListener('DOMContentLoaded', function(){
    window.RWURoot = React.renderComponent(RWURoot({ RWU: RWU }), document.getElementById('content'));
});
