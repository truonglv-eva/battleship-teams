/**
 * BatteShipModel.js
 */
const Utils = require("./Utils");

// Ma trận này giúp random nhanh hơn. Nó là 1 object.
// Ví dụ: Tạo ma trận 4 x 3, x (width): 0 -> 3, y (height): 0 -> 2
// {
//   TYPE_OF_IDX_0: "WIDTH", // nghĩa là arrayIndex0 chứa toàn bộ giá trị của x
//   arrayIndex0: [0, 1, 2, 3],
//   "0": [0, 1, 2], // mỗi giá trị của x, ta có mảng các giá trị của y
//   "1": [0, 1, 2],
//   "2": [0, 1, 2],
//   "3": [0, 1, 2],
// }
// Random toạ độ: random 1 phần tử trong arrayIndex0: v1, sau đó random 1 phần tử trong mảng this[v1]: v2
// TYPE_OF_IDX_0: "WIDTH" => v1 là x, v2 là y. Nếu khác thì ngược lại, v2 là x, v1 là y.
var RandomMatrixCell = (function () {
  const WIDTH = 'WIDTH';
  const HEIGHT = 'HEIGHT';

  function RandomMatrixCell(width, height) {
    this.TYPE_OF_IDX_0 = WIDTH;
    let max = width;
    let min = height;
    if (height > width) {
      this.TYPE_OF_IDX_0 = HEIGHT;
      max = height;
      min = width;
    }
    this.arrayIndex0 = [];
    for (let i = 0; i < max; i++) {
      this.arrayIndex0.push(i);
      let arrayIndex1 = [];
      for (let j = 0; j < min; j++) {
        arrayIndex1.push(j);
      }
      this[i] = arrayIndex1;
    }
  }
  RandomMatrixCell.prototype.contain = function (x, y) {
    // x la cot (WIDTH), y la dong (HEIGHT)
    if (this.TYPE_OF_IDX_0 == WIDTH) {
      let arrayIndexY = this[x];
      if (arrayIndexY == null) {
        return false;
      }
      return arrayIndexY.indexOf(y) >= 0;
    } else {
      let arrayIndexX = this[y];
      if (arrayIndexX == null) {
        return false;
      }
      return arrayIndexX.indexOf(x) >= 0;
    }
  };

  RandomMatrixCell.prototype.delete = function (x, y) {
    // x la cot (WIDTH), y la dong (HEIGHT)
    if (this.TYPE_OF_IDX_0 == WIDTH) {
      let arrayIndexY = this[x];
      if (arrayIndexY != null) {
        let indexY = arrayIndexY.indexOf(y);
        if (indexY >= 0) {
          if (arrayIndexY.length === 1) {
            delete this[x];
            let indexX = this.arrayIndex0.indexOf(x);
            if (indexX >= 0) {
              this.arrayIndex0.splice(indexX, 1);
            }
          } else {
            arrayIndexY.splice(indexY, 1);
          }
        }
      }
    } else {
      let arrayIndexX = this[y];
      if (arrayIndexX != null) {
        let indexX = arrayIndexX.indexOf(x);
        if (indexX >= 0) {
          if (arrayIndexX.length === 1) {
            delete this[y];
            let indexY = this.arrayIndex0.indexOf(y);
            if (indexY >= 0) {
              this.arrayIndex0.splice(indexY, 1);
            }
          } else {
            arrayIndexX.splice(indexX, 1);
          }
        }
      }
    }
  };

  RandomMatrixCell.prototype.deleteAll = function (arrayPos) {
    if (arrayPos != null && arrayPos.length > 0) {
      arrayPos.forEach(function (pos) {
        this.delete(pos[0], pos[1]);
      }, this);
    }
  };

  RandomMatrixCell.prototype.randomPosition = function () {
    // x la cot (WIDTH), y la dong (HEIGHT)
    if (this.arrayIndex0.length == 0) {
      return null;
    }
    let pos0 = this.arrayIndex0[Utils.randomInt(0, this.arrayIndex0.length - 1)];
    let array1 = this[pos0];
    let pos1 = array1[Utils.randomInt(0, array1.length - 1)];
    if (this.TYPE_OF_IDX_0 == WIDTH) {
      return [pos0, pos1];
    } else {
      return [pos1, pos0];
    }
  };
  return RandomMatrixCell;
}());

var RandomMatrixCellHuntMode = (function (prototype) {
  const WIDTH = 'WIDTH';
  const HEIGHT = 'HEIGHT';

  function RandomMatrixCellHuntMode(width, height, step = 2) {
    this.TYPE_OF_IDX_0 = WIDTH;
    let max = width;
    let min = height;
    if (height > width) {
      this.TYPE_OF_IDX_0 = HEIGHT;
      max = height;
      min = width;
    }
    this.arrayIndex0 = [];
    let startJ = 0;
    for (let i = 0; i < max; i++) {
      this.arrayIndex0.push(i);
      let arrayIndex1 = [];
      for (let j = startJ; j < min; j += step) {
        arrayIndex1.push(j);
      }
      this[i] = arrayIndex1;
      startJ++;
      if (startJ >= step) {
        startJ = 0;
      }
    }
  }

  for (key in prototype) {
    RandomMatrixCellHuntMode.prototype[key] = prototype[key];
  }
  return RandomMatrixCellHuntMode;
}(RandomMatrixCell.prototype));

