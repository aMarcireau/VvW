/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    teams: ['vampires', 'werewolfs'],
    attributes: {
        name: {
            type: 'string',
            required: true,
        },
        vampiresToken: {
            model: 'Token',
        },
        werewolfsToken: {
            model: 'Token',
        },
        victory: {
            type: 'string',
        },
        width: {
            type: 'integer',
        },
        height: {
            type: 'integer',
        },
        tiles: {
            collection: "Tile",
            via: "game",
        },
        round: {
            type: 'integer',
            defaultsTo: 1,
        },

        /**
         * Get turn
         */
        turn: function() {
            return module.exports.teams[1 - this.round % 2]
        },

        /**
         * Get other turn
         */
        otherTurn: function() {
            return module.exports.teams[this.round % 2]
        },

        /**
         * Get token by team name
         */
        tokenByTeam: function(teamName) {
            return this[teamName + 'Token'];
        },

        /**
         * Get available teams
         */
        availableTeams: function() {
            var game = this;
            var teams = [];
            module.exports.teams.forEach(function(teamName) {
                if (null == game.tokenByTeam(teamName)) teams.push(teamName);
            })

            return teams;
        },

        /**
         * Get game properties
         */
        properties: function() {
            return {
                id: this.id,
                name: this.name,
                victory: this.victory,
                availableTeams: this.availableTeams(),
                round: this.round,
            };
        },

        /**
         * Get game state
         */
        state: function() {
            var state = this.properties();
            state.turn = this.turn();
            state.width = this.width;
            state.height = this.height;

            var tilesProperties = [];
            this.tiles.forEach(function(tile) {
                tilesProperties.push(tile.properties());
            });
            state.tiles = tilesProperties;

            return state;
        },

        /**
         * Load a map to generate tiles
         */
        loadMap: function(map) {
            this.width = map.width;
            this.height = map.height;
            var game = this;

            ['humans', 'vampires', 'werewolfs'].forEach(function(key) {
                map[key].forEach(function(position) {
                    game.tiles.add({x: position.x, y: position.y, controller: key, count: position.count});
                });
            });
        },

        /**
         * Execute a move action
         */
        executeMove: function(moveAction, moveData, callback) {
            var game = this;
            
            var err = null;
            ['origin', 'destination'].every(function(key) {
                if (moveAction[key].x >= game.width || moveAction[key].y >= game.height)
                    err = new Error('position overflow: [' + moveAction[key].x + ', ' + moveAction[key].y  + ']');
                return (null == err);
            });
            if (err) return callback(err);

            var originTile = moveData.tilesMatrix.getTile(moveAction.origin.x, moveAction.origin.y);
            if (originTile.controller != game.turn())
                return callback(new Error('wrong tile controller'));
            if (originTile.count < moveAction.count)
                return callback(new Error('not enough creatures'));
            originTile.count -= moveAction.count;
            moveData.hasBeenModified(originTile);
            
            var destinationTile = moveData.tilesMatrix.getTile(moveAction.destination.x, moveAction.destination.y);
            if (null == destinationTile.controller) {
                destinationTile.controller = game.turn();
                destinationTile.count = moveAction.count;
                destinationTile.game = game.id;
                destinationTile.properties = Tile.attributes.properties;
                this.tiles.push(destinationTile);

                moveData.hasBeenModified(destinationTile, true);
            } else if (destinationTile.controller == game.turn()) {
                destinationTile.count += moveAction.count;
                moveData.hasBeenModified(destinationTile);
            } else {
                destinationTile.attackers = game.turn();
                if (!destinationTile.hasOwnProperty(attackersCount)) destinationTile.attackersCount = 0;
                destinationTile.attackersCount += moveAction.count;
                moveData.hasBeenModified(destinationTile);
            }

            return callback(null);
        },

        /**
         * Check victory, switch turns
         */
        nextTurn: function(moveData) {
            var left = {};
            module.exports.teams.forEach(function(team) {
                left[team] = 0;
            });

            this.tiles.forEach(function(tile) {
                if (left.hasOwnProperty(tile.controller)) left[tile.controller] += tile.count;
            });

            var game = this;
            if (left[module.exports.teams[0]] == 0 || left[module.exports.teams[1]] == 0) {
                module.exports.teams.every(function(team) {
                    if (left[team] > 0) {
                        game.victory = team;
                        return false;
                    }
                    return true;
                });
                if (null == game.victory) game.victory = 'draw';
            } else {
                this.round += 1;
            }
        },
    },
};
