/**
 * Ai_shooting.js
 */
const Utils = require("./Utils");

// tính ma trận xác suất trong destroy mode
function calculateProbabilitiesInDestroyMode(battle, appConfig) {
  let probabilities = Utils.createMatrix(battle.boardWidth, battle.boardHeight, 0);
  let enemyInfo = battle.enemyInfo;
  // mảng toạ độ các hit trúng
  let arrayHitShotPos = enemyInfo.arrayHitShotPos;

  // ds tàu chưa chìm của đối thủ
  let unSunkShips = enemyInfo.unSunkShips;

  // ma trận đánh dấu HIT / MISS
  let matrix = enemyInfo.board;

  // calculate probabilities for each hit shoot and each type ship
  for (let i = 0; i < arrayHitShotPos.length; i++) {
    let hitShotPos = arrayHitShotPos[i];
    // each type ship
    for (let k = 0; k < unSunkShips.length; k++) {
      let shipInfo = unSunkShips[k];
      let arrayShipPosByType = appConfig.SHIP_MAP[shipInfo.type];
      // each ship by direct
      for (let m = 0; m < arrayShipPosByType.length; m++) {
        let arrayRelativePos = arrayShipPosByType[m];
        // choose each cell in ship is shoot pos
        for (let p = 0; p < arrayRelativePos.length; p++) {
          let arrayAbsolutePos = Utils.getAbsolutePos(arrayRelativePos, p, hitShotPos);
          let groupAbsolutePos = Utils.groupArrayPosByMatrixValue(matrix, arrayAbsolutePos, appConfig);
          if (groupAbsolutePos != null && groupAbsolutePos.arrayMissPos.length == 0 && groupAbsolutePos.arraySunkPos.length == 0) {
            let score = shipInfo.quantity * groupAbsolutePos.arrayHitPos.length;
            groupAbsolutePos.arrayEmptyPos.forEach(function (pos) {
              probabilities[pos[1]][pos[0]] += score;
            });
          }
        }
      }
    }
  }
  return probabilities;
}

// tính ma trận xác suất trong hunt mode
function calculateProbabilitiesInHuntMode(enemyInfo, appConfig) {
  // ds tàu chưa chìm của đối thủ
  let unSunkShips = enemyInfo.unSunkShips;

  // ma trận đánh dấu HIT / MISS
  let matrix = enemyInfo.board;

  let height = matrix.length;
  let width = matrix[0].length;
  let probabilities = Utils.createMatrix(width, height, 0);

  let MAXTRIX_EMPTY_VALUE = appConfig.MAXTRIX_EMPTY_VALUE;
  let IDX_START_POS = appConfig.IDX_START_POS;

  // calculate probabilities for each type ship
  for (let k = 0; k < unSunkShips.length; k++) {
    let shipInfo = unSunkShips[k];
    let arrayShipPosByType = appConfig.SHIP_MAP[shipInfo.type];

    // for all matrix
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (matrix[y][x] == MAXTRIX_EMPTY_VALUE) {
          // each ship by direct
          for (let m = 0; m < arrayShipPosByType.length; m++) {
            let arrayRelativePos = arrayShipPosByType[m];
            let arrayAbsolutePos = Utils.getAbsolutePos(arrayRelativePos, IDX_START_POS, [x, y]);
            if (Utils.checkArrayPosHaveValue(matrix, arrayAbsolutePos, MAXTRIX_EMPTY_VALUE)) {
              arrayAbsolutePos.forEach(function (pos) {
                probabilities[pos[1]][pos[0]] += shipInfo.quantity;
              });
            }
          }
        }
      }
    }
  }
  return probabilities;
}

// build bang map xac suat, giá trị xác suất => arrayPos (sort giảm dần để tìm k giá trị cho nhanh)
function buildMapProbabilities(probabilities) {
  let result = {
    arrayValue: []
  };
  let height = probabilities.length;
  let width = probabilities[0].length;
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      // giá trị xác suất
      let v = probabilities[y][x];

      // tìm mảng toạ độ dựa theo giá trị xác suất trong bảng map
      let arrayPos = result[v];

      // chưa có thì tạo mới
      if (arrayPos == null) {
        result.arrayValue.push(v);
        arrayPos = [];
        result[v] = arrayPos;
      }
      // push toạ độ vào mảng
      arrayPos.push([x, y]);
    }
  }
  result.arrayValue.sort(function (a, b) {
    return b - a;
  });
  return result;
}

function randomShoot(enemyInfo, appConfig) {
  let pos = enemyInfo.randomMatrixCell.randomPosition();
  if (pos != null) {
    enemyInfo.randomMatrixCell.delete(pos[0], pos[1]);
  }
  return pos;
}

function randomKShoots(enemyInfo, kShoots, appConfig) {
  let result = [];
  let randomMatrixCell = enemyInfo.randomMatrixCell;

  let probabilities = calculateProbabilitiesInHuntMode(enemyInfo, appConfig);
  let mapProbabilities = buildMapProbabilities(probabilities);
  console.log('========= Map probabilities hunt mode ==========');
  console.log(mapProbabilities);
  console.log('========= Map probabilities hunt mode ==========');
  let arrayProbabilityValue = mapProbabilities.arrayValue;
  for (let i = 0, k = 0; i < arrayProbabilityValue.length && k < kShoots; i++) {
    let arrayPos = mapProbabilities[arrayProbabilityValue[i]];
    for (let j = 0; j < arrayPos.length && k < kShoots; j++) {
      let pos = arrayPos[j];
      if (randomMatrixCell.contain(pos[0], pos[1])) {
        result.push(pos);
        k++;
        randomMatrixCell.delete(pos[0], pos[1]);
      }
    }
  }

  return result;
}

// shoot ở hunt mode, hunt mode: khi chưa có shoot trúng
function getShootInHuntMode(battle, turn, maxShots, appConfig) {
  return randomKShoots(battle.enemyInfo, maxShots, appConfig);
}

// shoot ở destroy mode, destroy mode: khi đã có shoot trúng
function getShootInDestroyMode(battle, turn, maxShots, appConfig) {
  let probabilities = calculateProbabilitiesInDestroyMode(battle, appConfig);
  console.log('========= probabilities destroy mode ==========');
  console.log(probabilities);
  console.log('========= probabilities destroy mode ==========');
  let pos = Utils.getBestPosition(probabilities, battle.enemyInfo.board, appConfig.MAXTRIX_EMPTY_VALUE);
  battle.enemyInfo.randomMatrixCell.delete(pos[0], pos[1]);
  return [pos];
}

module.exports = {
  shoot: function (battle, turn, maxShots, appConfig) {
    if (battle.enemyInfo.arrayHitShotPos.length > 0) {
      return getShootInDestroyMode(battle, turn, maxShots, appConfig);
    }
    return getShootInHuntMode(battle, turn, maxShots, appConfig);
  }
};
