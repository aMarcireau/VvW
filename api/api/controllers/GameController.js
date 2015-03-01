/**
 * GameController
 *
 * @description :: Methods to interact with a game (state getters, )
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * Game state
     */
    state: function(req, res) {
        Game.findOneById(req.param('id')).populateAll().exec(function(err, game) {
            if (err) return next(err);
            if (!game) return res.notFound();

            sails.sockets.join(req.socket, game.id + 'State');

            return res.json(200, game.state());
        });
    },

    /**
     * Game move
     */
    move: function(req, res) {
        ValidationService.moveValidation(req.params.all(), function(err, move) {
            if (err) return res.badRequest(err.message);

            Game.findOneById(move.id).populateAll().exec(function(err, game) {
                if (err) return next(err);
                if (!game) return res.notFound();
                if (null != game.victory) return res.badRequest('game is over');
                if (game.availableTeams().length != 0) return res.badRequest('team missing');

                var moveData = {
                    tilesMatrix: MapService.tilesMatrix(game.tiles),
                    hasBeenModified: function (tile, created) {
                        if (created) tile.created = true;
                        if (!tile.pushed) {
                            this.modifiedTiles.push(tile);
                            tile.pushed = true;
                        }
                    },
                    modifiedTiles: [],
                };
                move.moves.every(function(moveAction) {
                    game.executeMove(moveAction, moveData, function(moveError) {
                        err = moveError;
                    });
                    return (null == err);
                });
                if (err) return res.badRequest(err.message);

                var tilesProperties = [];
                moveData.modifiedTiles.forEach(function(tile) {
                    delete tile.pushed;
                    if (tile.created) {
                        delete tile.created;
                        Tile.create(tile).exec(function(err) {
                            if (err) return next(err);
                        });
                    } else {
                        tile.fight();
                        if (tile.count == 0) {
                            Tile.destroy({id: tile.id}).exec(function(err) {
                                if (err) return next(err);
                            });
                        } else {
                            Tile.update({id: tile.id}, {controller: tile.controller, count: tile.count}).exec(function(err) {
                                if (err) return next(err);
                            });
                        }
                    }
                    tilesProperties.push(tile.properties());
                });
                game.nextTurn(moveData);
                Game.update({id: game.id}, {victory: game.victory, round: game.round}).exec(function(err) {
                    if (err) return next(err);

                    Game.publishUpdate(game.id, {
                        victory: game.victory,
                        round: game.round,
                    });
                    sails.sockets.emit(game.id + 'State', game.id, {
                        id: game.id,
                        victory: game.victory,
                        round: game.round,
                        tiles: tilesProperties,
                    });

                    return res.ok();
                });
            });
        });
    },
};
