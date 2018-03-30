/**
 * Shot.js
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
            type: 'string',
            required: true
        },
        fleetId: {
            type: 'string',
            required: true
        },
        X: {
            type: 'integer',
            required: true
        },
        Y: {
            type: 'integer',
            required: true
        },
        hit: {
            type: 'boolean'
        }
    }
};
