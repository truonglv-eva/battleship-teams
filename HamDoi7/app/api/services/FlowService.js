const appConfig = sails.config.app;

module.exports = {
    check: function (req, res, serviceName, event) {
        if (!appConfig.CHECK_SERVICE) {
            return true;
        }

        let sessionId = req.headers['x-session-id'];
        let battle = appConfig.battleManager.getBattle(sessionId);
        let errMsg = '';
        let overlap = false;
        let allowOverlap = false;

        if (battle != null && battle.calledService == serviceName) {
            overlap = true;
        }

        switch (serviceName) {
            case appConfig.REQUIRED_SERVICES[0]:
                battle.calledService = battle.calledService == null || battle.calledService.length == 0 ? serviceName : battle.calledService;
                break;

            case appConfig.REQUIRED_SERVICES[1]:
                if (battle != null && battle.calledService != null) {
                    var prev = appConfig.REQUIRED_SERVICES[0];
                    battle.calledService = battle.calledService == prev ? serviceName : battle.calledService;
                }
                break;

            case appConfig.REQUIRED_SERVICES[2]:
                if (battle != null && battle.calledService != null) {
                    var prev = appConfig.REQUIRED_SERVICES[1];
                    var next = appConfig.REQUIRED_SERVICES[3];
                    battle.calledService = battle.calledService == prev || battle.calledService == next ? serviceName : battle.calledService;
                }
                break;

            case appConfig.REQUIRED_SERVICES[3]:
                if (battle != null && battle.calledService != null) {
                    var prev = appConfig.REQUIRED_SERVICES[2];
                    battle.calledService = battle.calledService == prev ? serviceName : battle.calledService;
                }
                break;

            case appConfig.REQUIRED_SERVICES[4]:
                if (battle != null && battle.calledService != null) {
                    var prev = appConfig.REQUIRED_SERVICES[3];
                    battle.calledService = serviceName;
                }
                break;
        }

        if (!overlap) {
            if (battle == null) {
                errMsg = "Can not go to '" + serviceName + "'. You must start with '" + appConfig.REQUIRED_SERVICES[0] + "' first.";
            } else if (battle.calledService != serviceName) {
                errMsg = "Can not go to '" + serviceName + "'. You are at '" + battle.calledService + "'";
            }
        } else {
            errMsg = "Overlap calling '" + serviceName + "'.";
        }

        if (errMsg.length > 0) {
            let errObj = { "error": errMsg, "data": null, "class": serviceName };
            event.emit('AppError', errObj);
            res.json(400, errObj);
            return false;
        }

        return true;
    }
}
