var RWURoot = require('RWU_root');
var React = require('react');
var RWUModel = require('RWU');
var SayCheese = require('say-cheese');
var SocketIO = require('socket.io-client');

// Enable React developer tools
window.React = require('react');

var RWU = new RWUModel(SocketIO(), new SayCheese('#campreview'));

document.addEventListener('DOMContentLoaded', function(){
    window.RWURoot = React.renderComponent(RWURoot({ RWU: RWU }), document.getElementById('content'));
});
