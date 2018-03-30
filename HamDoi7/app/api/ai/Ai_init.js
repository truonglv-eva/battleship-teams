/**
 * Ai_init.js
 */
const Utils = require("./Utils");
const maxTryBorder = 100;
const maxTryNoBorder = 9999;

// // random toạ độ, bỏ 4 góc toạ độ
// function randomPosition(area, excludePos) {
//   let p = Utils.getRandomPositionInRange(area.xStart, area.xEnd, area.yStart, area.yEnd);
//   while (excludePos.findIndex(function (pos, index, array) {
//     return p[0] === pos[0] && p[1] === pos[1];
//   }) >= 0) {
//     p = Utils.getRandomPositionInRange(area.xStart, area.xEnd, area.yStart, area.yEnd);
//   }
//   return p;
// }

// random vị trí tuyệt đối của tàu, có check thêm biên nếu checkBorder = true
function randomAbsolutePosForShip(arrayRelativePos, appConfig, matrix, randomMatrixCell, checkBorder, maxTry) {
  let shipValue = appConfig.MAXTRIX_SHIP_VALUE;
  let borderValue = appConfig.MAXTRIX_BORDER_VALUE;
  let count = 0;
  let startPos = randomMatrixCell.randomPosition();
  if (startPos == null) {
    return null;
  }
  let arrayAbsolutePos = Utils.getAbsolutePos(
    arrayRelativePos,
    appConfig.IDX_START_POS,
    startPos
  );
  while (!Utils.checkArrayPos(matrix, arrayAbsolutePos, shipValue) &&
    (!checkBorder || !Utils.checkArrayPos(matrix, arrayAbsolutePos, borderValue)) &&
    count < maxTry
  ) {
    startPos = randomMatrixCell.randomPosition();
    if (startPos == null) {
      return null;
    }
    arrayAbsolutePos = Utils.getAbsolutePos(
      arrayRelativePos,
      appConfig.IDX_START_POS,
      startPos
    );
    count++;
  }
  if (count >= maxTry) {
    return null;
  }
  return arrayAbsolutePos;
}

// random tàu theo shipInfo
function randomPlaceShip(myInfo, shipInfo, appConfig) {
  let direction = Utils.randomInt(1, 100) % 2;
  let result = randomPlaceShipByDirection(myInfo, shipInfo, appConfig, direction);
  if (result == null) {
    result = randomPlaceShipByDirection(myInfo, shipInfo, appConfig, direction == 0 ? 1 : 0);
  }
  return result;
}

// random tàu theo huong
function randomPlaceShipByDirection(myInfo, shipInfo, appConfig, direction) {
  // từ loại tàu lấy được ds mảng toạ độ của tàu (gồm 2 hướng)
  let arrayShipPosByType = appConfig.SHIP_MAP[shipInfo.type];

  // lấy toạ độ tương đối cua tàu theo hướng
  let arrayRelativePos = arrayShipPosByType[direction];

  // loại tàu & hướng => lấy thông tin của tàu (width, height, toạ độ tương đối biên)
  let shipObj = (appConfig.SHIP_MAP_OBJ[shipInfo.type])[direction];
  // toạ độ tương đối biên
  let arrayBorderPos = shipObj.borderPos;

  // bản đồ lưu vị trí tàu (-2) & vị trí biên (-3)
  let matrix = myInfo.board;
  let height = matrix.length;
  let width = matrix[0].length;

  // random toạ độ tuyệt đối của tàu, có kiểm tra biên (tàu không chạm nhau)
  let arrayAbsolutePos = randomAbsolutePosForShip(arrayRelativePos, appConfig, matrix, myInfo.randomMatrixCellNoShipAndBorder, true, maxTryBorder);
  if (arrayAbsolutePos == null) {
    // random toạ độ tuyệt đối của tàu, cho phép chạm nhau
    arrayAbsolutePos = randomAbsolutePosForShip(arrayRelativePos, appConfig, matrix, myInfo.randomMatrixCellNoShip, false, maxTryNoBorder);
  }
  if (arrayAbsolutePos == null) {
    // không random được toạ độ
    return null;
  }

  let shipValue = appConfig.MAXTRIX_SHIP_VALUE;
  console.log('========= Ship position ==========');
  console.log(arrayAbsolutePos);
  arrayAbsolutePos.forEach(function (posOnBoard) {
    // đánh dấu toạ độ tuyệt đối của tàu lên bản đồ
    matrix[posOnBoard[1]][posOnBoard[0]] = shipValue;

    // xoá các toạ độ của tàu trong ma trận random (ma trận này giúp random nhanh hơn)
    myInfo.randomMatrixCellNoShipAndBorder.delete(posOnBoard[0], posOnBoard[1]);
    myInfo.randomMatrixCellNoShip.delete(posOnBoard[0], posOnBoard[1]);
  });

  // tính toạ độ tuyệt đối của biên
  let borderValue = appConfig.MAXTRIX_BORDER_VALUE;
  let arrayAbsoluteBorderPos = Utils.getAbsolutePosFromCenterPos(
    arrayBorderPos,
    arrayRelativePos[appConfig.IDX_START_POS],
    arrayAbsolutePos[appConfig.IDX_START_POS]
  );
  console.log('========= Ship border position ==========');
  console.log(arrayAbsoluteBorderPos);
  arrayAbsoluteBorderPos.forEach(function (posOnBoard) {
    // đánh dấu toạ độ tuyệt đối của biên lên bản đồ
    // xoá các toạ độ trong ma trận random (ma trận này giúp random nhanh hơn)
    if (posOnBoard[0] >= 0 && posOnBoard[0] < width && posOnBoard[1] >= 0 && posOnBoard[1] < height) {
      if (matrix[posOnBoard[1]][posOnBoard[0]] == appConfig.MAXTRIX_EMPTY_VALUE) {
        matrix[posOnBoard[1]][posOnBoard[0]] = borderValue;
        myInfo.randomMatrixCellNoShipAndBorder.delete(posOnBoard[0], posOnBoard[1]);
      }
    }
  });
  console.log('========= Updated matrix ==========');
  console.log(matrix);
  return {
    coordinates: arrayAbsolutePos
  };
}

function randomPlaceShips(myInfo, mapShipsByLife, appConfig) {
  // kết quả trả về
  let resultShips = [];

  // lưu lại totalLifes = tổng số ô tàu
  myInfo.totalLifes = mapShipsByLife.totalLifes;

  // Duyet danh sach tau can random
  for (let k = appConfig.MAX_LIFE; k >= appConfig.MIN_LIFE; k--) {
    if (mapShipsByLife[k] != null) {
      mapShipsByLife[k].forEach(function (shipInfo) {
        // Duyet so luong tau
        for (let m = 0; m < shipInfo.quantity; m++) {
          let shipObj = randomPlaceShip(myInfo, shipInfo, appConfig);
          if (shipObj != null) {
            shipObj["type"] = shipInfo.type;
            resultShips.push(shipObj);
          } else {
            console.log("Can not random type ship: " + shipInfo.type);
          }
        }
      });
    }
  }
  return resultShips;
}

module.exports = {
  placeShips: function (battle, appConfig) {
    return randomPlaceShips(battle.myInfo, battle.mapShipsByLife, appConfig);
  }
};
