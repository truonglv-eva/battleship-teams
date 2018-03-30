/**
 * 
 * @class ViewService
 */

function viewShipConfig(req, res) {
    var type = req.param('t');
    var direction = req.param('d');
    var boardWidth = req.param('w');
    var boardHeight = req.param('h');
    var viewMode = req.param('v');
    var appConfig = sails.config.app;
    let data = {
        "board": {
            "width": parseInt(boardWidth),
            "height": parseInt(boardHeight),
            "mode": parseInt(viewMode)
        },
        'ships': JSON.stringify([{
            'type': type,
            'coordinates': appConfig.SHIP_MAP[type][direction],
            'cover': appConfig.SHIP_MAP_OBJ[type][direction]['borderPos']
        }])
    };

    console.log(data);
    return res.view('main/view', data);
}

function viewBattle(req, res) {
    var sessionId = req.param('battleId');
    var shipIndex = req.param('ship');
    var viewMode = req.param('v');

    Battle.findOne({
        id: sessionId
    }).exec(function (error, record) {
        if (error) {
            return res.serverError(error);
        }

        Ship.find({
            battleId: sessionId,
            fleetId: sails.config.app.OUR_FLEET
        }).exec(function (error, records) {
            if (error) {
                return res.serverError(error);
            }
            if (shipIndex == null) {
                let data = {
                    "ships": JSON.stringify(records),
                    "board": {
                        "width": record.boardWidth,
                        "height": record.boardHeight,
                        "mode": parseInt(viewMode)
                    }
                };
                console.log(data);
                return res.view('main/view', data);
            } else {
                if (typeof records[shipIndex] !== 'undefined') {
                    let data = {
                        "ships": JSON.stringify([records[shipIndex]]),
                        "board": {
                            "width": record.boardWidth,
                            "height": record.boardHeight,
                            "mode": parseInt(viewMode)
                        }
                    }
                    console.log(data);
                    return res.view('main/view', data);
                }
            }
            return res.view('404');
        });

    });
}

module.exports = {
    run: function (req, res) {
        var query = req.param('q');

        if (query == null) {
            return res.view('404');
        }

        switch (query) {
            case 'config':
                return viewShipConfig(req, res);
                break;

            case 'data':
                return viewBattle(req, res);
                break;

            default:
                break;
        }

    }
};
