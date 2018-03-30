/**
 * @class AuthService
 */

function saveToDB(requestModel) {
    setTimeout(function () {
        try {
            RequestLog.create(requestModel).exec(function (err, records) {
                if (err) {
                    sails.log.error(err);
                }
            });
        } catch (ex) {
            sails.log.error(ex);
        }
    }, 100);
}

module.exports = {
    className: "AuthService",
    validate: function (req, res) {
        var msg;
        var sessionId = req.headers['x-session-id'];
        var token = req.headers['x-token'];
        var ip = req.ip;
        var uri = req.path;
        var logTime = new Date();
        var result = false;
        var requestModel = {
            'sessionId': sessionId,
            'token': token,
            'ip': ip,
            'uri': uri,
            'headers': JSON.stringify(req.headers),
            'params': JSON.stringify(req.body),
            'status': '',
            'message': '',
            'logTime': logTime.getFullYear()
                + '-' + (logTime.getMonth() + 1)
                + '-' + logTime.getDate()
                + ' ' + logTime.getHours()
                + ':' + logTime.getMinutes()
                + ':' + logTime.getSeconds()
                + '.' + logTime.getMilliseconds()
        };

        sails.log.debug('+++++++++++++++ AuthService +++++++++++++++');
        sails.log.debug('Log time: ' + requestModel.logTime);
        sails.log.debug('URI: ' + requestModel.uri);
        sails.log.debug('IP: ' + requestModel.ip);
        sails.log.debug('Headers: ' + requestModel.headers);
        sails.log.debug('Params: ' + requestModel.params);

        if (sails.config.app.VALIDATE_GAME_ENGINE == true
            && (sails.config.app.GAME_ENGINE_HOSTS.indexOf(ip) < 0 || sails.config.app.GAME_ENGINE_HOSTS.indexOf('::ffff:' + ip) < 0)) {
            msg = "ERROR: This request was not sent from game server!";
            requestModel.status = 403;
            requestModel.message = msg;
            res.json(requestModel.status, { error: requestModel.message });
            saveToDB(requestModel);
        } else if (
            sessionId != null && sessionId.length > 0
            && token != null && token.length > 0
        ) {
            requestModel.status = 200;
            requestModel.message = "OK";
            res.set('X-SESSION-ID', sessionId);
            res.set('X-TOKEN', token);
            result = true;
        }

        if (!result) {
            msg = "ERROR: Invalid request!";
            requestModel.status = 400;
            requestModel.message = msg;
            res.json(requestModel.status, { error: requestModel.message });
        }

        saveToDB(requestModel);

        sails.log.debug('Status: ' + requestModel.status);
        sails.log.debug('Message: ' + requestModel.message);
        sails.log.debug('+++++++++++++ / AuthService +++++++++++++++');

        return result;
    }
};
