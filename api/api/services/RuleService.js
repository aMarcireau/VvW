/**
 * RuleService
 *
 * @description :: Rules container
 */

module.exports = {
    map: {
        size: {
            minimum: 10,
            maximum: 30,
        },
        humans: {
            number: {
                minimum: 2,
                maximum: 5,
            },
            tiles: {
                minimum: 10,
                maximum: 50,
            },
        },
        creatures: {
            minimum: 3,
            maximum: 7,
        },
    },
};
