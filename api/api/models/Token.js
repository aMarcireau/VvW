/**
* Token.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {
    attributes: {
        value: {
            type: 'string',
            unique: true,
        },
        game: {
            model: 'Game',
        },
    },
    beforeCreate: function(token, callback) {
        var bcrypt = require('bcrypt');
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return callback(err);
            bcrypt.hash(token.value, salt, function(err, hash) {
                if (err) return callback(err);
                token.value = hash;

                callback();
            });
        });
    },
};
