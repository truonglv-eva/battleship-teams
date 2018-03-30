/**
 * Record.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'localMysqlServer',
    attributes: {
        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },
        battleId: {
            model: 'battle'
        },
        fleetId: {
            model: 'fleet'
        },
        shots: {
            type: 'array'
        },
        hits: {
            type: 'array'
        },
        misses: {
            type: 'array'
        },
        sunkShips: {
            type: 'array'
        },
        isWinner: {
            type: 'boolean'
        },
        numberOfTurns: {
            type: 'integer'
        },
        elapsedTime: {
            type: 'integer'
        }
    }
};
