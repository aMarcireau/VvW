/**
 * MapService
 *
 * @description :: Map utilities
 */

module.exports = {
    /**
     * Generate a random map
     */
    generateRandom: function() {
        if (RuleService.map.size.minimum % 2 != 0)
            throw new Error('the minimum number of tiles should be even');
        if (Math.pow(RuleService.map.size.minimum, 2) < RuleService.map.humans.tiles.maximum + 2)
            throw new Error('the number of occupied tiles can be larger than the number of tiles');

        var map = {
            width: MathService.randomInteger(RuleService.map.size), 
            height: MathService.randomInteger(RuleService.map.size),
        };

        var count = Math.floor(MathService.randomInteger(RuleService.map.humans.tiles) / 2) + 1;
        var positions = [];
        if (map.width >= map.height) {
            positions = MathService.distinctPositions(Math.floor(map.width / 2), map.height, count);
        } else {
            positions = MathService.distinctPositions(map.width, Math.floor(map.height / 2), count);
        }

        var creaturesPosition = positions[0];
        creaturesPosition.count = MathService.randomInteger(RuleService.map.creatures);
        map.vampires = [creaturesPosition];
        map.werewolfs = [{
            x: map.width - creaturesPosition.x - 1, 
            y: map.height - creaturesPosition.y - 1, 
            count: creaturesPosition.count
        }];

        positions.splice(0, 1);
        positions.forEach(function(position) {
            position.count = MathService.randomInteger(RuleService.map.humans.number);
        });
        map.humans = positions;
        positions.forEach(function(position) {
            map.humans.push({
                x: map.width - position.x - 1, 
                y: map.height - position.y - 1, 
                count: position.count
            });
        });

        return map;
    },

    /**
     * Generate tiles matrix
     */
    tilesMatrix: function(tiles) {
        var matrix = {
            getTile: function(x, y) {
                if (this.tiles.hasOwnProperty(x) && this.tiles[x].hasOwnProperty(y)) return this.tiles[x][y];
                if (!this.tiles.hasOwnProperty(x)) this.tiles[x] = {};
                this.tiles[x][y] = {x: x, y: y};
                return this.tiles[x][y];
            },
            tiles: {},
        };

        tiles.forEach(function(tile) {
            if (!matrix.tiles.hasOwnProperty(tile.x)) matrix.tiles[tile.x] = {};
            matrix.tiles[tile.x][tile.y] = tile;
        });

        return matrix;
    },

    /**
     * Get distance between two positions
     */
    distance: function(firstPosition, secondPosition) {
        return Math.max(Math.abs(firstPosition.x - secondPosition.x), Math.abs(firstPosition.y - secondPosition.y));
    },
};
