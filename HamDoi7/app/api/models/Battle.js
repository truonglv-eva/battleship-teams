/**
 * Battle.js
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
        boardWidth: {
            type: 'integer',
            required: true
        },
        boardHeight: {
            type: 'integer',
            required: true
        },
        CVs: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        BBs: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        CAs: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        DDs: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        },
        ORs: {
            type: 'integer',
            required: true,
            defaultsTo: 0
        }
    }
};
