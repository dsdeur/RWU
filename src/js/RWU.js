var RWU = function() {
    sayCheese: new SayCheese('#campreview'),
    socket: SocketIO(),
    me: {
        id: null,
        snapshot: null
    },
    workers: {},

    initSayCheese: function() {
        var self = this;

        this.sayCheese.on('start', function() {
            self.looper();
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
            console.log(window.RWURoot.refresh);
        
        });

        this.sayCheese.start();
    },

    stopSayCheese: function() {
        this.sayCheese.stop();
    },

    uploadImage: function(img) {
        var data = new FormData();
        data.append('snapshot', img);
        data.append('id', this.me.id);

        var req = new XMLHttpRequest();
        req.open('POST', '/upload');
        req.send(data);

        console.log('upload')
    },

    setId: function(id) {
        RWU.me.id = this.io.engine.id;
    },

    newPic: function(id) {
        if(id == this.me.id) {
            return;
        }

        this.workers[id] = this.workers[id] || new Worker(id);
        this.workers[id].snapshot = '/images/' + id + '.jpg' + '?' + Date.now();
        
    
    },

    removeWorker: function(id) {
        delete this.workers[id];
    },

    takeSnapshot: function() {
        this.sayCheese.takeSnapshot(350, 260);
    },

    looper: function() {
        console.log('loop');
        this.takeSnapshot();
        // var self = $('#self');
        // self.css("transition", "none");
        // self.css("border-radius", 120);
        // setTimeout(function() {
        //     self.css("transition", "30s linear");
        //     self.css("border-radius", 3);
        // }, 0);

        setTimeout(this.looper, 30000);
    }

}


RWU.socket.on('connect', function() {
    RWU.setId = this.io.engine.id;
});

RWU.socket.on('newPic', function(data) {
   RWU.newPic(data.id)
});

RWU.socket.on('offline', function(data) {
    RWU.removeWorker(data.id)
});
