module.exports = {
    isShipOnLand: function(ship, board) {
        var shipCoords = Ship.calculatePosition(ship.type, ship.start, ship.direction);
        var boardWidth = board[0];
        var boardHeight = board[1];
        for (let index = 0; index < shipCoords.length; index++) {
            if (shipCoords[index][0] > boardWidth) {
                return {result: true, value:['x', shipCoords[index][0]]};
            }
        }
    }
};