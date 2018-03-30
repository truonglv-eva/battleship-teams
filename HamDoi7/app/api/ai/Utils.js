let Utils = /** @class */ (function () {
  function Utils() {}
  Utils.getAbsolutePos = function (arrayRelativePos, indexOfCenter, posOnMap) {
    // chọn 1 ô trong toạ độ tương đối của ship làm tâm và đặt tâm đó tại vị trí pos trên bản đồ
    // X = x - center.X + posOnMap.X
    // Y = y - center.Y + posOnMap.Y
    var centerPos = arrayRelativePos[indexOfCenter];
    return arrayRelativePos.map(function (pos) {
      return [pos[0] - centerPos[0] + posOnMap[0], pos[1] - centerPos[1] + posOnMap[1]];
    });
  };

  Utils.getAbsolutePosFromCenterPos = function (arrayRelativePos, centerPos, posOnMap) {
    // tâm chính là vị trí trên bản đồ, từ ds toạ độ tương đối và tâm => tính toạ độ tuyệt đối
    // X = x - center.X + posOnMap.X
    // Y = y - center.Y + posOnMap.Y
    return arrayRelativePos.map(function (pos) {
      return [pos[0] - centerPos[0] + posOnMap[0], pos[1] - centerPos[1] + posOnMap[1]];
    });
  };

  Utils.createMatrix = function (width, height, value) {
    var matrix = [];
    for (var y = 0; y < height; y++) {
      matrix[y] = [];
      for (var x = 0; x < width; x++) {
        matrix[y][x] = 0;
      }
    }
    return matrix;
  };

  Utils.checkArrayPos = function (matrix, arrayPos, criteriaForRejection) {
    // arrayPos: mảng toạ độ tuyệt đối của tàu
    // criteriaForRejection: điều kiện để return false.
    // Lúc bắn sẽ truyền criteriaForRejection = MISS
    // Lúc phân phối tàu sẽ truyền criteriaForRejection = SHIP
    let height = matrix.length;
    let width = matrix[0].length;
    for (var i = 0; i < arrayPos.length; i++) {
      var x = arrayPos[i][0];
      var y = arrayPos[i][1];
      if (!(0 <= x && x < width &&
          0 <= y && y < height &&
          matrix[y][x] !== criteriaForRejection)) {
        return false;
      }
    }
    return true;
  };

  Utils.groupArrayPosByMatrixValue = function (matrix, arrayPos, appConfig) {
    // arrayPos: mảng toạ độ tuyệt đối của tàu
    // đếm số lượng hit, miss, sunk, empty
    let height = matrix.length;
    let width = matrix[0].length;
    let result = {
      arrayHitPos: [],
      arrayMissPos: [],
      arraySunkPos: [],
      arrayEmptyPos: []
    };
    let MAXTRIX_EMPTY_VALUE = appConfig.MAXTRIX_EMPTY_VALUE;
    let SHOT_STATUS = appConfig.SHOT_STATUS_INT;
    for (let i = 0; i < arrayPos.length; i++) {
      let x = arrayPos[i][0];
      let y = arrayPos[i][1];
      // kiểm tra toạ độ hợp lệ
      if (!(0 <= x && x < width &&
          0 <= y && y < height)) {
        return null;
      }
      let v = matrix[y][x];
      if (v == MAXTRIX_EMPTY_VALUE) {
        result.arrayEmptyPos.push([x, y]);
      } else if (v == SHOT_STATUS.HIT) {
        result.arrayHitPos.push([x, y]);
      } else if (v == SHOT_STATUS.MISS) {
        result.arrayMissPos.push([x, y]);
      } else if (v == SHOT_STATUS.SUNK) {
        result.arraySunkPos.push([x, y]);
      }
    }
    return result;
  };

  Utils.checkArrayPosHaveValue = function (matrix, arrayPos, value) {
    // arrayPos: mảng toạ độ tuyệt đối của tàu
    // giá trị các toạ độ đều là value
    let height = matrix.length;
    let width = matrix[0].length;
    for (var i = 0; i < arrayPos.length; i++) {
      var x = arrayPos[i][0];
      var y = arrayPos[i][1];
      if (!(0 <= x && x < width &&
          0 <= y && y < height &&
          matrix[y][x] == value)) {
        return false;
      }
    }
    return true;
  };

  Utils.randomInt = function (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  };

  Utils.getRandomPosition = function (width, height) {
    // Random from 0 to boardWidth and 0 to boardHeight
    return [Utils.randomInt(0, width - 1), Utils.randomInt(0, height - 1)];
  };

  Utils.getRandomPositionInRange = function (xStart, xEnd, yStart, yEnd) {
    return [Utils.randomInt(xStart, xEnd), Utils.randomInt(yStart, yEnd)];
  };

  // lấy toạ độ có xác suất cao nhất
  Utils.getBestPosition = function (probabilities, matrixEnemy, MAXTRIX_EMPTY_VALUE) {
    let bestProb = 0;
    let bestPos = null;
    for (var y = 0; y < probabilities.length; y++) {
      let row = probabilities[y];
      for (var x = 0; x < row.length; x++) {
        if (row[x] > bestProb && matrixEnemy[y][x] === MAXTRIX_EMPTY_VALUE) {
          bestProb = row[x];
          bestPos = [x, y];
        }
      }
    }
    return bestPos;
  };

  Utils.setPlayerIdOnBattle = function (battle, player1, player2, appConfig) {
    battle.player1 = player1;
    battle.player2 = player2;

    if (appConfig.OUR_FLEET === player1) {
      battle.enemyId = player2;
    } else {
      battle.enemyId = player1;
    }
  };

  Utils.isHitShoot = function (status, appConfig) {
    if (typeof status === "string") {
      return status === appConfig.SHOT_STATUS_STR.HIT;
    } else {
      return status === appConfig.SHOT_STATUS_INT.HIT;
    }
  };

  Utils.getSessionId = function (req) {
    return req.headers['x-session-id'];
  };

  Utils.isEnemy = function (battle, playerId) {
    return battle.enemyId === playerId;
  };

  Utils.updateEnemyShots = function (battle, shots, sunkShips, appConfig) {
    let myInfo = battle.myInfo;

    // lưu lại toàn bộ shots
    shots.forEach(function (shot) {
      myInfo.arrayShots.push(shot.coordinate);
    });

    if (sunkShips != null && sunkShips.length > 0) {
      let unSunkShips = myInfo.unSunkShips;
      sunkShips.forEach(function (sunkShip) {
        // lưu lại tàu chìm
        myInfo.sunkShips.push(sunkShip);

        // giảm số lượng tàu khi đã chìm
        let indexShip = unSunkShips.findIndex(function (ship) {
          return ship.type === sunkShip.type;
        });
        if (indexShip > -1) {
          unSunkShips[indexShip].quantity--;
          if (unSunkShips[indexShip].quantity == 0) {
            unSunkShips.splice(indexShip, 1);
          }
        }
      });
    }
  }

  Utils.updateShootsInfo = function (battle, shots, sunkShips, appConfig) {
    let enemyInfo = battle.enemyInfo;
    let arrayHitShotPos = enemyInfo.arrayHitShotPos;
    let board = enemyInfo.board;
    let SHOT_STATUS = appConfig.SHOT_STATUS_INT;

    // lưu lại toàn bộ shots
    shots.forEach(function (shot) {
      let pos = shot.coordinate;
      enemyInfo.arrayShots.push(pos);

      //lưu lại toạ độ các hit shots và đánh dấu trên bản đồ
      if (Utils.isHitShoot(shot.status, appConfig)) {
        arrayHitShotPos.push(pos);
        board[pos[1]][pos[0]] = SHOT_STATUS.HIT;
      } else {
        board[pos[1]][pos[0]] = SHOT_STATUS.MISS;
      }
    });

    if (sunkShips != null && sunkShips.length > 0) {
      // có tàu chìm
      let unSunkShips = enemyInfo.unSunkShips;
      sunkShips.forEach(function (sunkShip) {
        // lưu lại tàu chìm
        enemyInfo.sunkShips.push(sunkShip);

        // giảm số lượng tàu của đối thủ khi đã chìm
        let indexEnemyShip = unSunkShips.findIndex(function (enemyShip) {
          return enemyShip.type === sunkShip.type;
        });
        if (indexEnemyShip > -1) {
          unSunkShips[indexEnemyShip].quantity--;
          if (unSunkShips[indexEnemyShip].quantity == 0) {
            unSunkShips.splice(indexEnemyShip, 1);
          }
        }

        // xoá các toạ độ của tàu chìm ra khỏi arrayHitShotPos và đánh dấu trên bản đồ
        sunkShip.coordinates.forEach(function (posOfSunkShip) {
          let indexPos = arrayHitShotPos.findIndex(function (pos) {
            return pos[0] === posOfSunkShip[0] && pos[1] === posOfSunkShip[1];
          });
          if (indexPos > -1) {
            arrayHitShotPos.splice(indexPos, 1);
          }

          board[posOfSunkShip[1]][posOfSunkShip[0]] = SHOT_STATUS.SUNK;
        });
      });
    }
  };

  return Utils;
}());

module.exports = Utils;
