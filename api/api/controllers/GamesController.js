/**
 * GamesController
 *
 * @description :: Methods for games management (games list, create a new game, register to a game...)
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * Retrieve all games properties
     */
    all: function(req, res) {
        Game.find().populate('werewolfsToken').populate('vampiresToken').exec(function(err, games) {
            if (err) return next(err);

            Game.subscribe(req.socket);
            Game.subscribe(req.socket, games);

            console.log(sails.sockets);

            var gamesProperties = [];
            games.forEach(function(game) {
                gamesProperties.push(game.properties());
            });

            return res.json(200, gamesProperties);
        });
    },

    /**
     * Create a game
     */
    create: function(req, res) {
        ValidationService.schemaValidation(req.params.all(), 'gameSchema', function(err, parameters) {
            if (err) return res.badRequest(err.message);

            var map = (parameters.map ? parameters.map : MapService.generateRandom());
            ValidationService.mapValidation(map, function(err) {
                if (err) return res.badRequest(err.message);

                Game.create({name: parameters.name}, function(err, game) {
                    if (err) return next(err);

                    game.loadMap(map);
                    game.save(function(err, game) {
                        if (err) return next(err);

                        Game.publishCreate(game.properties());
                        
                        return res.json(200, {id: game.id});
                    });
                });
            });
        });
    },

    /**
     * Register to a game
     */
    register: function(req, res) {
        ValidationService.schemaValidation(req.params.all(), 'registerSchema', function(err, parameters) {
            if (err) return res.badRequest(err.message);

            Game.findOneById(parameters.id).populate('werewolfsToken').populate('vampiresToken').exec(function(err, game) {
                if (err) return next(err);
                if (!game) return res.notFound();
                if (null != game[parameters.team + 'Token']) return res.badRequest('team exists');

                MathService.randomToken(function(err, tokenValue) {
                    if (err) return next(err);

                    Token.create({game: game.id, value: tokenValue}, function(err, token) {
                        if (err) return next(err);  

                        var updatedData = {};
                        updatedData[parameters.team + 'Token'] = token.id;
                        Game.update(game.id, updatedData).exec(function(err, game) {
                            if (err) return next(err);

                            Game.publishUpdate(game.id, {
                                availableTeams: game.availableTeams(),
                            });

                            return res.json(200, {token: tokenValue});
                        });
                    });
                });
            });
        });
    },
};
