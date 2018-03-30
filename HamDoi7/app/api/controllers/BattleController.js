/**
 * BattleController
 *
 * @description :: Server-side logic for managing battles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const BatteShipModel = require("../ai/BatteShipModel");
const CONSTANT = BatteShipModel.CONSTANT;

module.exports = {
  invite: function (request, response) {
    // empty content
    var arrayShips = BatteShipModel.ShipFactory.getArrayShips(CONSTANT.SHIP_TYPES.BATTLESHIP);
    return response.json(arrayShips);
  },
  placeShips: function (request, response) {
    var ships = [{
      type: 'BB',
      coordinates: [[1, 2], [1, 3], [1, 4], [1, 5]]
    },
    {
      type: 'DD',
      coordinates: [[2, 2], [3, 2]]
    }];
    return response.json({ 'ships': ships });
  },
  shoot: function (request, response) {
    var coordinates = [[5, 6]];
    return response.json({ 'coordinates': coordinates });
  },
  notify: function (request, response) {
    // empty content
    return response.json();
  },
  gameOver: function (request, response) {
    // empty content
    return response.json();
  }
};

