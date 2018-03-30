/**
 * class ShootService
 */
const Utils = require("../ai/Utils");
const appConfig = sails.config.app;
const Ai_shooting = require("../ai/Ai_shooting");
const event = sails.config.app.event();
var sessionId;

function callAI(req, res) {
    let params = req.body;
    let battle = appConfig.battleManager.getBattle(sessionId);

    if (battle) {
        battle.turn = params.turn;
        return Ai_shooting.shoot(battle, params.turn, params.maxShots, appConfig);
    } else {
        let errMsg = "Can not load battle in memory. Service '" + appConfig.REQUIRED_SERVICES[0] + "' must be called first";
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(200, errObj);
        return false;
    }
}

var validateInput = function (req, res) {
    var params = req.body;
    if (params == null || params.turn == null || params.maxShots == null) {
        let errMsg = 'Invalid parameters';
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(200, errObj);
        return false;
    }
    return true;
}

module.exports = {
    className: "ShootService",
    run: function (req, res) {

        sessionId = Utils.getSessionId(req);

        if (AuthService.validate(req, res)) {
            if (validateInput(req, res) && FlowService.check(req, res, this.className, event)) {

                event.emit('ShootServiceStarted', sessionId);
                let params = req.body;
                let shots = callAI(req, res);

                if (shots) {
                    let msg = 'Success';
                    let returnData = { success: true, message: msg, coordinates: shots };
                    event.emit('ShootServiceEnded', sessionId);
                    return res.json(200, returnData);
                }
                event.emit('ShootServiceEnded', sessionId);

            }
        }
    }
};