var EnemyInfo = /** @class */ (function () {
  function EnemyInfo(boardWidth, boardHeight, ships, mapShipsByLife, appConfig) {
    this.unSunkShips = JSON.parse(JSON.stringify(ships));
    this.sunkShips = [];
    this.board = Utils.createMatrix(boardWidth, boardHeight, appConfig.MAXTRIX_EMPTY_VALUE);
    this.arrayHitShotPos = [];
    this.arrayShots = [];
    let step = mapShipsByLife.minLifeOfShip;
    if (step >= 5) {
      step = 4;
    }
    this.randomMatrixCell = new RandomMatrixCellHuntMode(boardWidth, boardHeight, step);
  }
  return EnemyInfo;
}());

var MyInfo = /** @class */ (function () {
  function MyInfo(boardWidth, boardHeight, ships, appConfig) {
    this.unSunkShips = JSON.parse(JSON.stringify(ships));
    this.sunkShips = [];
    this.board = Utils.createMatrix(boardWidth, boardHeight, appConfig.MAXTRIX_EMPTY_VALUE);
    this.arrayShots = [];
    this.randomMatrixCellNoShip = new RandomMatrixCell(boardWidth, boardHeight);
    this.randomMatrixCellNoShipAndBorder = new RandomMatrixCell(boardWidth, boardHeight);

    this.excludePos = [
      [0, 0],
      [boardWidth - 1, 0],
      [0, boardHeight - 1],
      [boardWidth - 1, boardHeight - 1]
    ];
    this.areas = [{
      xStart: 0,
      xEnd: boardWidth - 1,
      yStart: 0,
      yEnd: boardHeight - 1
    }];
    this.randomMatrixCellNoShip.deleteAll(this.excludePos);
    this.randomMatrixCellNoShipAndBorder.deleteAll(this.excludePos);
  }
  return MyInfo;
}());

// tạo bảng map {life => [shipInfos]}, nhằm duyệt theo life.
// Vì có 2 loại tàu có life là 4 nên sẽ lưu dạng mảng
function createMapShipsByLife(ships, appConfig) {
  let map = {
    totalLifes: 0,
    totalCellIncludeBorder: 0,
    minLifeOfShip: 0,
    maxLifeOfShip: 0
  };
  ships.forEach(function (shipInfo) {
    if (shipInfo.quantity > 0) {
      // số ô của tàu
      let life = (appConfig.SHIP_MAP[shipInfo.type])[0].length;

      // mảng thông tin của tàu theo life
      let arrayShipInfosInMap = map[life];

      // chưa có trong map thì tạo mảng và thêm vào bảng map
      if (arrayShipInfosInMap == null) {
        arrayShipInfosInMap = [];
        map[life] = arrayShipInfosInMap;
      }
      arrayShipInfosInMap.push(shipInfo);
      map.totalLifes += life * shipInfo.quantity;

      let cellBorders = (appConfig.SHIP_MAP_OBJ[shipInfo.type])[0].borderPos.length;
      map.totalCellIncludeBorder += (life + cellBorders) * shipInfo.quantity;

      // tính min, max life của ship
      if (map.minLifeOfShip <= 0 || life < map.minLifeOfShip) {
        map.minLifeOfShip = life;
      }
      if (map.maxLifeOfShip <= 0 || life > map.maxLifeOfShip) {
        map.maxLifeOfShip = life;
      }
    }
  });
  return map;
}

var Battle = /** @class */ (function () {
  function Battle(sessionId, boardWidth, boardHeight, ships, appConfig) {
    this.sessionId = sessionId;
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.ships = ships;
    this.turn = 0;
    this.mapShipsByLife = createMapShipsByLife(ships, appConfig);
    // this.sunkShips = [];
    // this.arrayHitShotPos = [];
    // this.myBoard = Utils.createMatrix(this.boardWidth, this.boardHeight, appConfig.MAXTRIX_EMPTY_VALUE);
    // this.boardEnemy = Utils.createMatrix(this.boardWidth, this.boardHeight, appConfig.MAXTRIX_EMPTY_VALUE);
    // this.enemyShips = [].concat(ships);
    // this.excludePos = [[0, 0], [boardWidth - 1, 0], [0, boardHeight - 1], [boardWidth - 1, boardHeight - 1]];
    // this.areas = [
    //   {
    //     xStart: 0,
    //     xEnd: boardWidth - 1,
    //     yStart: 0,
    //     yEnd: boardHeight - 1
    //   }
    // ];
    this.calledService = '';
    // this.enemyShots = [];
    // this.ourSunkShips = [];

    this.enemyInfo = new EnemyInfo(boardWidth, boardHeight, ships, this.mapShipsByLife, appConfig);
    this.myInfo = new MyInfo(boardWidth, boardHeight, ships, appConfig);
  }
  return Battle;
}());
var BattleManager = /** @class */ (function () {
  function BattleManager() {
    this.mapBattle = {};
  }
  BattleManager.prototype.addBattle = function (battle) {
    if (battle !== null) {
      this.mapBattle[battle.sessionId] = battle;
    }
  };
  BattleManager.prototype.getBattle = function (sessionId) {
    return this.mapBattle[sessionId];
  };
  return BattleManager;
}());

module.exports = {
  Battle: Battle,
  BattleManager: BattleManager
};
