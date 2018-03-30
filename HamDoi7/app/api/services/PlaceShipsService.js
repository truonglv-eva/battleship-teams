/**
 * class PlaceShipsService
 */
const Utils = require("../ai/Utils");
const AI_init = require("../ai/Ai_init");
const appConfig = sails.config.app;
const event = sails.config.app.event();

var sessionId;
var totalShip = 0;

function updateModelOnMemAndCallAI(req, res) {
    let params = req.body;
    let battle = appConfig.battleManager.getBattle(sessionId);
    if (battle) {
        Utils.setPlayerIdOnBattle(battle, params.player1, params.player2, appConfig);
        return AI_init.placeShips(battle, appConfig);
    } else {
        let errMsg = "Can not load battle in memory. Service '" + appConfig.REQUIRED_SERVICES[0] + "' must be called first";
        let errObj = { "warn": errMsg, "data": params, "class": this.className };
        event.emit('AppWarning', errObj);
        res.json(200, errObj);
        return false;
    }
}

function validateInput(req, res) {
    var params = req.body;
    if (params == null || params.player1 == null || params.player2 == null) {
        let errMsg = 'Invalid parameters';
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(400, errObj);
        return false;
    }
    return true;
}

function updateDatabase(placedShips) {

    var data = appConfig.battleManager.getBattle(sessionId);

    sails.log.debug('++++++++++ placedShips ++++++++++');
    sails.log.debug(JSON.stringify(placedShips));
    sails.log.debug('+++++++++ /placedShips ++++++++++');

    // Save the squadron of our warships

    placedShips.forEach(function (ship) {
        let shipData = {
            type: ship.type,
            fleetId: appConfig.OUR_FLEET,
            battleId: sessionId,
            coordinates: ship.coordinates
        };
        Ship.findOrCreate(shipData, shipData)
            .exec(function createFindCB(error, record) {
                if (error == null && typeof record.id != 'undefined') {
                    sails.log.info("Found or created Ship:\n" + JSON.stringify(record));
                } else {
                    let errMsg = 'Cannot load or create Ship data';
                    let errObj = { "warn": errMsg, "data": error, "class": this.className };
                    event.emit('AppWarning', errObj);
                }
            });
    });

    // Determine the enemy
    DatabaseService.prepareRecord(sessionId, data.enemyId);
}

function prepareOurShips(placedShips) {

    var battleData = DatabaseService.prepareBattle(sessionId);

    if (battleData) {
        // If enough of ships, cancel the execution
        totalShip = battleData.CVs
            + battleData.BBs
            + battleData.CAs
            + battleData.DDs
            + battleData.ORs;

        sails.log.debug('++++++++++ totalShip ++++++++++');
        sails.log.debug(totalShip);
        sails.log.debug('+++++++++ /totalShip ++++++++++');

        Ship.count({
            battleId: sessionId,
            fleetId: appConfig.OUR_FLEET
        }).exec(function countCB(error, countShip) {
            if (countShip == null || countShip < totalShip) {
                if (placedShips && placedShips.length > 0) {
                    setTimeout(function () {
                        updateDatabase(placedShips);
                    }, 100);
                }
            }
        });
    }
}

module.exports = {
    className: "PlaceShipsService",
    run: function (req, res) {

        sessionId = Utils.getSessionId(req);

        if (AuthService.validate(req, res)) {
            if (validateInput(req, res) && FlowService.check(req, res, this.className, event)) {
                event.emit('PlaceShipsServiceStarted', sessionId);
                var placedShips = updateModelOnMemAndCallAI(req, res);
                prepareOurShips(placedShips);
                let msg = 'Success';
                event.emit('PlaceShipsServiceEnded', sessionId);
                return res.json(200, { success: true, message: msg, ships: placedShips });
            }
        }
    }
};
