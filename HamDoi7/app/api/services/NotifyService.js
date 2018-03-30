/**
 * class NotifyService
 */
const Utils = require("../ai/Utils");
const appConfig = sails.config.app;
const event = sails.config.app.event();
var sessionId;

function updateModelOnMem(req, res) {
    let params = req.body;
    let battle = appConfig.battleManager.getBattle(sessionId);

    if (battle) {
        if (!Utils.isEnemy(battle, params.playerId)) {
            Utils.updateShootsInfo(battle, params.shots, params.sunkShips, appConfig);
        } else {
            Utils.updateEnemyShots(battle, params.shots, params.sunkShips, appConfig);
        }
    } else {
        let errMsg = "Can not load battle in memory. Service '" + appConfig.REQUIRED_SERVICES[0] + "' must be called first";
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(400, errObj);
        return false;
    }
}

var validateInput = function (req, res) {
    var params = req.body;
    var valid = true;

    if (params != null && params.playerId != null && params.shots != null) {
        for (let index = 0; index < params.shots.length; index++) {
            let shot = params.shots[index];
            if (shot.coordinate == null || shot.status == null) {
                valid = false;
            }
        }

        if (params.sunkShips != null) {
            for (let index = 0; index < params.sunkShips.length; index++) {
                let sunkShip = params.sunkShips[index];
                if (sunkShip.coordinates == null || sunkShip.type == null) {
                    valid = false;
                }
            }
        }
    } else {
        valid = false;
    }

    if (!valid) {
        let errMsg = 'Invalid parameters';
        let errObj = { "error": errMsg, "data": params, "class": this.className };
        event.emit('AppError', errObj);
        res.json(400, errObj);
        return false;
    }

    return true;
}

var updateSunkShips = function (sunkShips, battleId, fleetId) {
    if (fleetId == appConfig.OUR_FLEET) {
        Ship.find({
            battleId: battleId,
            fleetId: fleetId
        }).exec(function (error, records) {
            if (error) {
                let errMsg = 'Cannot load Ship data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            } else {
                sunkShips.forEach(function (sunkShip) {
                    records.forEach(function (ship) {
                        if (sunkShip.type == ship.type) {
                            let matchPoint = 0;
                            sunkShip.coordinates.forEach(function (hitCoord) {
                                ship.coordinates.forEach(function (coord) {
                                    if (hitCoord === coord) {
                                        matchPoint++;
                                    }
                                });
                            });
                            if (matchPoint == ship.coordinates.length) {
                                Ship.update(
                                    { id: ship.id }, { isDestroyed: true }
                                ).exec(function afterwards(error, updated) {
                                    if (error) {
                                        let errMsg = 'Cannot update Ship data';
                                        let errObj = { "warn": errMsg, "data": error, "class": this.className };
                                        event.emit('AppWarning', errObj);
                                    }
                                });
                            }
                        }
                    });
                });

            }
        });
    } else {
        sunkShips.forEach(function (sunkShip) {
            Ship.create({
                battleId: battleId,
                fleetId: fleetId,
                type: sunkShip.type,
                coordinates: sunkShip.coordinates,
                hitPoints: sunkShip.coordinates,
                isDestroyed: true
            }).exec(function (error, records) {
                if (error) {
                    let errMsg = 'Cannot create Ship data';
                    let errObj = { "warn": errMsg, "data": error, "class": this.className };
                    event.emit('AppWarning', errObj);
                }
            });
        });
    }
}

var updateDatabase = function () {

    var battleData = appConfig.battleManager.getBattle(sessionId);

    // Update our shots, hits, sunkShips

    Record.update({
        battleId: battleData.sessionId,
        fleetId: appConfig.OUR_FLEET,
    }, { hits: battleData.myInfo.arrayHitShotPos, shots: battleData.myInfo.arrayShots, sunkShips: battleData.myInfo.sunkShips })
        .exec(function afterwards(error, updated) {
            if (error) {
                let errMsg = 'Cannot update Record data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            } else if (updated.length > 0) {
                updateSunkShips(battleData.myInfo.sunkShips, battleData.sessionId, appConfig.OUR_FLEET);
            }
        });

    // Update enemy shots, hits, sunkShips

    Record.update({
        battleId: battleData.sessionId,
        fleetId: battleData.enemyId,
    }, { hits: battleData.enemyInfo.arrayHitShotPos, shots: battleData.enemyInfo.arrayShots, sunkShips: battleData.enemyInfo.sunkShips })
        .exec(function afterwards(error, updated) {
            if (error) {
                let errMsg = 'Cannot update Record data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            } else if (updated) {
                updateSunkShips(battleData.enemyInfo.sunkShips, battleData.sessionId, battleData.enemyId);
            }
        });
}

function saveShots(shots) {
    if (shots != null && shots.length > 0) {
        shots.forEach(function (shot) {
            Shot.create({
                battleId: sessionId,
                fleetId: appConfig.OUR_FLEET,
                X: shot.coordinate[0],
                Y: shot.coordinate[1],
                hit: shot.status == appConfig.SHOT_STATUS_STR.HIT ? true : false
            }).exec(function (error, records) {
                if (error) {
                    let errMsg = 'Cannot create Shot data';
                    let errObj = { "warn": errMsg, "data": error, "class": this.className };
                    event.emit('AppWarning', errObj);
                }
            });
        });
    }
}

module.exports = {
    className: "NotifyService",
    run: function (req, res) {

        sessionId = Utils.getSessionId(req);

        if (AuthService.validate(req, res)) {
            if (validateInput(req, res) && FlowService.check(req, res, this.className, event)) {

                event.emit('NotifyServiceStarted', sessionId);
                updateModelOnMem(req, res);

                let params = req.body;

                if (params.playerId != appConfig.OUR_FLEET) {
                    setTimeout(function () {
                        saveShots(params.shots);
                    }, 100);
                }

                // Save hit points
                setTimeout(function () {
                    updateDatabase();
                }, 100);

                let msg = 'Success';
                let returnData = { success: true, message: msg };

                event.emit('NotifyServiceEnded', sessionId);
                return res.json(200, returnData);

            }
        }
    }
};
