/**
 * class GameOverService
 */
const Utils = require("../ai/Utils");
const appConfig = sails.config.app;
const event = sails.config.app.event();
var sessionId;

function updateModelOnMem(req) {
    let battle = appConfig.battleManager.getBattle(sessionId);
    battle.result = req.body
}

var updateDatabase = function () {
    let battle = appConfig.battleManager.getBattle(sessionId);

    // Update our fleet record

    var result = battle.result;

    Record.update({
        battleId: sessionId,
        fleetId: appConfig.OUR_FLEET,
    }, {
            isWinner: result.winner == appConfig.OUR_FLEET ? 1 : 0,
            numberOfTurns: result.statistics != null ? result.statistics.numberOfTurns : null,
            elapsedTime: result.statistics != null ? result.statistics.elapsedTime : null
        }).exec(function afterwards(error, updated) {
            if (error) {
                let errMsg = 'Cannot update our Record data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            }
        });

    // Update enemy fleet record

    Record.update({
        battleId: sessionId,
        fleetId: battle.enemyId,
    }, {
            isWinner: result.winner == battle.enemyId ? 1 : 0,
            numberOfTurns: result.statistics != null ? result.statistics.numberOfTurns : null,
            elapsedTime: result.statistics != null ? result.statistics.elapsedTime : null
        }).exec(function afterwards(error, updated) {
            if (error) {
                let errMsg = 'Cannot update enemy Record data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            }
        });

}

var validateInput = function (req, res) {
    var params = req.body;
    if (
        params == null || params.winner == null || params.loser == null ||
        (
            params.statistics != null &&
            (params.statistics.numberOfTurns == null || params.statistics.elapsedTime == null)
        )
    ) {
        let errMsg = 'Invalid parameters';
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(400, errObj);
        return false;
    }
    return true;
}

module.exports = {
    className: "GameOverService",
    run: function (req, res) {

        sessionId = Utils.getSessionId(req);

        if (AuthService.validate(req, res)) {

            if (validateInput(req, res) && FlowService.check(req, res, this.className, event)) {

                sessionId = Utils.getSessionId(req);
                event.emit('GameOverServiceStarted', sessionId);
                updateModelOnMem(req);

                setTimeout(function () {
                    updateDatabase();
                }, 100);

                let msg = 'Success';
                event.emit('GameOverServiceEnded', sessionId);
                return res.json(200, { success: true, message: msg });

            }
        }

    }
};
