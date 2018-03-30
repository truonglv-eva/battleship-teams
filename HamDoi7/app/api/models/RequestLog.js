/**
 * RequestLog.js
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
        sessionId: {
            type: 'string',
            required: true
        },
        token: {
            type: 'string'
        },
        ip: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        message: {
            type: 'string'
        },
        logTime: {
            type: 'string'
        },
        uri: {
            type: 'string'
        },
        params: {
            type: 'json'
        },
        headers: {
            type: 'json'
        }
    }
};
