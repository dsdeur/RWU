$(function() {
    var id;
    var sayCheese = new SayCheese('#campreview');
    var socket = io();
    var ids = [];

    socket.on('connect', function() {
        if(typeof id == 'undefined') {
            initSayCheese();
        }
        
        id = this.io.engine.id;
        console.log(this);
    });

    socket.on('newPic', function(data) {
        if(data.id == id) {
            return;
        }

        if(!$('#' + data.id).length) {
            console.log('create div');
            $('<div />', {
                id: data.id
            }).appendTo('#content');
        }

        var img = $('<img />', {
            src: '/images/' + data.id + '.jpg' + '?' + Date.now()
        }).load(function(){
            $('#' + data.id).html(img);        
        });
    });

    socket.on('offline', function(data) {
        $('#' + data.id).remove();
    });
 
    function looper() {
        console.log('loop');
        sayCheese.takeSnapshot(350, 260);

        var self = $('#self');
        self.css("transition", "none");
        self.css("border-radius", 120);
        setTimeout(function() {
            self.css("transition", "30s linear");
            self.css("border-radius", 3);
        }, 0);

        setTimeout(looper, 30000);
    }

    function uploadImage(snapshot) {
        var img = snapshot.toDataURL('image/jpeg');

        var data = new FormData();
        data.append('snapshot', img);
        data.append('id', id);

        var req = new XMLHttpRequest();
        req.open('POST', '/upload');
        req.send(data);

        console.log('upload')
    }

    function initSayCheese() {
        sayCheese.on('start', function() {
            looper();
            console.log('SayCheese started');
        });

        sayCheese.on('error', function(error){
            console.log('error:', error);
        });

        sayCheese.on('snapshot', function(snapshot){
            console.log('snapshot :D');
            uploadImage(snapshot);

            var img = document.createElement('img');

            if(!$('#self').length) {
                console.log('create div');
                $('<div />', {
                    id: 'self'
                }).appendTo('#content');
            }

            $('#self').empty();
            var img = $('<img />', {
                src: img.src = snapshot.toDataURL('image/jpeg')
            });
            $('#self').html(img);
        });

        sayCheese.start();
    }
});