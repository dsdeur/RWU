var Worker = function(id) {
    this.id = id;
    this.snapshot = null;
}

var RWUModel = function(socket, sayCheese) {
    var self = this;
    this.sayCheese = sayCheese;
    this.socket = socket;
    this.me = new Worker(null);
    this.workers = {};
    this.timer;

    this.socket.on('connect', function() {
        self.setId(this.io.engine.id);
    });

    this.socket.on('newPic', function(data) {
        self.newPic(data);
    });

    this.socket.on('offline', function(data) {
        self.removeWorker(data.id)
    });

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
    
    this.initSayCheese = function() {
        this.sayCheese.start();
    },

    this.stopSayCheese = function() {
        clearTimeout(this.timer);
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
        this.me.id = id;
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
        self.sayCheese.takeSnapshot(350, 260);
    }
    
    this.retakeSnaphot = function() {
        clearTimeout(self.timer);
        self.takeSnapshot();
        self.timer = setTimeout(looper, 30000);
    }

    function looper() {
        console.log('loop');
        self.takeSnapshot();

        self.timer = setTimeout(looper, 30000);
    }
}

module.exports = RWUModel;