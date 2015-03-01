/**
 * ValidationService
 *
 * @description :: validate data against a schema
 */

var jsonSchemaValidator = require('jsonschema').Validator;
var validator = new jsonSchemaValidator();

module.exports = {
    /**
     * Base data validation
     */
    baseValidation: function(data, schema, callback) {
        var errors = validator.validate(data, schema).errors

        return callback(errors[0], data);
    },

    /**
     * Schema validation
     */
    schemaValidation: function(data, schemaName, callback) {
        module.exports.baseValidation(data, ValidationSchemasService[schemaName](), function(err, data) {
            return callback(err, data);
        });
    },

    /**
     * Map validation
     */
    mapValidation: function(map, callback) {
        module.exports.schemaValidation(map, 'mapSchema', function(err, map) {
            if (err) return callback(err, map);
            
            var positions = [];
            ['humans', 'vampires', 'werewolfs'].every(function(key) {
                map[key].every(function(position) {
                    if (position.x > map.width || position.y > map.height) {
                        err = new Error('position overflow: [' + position.x + ', ' + position.y  + ']');
                    } else {
                        positions.every(function(storedPosition) {
                            if (MapService.distance(storedPosition, position) == 0) 
                                err = new Error('duplicated position: [' + position.x + ', ' + position.y  + ']');
                            return (null == err);
                        });
                        positions.push(position);
                    }
                    return (null == err);
                });
                return (null == err);
            });
    
            return callback(err, map);
        });
    },

    /**
     * Move validation
     */
    moveValidation: function(move, callback) {
        module.exports.schemaValidation(move, 'moveSchema', function(err, move) {
            if (err) return callback(err, move);

            var origins = [];
            var destinations = [];
            move.moves.every(function(moveAction) {
                if (MapService.distance(moveAction.origin, moveAction.destination) != 1) {
                    err = new Error('invalid distance between tiles');
                } else {
                    [
                        {list: origins, compared: moveAction.destination}, 
                        {list: destinations, compared: moveAction.origin},
                    ].every(function(pair) {
                        pair.list.every(function(listElement) {
                            if (MapService.distance(listElement, pair.compared) == 0) 
                                err = new Error('a tile is used as both origin and destination');
                            return (null == err);
                        });
                        return (null == err);
                    });
                    origins.push(moveAction.origin);
                    destinations.push(moveAction.destination);
                }
                return (null == err);
            });
            return callback(err, move);
        });
    },
};
