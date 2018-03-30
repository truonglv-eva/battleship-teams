/**
 * Fleet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    connection: 'localMysqlServer',
    attributes: {
        id: {
            type: 'string',
            primaryKey: true,
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        ships: {
            collection: 'ship',
            via: 'fleetId'
        }
    }
};
