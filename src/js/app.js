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
        var data = {
            id: this.me.id,
            snapshot: img
        }

        this.socket.emit('snapshot', data);
        
        console.log('upload')
    },

    this.setId = function(id) {
        RWU.me.id = id;
    }

    this.newPic = function(data) {
        if(data.id == this.me.id) {
            return;
        }

        this.workers[data.id] = this.workers[data.id] || new Worker(data.id);
        this.workers[data.id].snapshot = data.snapshot;
        
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
    console.log(data);
    RWU.newPic(data);
});

RWU.socket.on('offline', function(data) {
    RWU.removeWorker(data.id)
});


document.addEventListener('DOMContentLoaded', function(){
    window.RWURoot = React.renderComponent(RWURoot({ RWU: RWU }), document.getElementById('content'));
});
