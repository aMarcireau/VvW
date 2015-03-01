/**
 * MathService
 *
 * @description :: Math utilities
 */

module.exports = {
    /**
     * Generate random token
     */
    randomToken: function(callback) {
        require('crypto').randomBytes(48, function(err, buffer) {
            if (err) return callback(err);

            return callback(null, buffer.toString('hex'));
        });
    },

    /**
     * Get random integer
     */
    randomInteger: function(interval) {
        return Math.floor((Math.random() * (interval.maximum - interval.minimum + 1)) + interval.minimum);
    },

    /**
     * Generate distinct positions in the given rectangle
     */
    distinctPositions: function(width, height, count) {
        var positions = [];
        for (x = 0; x < width; x++) {
            for (y = 0; y < width; y++) {
                positions.push({x: x, y: y});
            }
        }

        return MathService.shuffle(positions).slice(0, count);
    },

    /**
     * Shuffle
     */
    shuffle: function(array) {
        for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
        
        return array;
    },

    /**
     * Is integer
     */
    isInteger: function(integer) {
        return integer == parseInt(integer, 10) && integer >= 0;
    },
};
