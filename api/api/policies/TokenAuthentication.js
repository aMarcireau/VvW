/**
 * TokenAuthenticaion
 *
 * @module      :: Policy
 * @description :: Check if the given token is valid for the current turn
 *
 */

module.exports = function(req, res, next) {
    ValidationService.schemaValidation(req.params.all(), 'tokenSchema', function(err, parameters) {
        if (err) return res.badRequest(err.message);

        Game.findOneById(parameters.id).populate('vampiresToken').populate('werewolfsToken').exec(function(err, game) {
            if (err) return next(err);
            if (!game) return res.notFound();
            if (null == game.tokenByTeam(game.turn())) return res.forbidden();


            require('bcrypt').compare(parameters.token, game.tokenByTeam(game.turn()).value, function (err, match) {
                if (err) return next(err);
                if (!match) return res.forbidden();

                return next();
            });
        });
    });
};
