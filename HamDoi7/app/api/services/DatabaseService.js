/**
 * 
 * @class DatabaseService
 */

const appConfig = sails.config.app;
const event = sails.config.app.event();

module.exports = {
    className: "DatabaseService",
    prepareFleets: function () {
        for (let index = 0; index < appConfig.FLEETS.length; index++) {
            Fleet.findOrCreate(
                appConfig.FLEETS[index], appConfig.FLEETS[index]
            ).exec(function createFindCB(error, record) {
                if (error == null && typeof record.id != 'undefined') {
                    sails.log.info("Found or created Fleet:\n" + JSON.stringify(record));
                } else {
                    let errMsg = 'Cannot load or create Fleet data';
                    let errObj = { "warn": errMsg, "data": error, "class": this.className };
                    event.emit('AppWarning', errObj);
                }
            });
        }
        return true;
    },
    prepareBattle: function (sessionId) {
        var data = appConfig.battleManager.getBattle(sessionId);

        Battle.findOne({ id: sessionId }).exec(function (error, foundRecord) {
            if (foundRecord) {
                return foundRecord;
            } else {
                var battleData = {
                    id: data.sessionId,
                    boardWidth: data.boardWidth,
                    boardHeight: data.boardHeight,
                    CVs: 0,
                    BBs: 0,
                    CAs: 0,
                    DDs: 0,
                    ORs: 0
                };

                for (let index = 0; index < data.ships.length; index++) {
                    battleData[data.ships[index].type.toUpperCase() + 's'] = data.ships[index].quantity;
                }

                Battle.create(battleData).exec(function (error, createdRecord) {
                    if (error) {
                        let errMsg = 'Cannot findOrCreate Battle data';
                        let errObj = { "warn": errMsg, "data": error, "class": this.className };
                        event.emit('AppWarning', errObj);
                        return false;
                    } else if (typeof createdRecord.id != 'undefined') {
                        sails.log.info("Found or created Battle:\n" + JSON.stringify(createdRecord));
                        return createdRecord;
                    }
                });
            }
        });
        return false;
    },
    prepareRecord: function (sessionId, fleetId) {
        let recordData = { battleId: sessionId, fleetId: fleetId };
        Record.findOrCreate(
            recordData, recordData
        ).exec(function createFindCB(error, record) {
            if (error == null && typeof record.id !== 'undefined') {
                sails.log.info("Found or created Record:\n" + JSON.stringify({
                    id: record.id,
                    battleId: record.battleId,
                    fleetId: record.fleetId
                }));
            } else {
                let errMsg = 'Cannot load or create Record data';
                let errObj = { "warn": errMsg, "data": error, "class": this.className };
                event.emit('AppWarning', errObj);
            }
        });

        return true;
    }

};
