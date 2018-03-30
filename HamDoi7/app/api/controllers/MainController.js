/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var event = sails.config.app.event();

event.on('AppError', function (err) {
    sails.log.error(err);
});

event.on('AppWarning', function (warn) {
    sails.log.warn(warn);
});

event.on('InviteServiceStarted', function (sessionId) {
    sails.log.info('InviteServiceStarted: ' + sessionId);
});

event.on('InviteServiceEnded', function (sessionId) {
    sails.log.info('InviteServiceEnded: ' + sessionId);
    let battle = sails.config.app.battleManager.getBattle(sessionId);
    sails.log.debug(JSON.stringify(battle));
});

event.on('PlaceShipsServiceStarted', function (sessionId) {
    sails.log.info('PlaceShipsServiceStarted: ' + sessionId);
});

event.on('PlaceShipsServiceEnded', function (sessionId) {
    sails.log.info('PlaceShipsServiceEnded: ' + sessionId);
    let battle = sails.config.app.battleManager.getBattle(sessionId);
    sails.log.debug(JSON.stringify(battle));
});

event.on('ShootServiceStarted', function (sessionId) {
    sails.log.info('ShootServiceStarted: ' + sessionId);
});

event.on('ShootServiceEnded', function (sessionId) {
    sails.log.info('ShootServiceEnded: ' + sessionId);
    let battle = sails.config.app.battleManager.getBattle(sessionId);
    sails.log.debug(JSON.stringify(battle));
});

event.on('NotifyServiceStarted', function (sessionId) {
    sails.log.info('NotifyServiceStarted: ' + sessionId);
});

event.on('NotifyServiceEnded', function (sessionId) {
    sails.log.info('NotifyServiceEnded: ' + sessionId);
    let battle = sails.config.app.battleManager.getBattle(sessionId);
    sails.log.debug(JSON.stringify(battle));
});

event.on('GameOverServiceStarted', function (sessionId) {
    sails.log.info('GameOverServiceStarted: ' + sessionId);
});

event.on('GameOverServiceEnded', function (sessionId) {
    sails.log.info('GameOverServiceEnded: ' + sessionId);
    let battle = sails.config.app.battleManager.getBattle(sessionId);
    sails.log.debug(JSON.stringify(battle));
});

module.exports = {
    invite: function (req, res) {
        return InviteService.run(req, res);
    }
    , placeShips: function (req, res) {
        return PlaceShipsService.run(req, res);
    }
    , shoot: function (req, res) {
        return ShootService.run(req, res);
    }
    , notify: function (req, res) {
        return NotifyService.run(req, res);
    }
    , gameOver: function (req, res) {
        return GameOverService.run(req, res);
    }
    , view: function (req, res) {
        return ViewService.run(req, res);
    }
};
