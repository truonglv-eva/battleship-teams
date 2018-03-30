/**
 * class InviteService
 */
const Utils = require("../ai/Utils");
const BatteShipModel = require("../ai/BatteShipModel");
const appConfig = sails.config.app;
const event = sails.config.app.event();

var sessionId;

function createBattleOnMem(req) {
    let param = req.body;
    let battle = new BatteShipModel.Battle(sessionId, param.boardWidth, param.boardHeight, param.ships, appConfig);
    appConfig.battleManager.addBattle(battle);
}

var validateInput = function (req, res) {
    var params = req.body;

    if (params == null || params.boardWidth == null || params.boardHeight == null || params.ships == null) {
        let errMsg = 'Invalid parameters';
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(400, errObj);
        return false;
    } else {
        for (let index = 0; index < params.ships.length; index++) {
            if (params.ships[index].type == null || params.ships[index].quantity == null) {
                let errMsg = 'Invalid params for ships';
                let errObj = { "error": errMsg, "data": params, "class": this.className };
                event.emit('AppError', errObj);
                res.json(400, errObj);
                return false;
            }
        }
    }
    return true;
}

module.exports = {
    className: "InviteService",
    run: function (req, res) {

        sessionId = Utils.getSessionId(req);

        sails.log.debug("Our fleet: " + appConfig.OUR_FLEET);

        if (AuthService.validate(req, res)) {

            if (validateInput(req, res)) {
                sessionId = Utils.getSessionId(req);
                event.emit('InviteServiceStarted', sessionId);
                createBattleOnMem(req);

                if (FlowService.check(req, res, this.className, event)) {
                    setTimeout(function () {
                        DatabaseService.prepareFleets();
                        if (DatabaseService.prepareBattle(sessionId)) {
                            DatabaseService.prepareRecord(sessionId, appConfig.OUR_FLEET);
                        }
                    }, 100);

                    let msg = 'Success';
                    event.emit('InviteServiceEnded', sessionId);
                    return res.json(200, { success: true, message: 'Success' });
                }
            }
        }
    }
};
