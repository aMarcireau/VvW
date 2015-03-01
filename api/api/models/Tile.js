/**
* Tile.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes: {
        game: {
            model: 'Game',
        },
        x: {
            type: 'integer',
            required: true,
        },
        y: {
            type: 'integer',
            required: true,
        },
        controller: {
            type: 'string',
        },
        count: {
            type: 'integer',
        },

        /**
         * Get tile properties
         */
        properties: function() {
            return {
                x: this.x,
                y: this.y,
                count: this.count,
                controller: this.controller,
            };
        },

        /**
         * Handle a fight on the tile
         */
        fight: function() {
            if (this.hasOwnProperty('attackers') && this.hasOwnProperty('attackersCount')) {
                if (this.attackersCount > this.count) {
                    this.controller = this.attackers;
                    this.count = this.attackersCount;
                }
            }

            delete this.attackers;
            delete this.attackersCount
        },
    },
};

