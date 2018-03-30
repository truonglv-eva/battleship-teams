/**
 * Application variables Setting
 */
var events = require('events');
var eventEmitter = new events.EventEmitter();

const BatteShipModel = require("../api/ai/BatteShipModel");
let battleManager = new BatteShipModel.BattleManager();

module.exports.app = {
    settings: {},
    battleManager: battleManager,
    event: function () {
        return eventEmitter;
    },
    VALIDATE_GAME_ENGINE: false,
    GAME_ENGINE_HOSTS: [
        "::1",
        "127.0.0.1",
        "localhost",
        "10.10.20.10",
        "192.168.56.101",
        "172.18.0.6",
        "34.218.182.81",
        "34.210.33.232",
    ],
    CHECK_SERVICE: false,
    REQUIRED_SERVICES: [
        'InviteService',
        'PlaceShipsService',
        'ShootService',
        'NotifyService',
        'GameOverService',
    ],
    FLEETS: [
        { id: 'ham_doi_7', name: 'Hạm Đội 7' },
        { id: '4t', name: '4T' },
        { id: 'random', name: 'Random' },
        { id: 'ea_team_no1', name: 'EA Team No.1' },
        { id: 'the_pirates', name: 'The Pirates' },
        { id: 'fleet_b', name: 'Fleet B' },
        { id: 'johnny_depp', name: 'Johnny Depp' },
        { id: 'calisthenis', name: 'Calisthenis' },
        { id: 'dying_gull', name: 'Dying Gull' },
        { id: 'ban_toan_truot', name: 'Bắn Toàn Trượt' },
        { id: 'web_util', name: "Web Utilities" },
    ],
    OUR_FLEET: 'ham_doi_7',
    SHIP_TYPES: {
        OIL_RIG: 'OR',
        CRUISER: 'CA',
        DESTROYER: 'DD',
        BATTLESHIP: 'BB',
        CARRIER: "CV"
    },
    SHIP_DIRECTION: {
        VERTICAL: 0,
        HORIZONTAL: 1
    },
    SHIP_MAP_OBJ: {
        "CV": [
            {
                width: 2,
                height: 4,
                borderPos: [[1, -1], [2, 0], [2, 1], [2, 2], [2, 3], [1, 4], [0, 3], [0, 2], [0, 0]]
            }, {
                width: 4,
                height: 2,
                borderPos: [[-1, 1], [0, 0], [2, 0], [3, 0], [4, 1], [3, 2], [2, 2], [1, 2], [0, 2]]
            }
        ],
        "BB": [
            {
                width: 1,
                height: 4,
                borderPos: [[0, -1], [1, 0], [1, 1], [1, 2], [1, 3], [0, 4], [-1, 3], [-1, 2], [-1, 1], [-1, 0]]
            }, {
                width: 4,
                height: 1,
                borderPos: [[0, -1], [1, -1], [2, -1], [3, -1], [4, 0], [3, 1], [2, 1], [1, 1], [0, 1], [-1, 0]]
            }
        ],
        "OR": [
            {
                width: 2,
                height: 2,
                borderPos: [[1, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 1], [-1, 0], [0, -1]]
            }, {
                width: 2,
                height: 2,
                borderPos: [[0, -1], [1, -1], [2, 0], [2, 1], [1, 2], [0, 2], [-1, 1], [-1, 0]]
            }
        ],
        "CA": [
            {
                width: 1,
                height: 3,
                borderPos: [[0, -1], [1, 0], [1, 1], [1, 2], [0, 3], [-1, 2], [-1, 1], [-1, 0]]
            }, {
                width: 3,
                height: 1,
                borderPos: [[0, -1], [1, -1], [2, -1], [3, 0], [2, 1], [1, 1], [0, 1], [-1, 0]]
            }
        ],
        "DD": [
            {
                width: 1,
                height: 2,
                borderPos: [[0, -1], [1, 0], [1, 1], [0, 2], [-1, 1], [-1, 0]]
            }, {
                width: 2,
                height: 1,
                borderPos: [[0, -1], [1, -1], [2, 0], [1, 1], [0, 1], [-1, 0]]
            }
        ]
    },
    SHIP_MAP: {
        "CV": [
            [[1, 0], [1, 1], [1, 2], [1, 3], [0, 1]],
            [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0]],
        ],
        "BB": [
            [[0, 0], [0, 1], [0, 2], [0, 3]],
            [[0, 0], [1, 0], [2, 0], [3, 0]],
        ],
        "CA": [
            [[0, 0], [0, 1], [0, 2]],
            [[0, 0], [1, 0], [2, 0]],
        ],
        "DD": [
            [[0, 0], [0, 1]],
            [[0, 0], [1, 0]],
        ],
        "OR": [
            [[1, 0], [1, 1], [0, 1], [0, 0]],
            [[0, 0], [1, 0], [1, 1], [0, 1]],
        ],
    },
    SHOT_STATUS_INT: {
        "HIT": 1,
        "MISS": -1,
        "SUNK": -2,
    },
    SHOT_STATUS_STR: {
        "HIT": "HIT",
        "MISS": "MISS"
    },
    IDX_START_POS: 0,
    MAXTRIX_EMPTY_VALUE: 0,
    MAXTRIX_SHIP_VALUE: -2,
    MAXTRIX_BORDER_VALUE: -3,
    MAX_LIFE: 5,
    MIN_LIFE: 2,
    VIEW_MODE: {
        THEORY: 0,
        VISUAL: 1
    }
};
