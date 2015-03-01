var Reflux = require('reflux');
var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

module.exports = Reflux.createStore({
    games: [],
    init: function() {
        io.socket.get('/games/all', function(body, JWR) {
            console.log(body);
            console.log(JWR);
        });
    },
});
