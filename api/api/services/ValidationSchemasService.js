/**
 * ValidationSchemaService
 *
 * @description :: validation schema container
 */

module.exports = {
    gameSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'name': {'type': 'string'},
            },
            'required': ['name'],
        };
    },
    registerSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'id': {'type': 'string'},
                'team': {'type': 'string', 'enum': ['vampires', 'werewolfs']},
            },
            'required': ['id', 'team'],
        };
    },
    tokenSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'id': {'type': 'string'},
                'token': {'type': 'string'},
            },
            'required': ['id', 'token'],
        };
    },
    positionSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'x': {'type': 'integer', 'minimum': 0},
                'y': {'type': 'integer', 'minimum': 0},
            },
            'required': ['x', 'y'],
        };
    },
    countedPositionSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'x': {'type': 'integer', 'minimum': 0},
                'y': {'type': 'integer', 'minimum': 0},
                'count': {'type': 'integer', 'minimum': 1},
            },
            'required': ['x', 'y', 'count'],
        };
    },
    individualPositionsSchema: function() {
        return {
            'type': 'array',
            'minItems': 1,
            'items': module.exports.countedPositionSchema(),
        };
    },
    mapSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'width': {'type': 'integer', 'minimum': 1},
                'height': {'type': 'integer', 'minimum': 1},
                'humans': module.exports.individualPositionsSchema(),
                'vampires': module.exports.individualPositionsSchema(),
                'werewolfs': module.exports.individualPositionsSchema(),
            },
            'required': ['width', 'height', 'humans', 'vampires', 'werewolfs'],
        };
    },
    moveSchema: function() {
        return {
            'type': 'object',
            'properties': {
                'moves': {
                    'type': 'array',
                    'minItems': 1,
                    'items': {
                        'type': 'object',
                        'properties': {
                            'count': {'type': 'integer', 'minimum': 1},
                            'origin': module.exports.positionSchema(),
                            'destination': module.exports.positionSchema(),
                        },
                        'required': ['count', 'origin', 'destination'],
                    },
                },
            },
            'required': ['moves'],
        };
    },
};
