/**
 * Ship.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const COLORS = [
    '16a085','2E8B57','DC143C','C71585','FF4500',
    '9400D3','2F4F4F','BC8F8F','A52A2A','2ecc71',
    '00BFFF','4682B4','5F9EA0','0074D9','EE82EE',
    '39CCCC','01FF70','3D9970','FF851B','85144b',
    'B10DC9','2ECC40','F012BE','f368e0','01a3a4',
];

module.exports = {
    connection: 'localMysqlServer',
    attributes: {
        id: {
            type: 'integer',
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: 'string',
            required: true
        },
        battleId: {
            model: 'battle'
        },
        fleetId: {
            model: 'fleet'
        },
        start: {
            type: 'array'
        },
        direction: {
            type: 'integer'
        },
        coordinates: {
            // [[3,1],[3,2],[3,3]]
            type: 'array'
        },
        hitPoints: {
            // [[3,1],[3,2]]
            type: 'array'
        },
        isDestroyed: {
            type: 'boolean'
        },
        color: {
            type: 'string'
        }
    },
    beforeCreate: function (values, cb) {
        let colorIndex = Math.floor(Math.random() * COLORS.length -1);
        values.color = COLORS[colorIndex];
        cb();
    }
};
