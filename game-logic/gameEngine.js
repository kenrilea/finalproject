let createMap = require(__dirname + "/createMap.js");
let createArmy = require(__dirname + "/createArmy.js");
let calcs = require(__dirname + "/calcs.js");
let testArmy = [
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 0, y: 0 },
    actorType: "char",
    moveSpeed: 1
  },
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 0, y: 1 },
    actorType: "char",
    moveSpeed: 1
  }
];
let testArmyB = [
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 1, y: 0 },
    actorType: "char",
    moveSpeed: 1
  }
];

let gameInstances = {};

let editGameData = (gameId, mods) => {
  if (gameInstances[gameId] === undefined) {
    console.log("gameId: " + gameId + " does not exist");
    return;
  }
  mods.forEach(mod => {
    if (mod.type === "add-new") {
      gameInstances[gameId].push(mod.actor);
    }
    if (mod.type === "edit-existing") {
      let actorIndex = gameInstances[gameId].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      mod.edits.forEach(edit => {
        gameInstances[gameId][actorIndex][edit.prop] = edit.value;
      });
    }
    if (mod.type === "move") {
      let actorIndex = gameInstances[gameId].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      let char = gameInstances[gameId][actorIndex];

      if (calcs.isInRange(char.moveSpeed, char.pos, mod.dest)) {
        let allyTeamCollision = gameInstances[gameId].filter(actor => {
          if (actor.team === char.team) {
            if (actor.pos.x === mod.dest.x && actor.pos.y === mod.dest.y) {
              return true;
            }
          }
          return false;
        });
        gameInstances[gameId] = gameInstances[gameId].filter(actor => {
          console.log("ID: " + actor.actorId);
          if (actor.team !== char.team && actor.team !== "none") {
            console.log("A");
            if (actor.pos.x === mod.dest.x && actor.pos.y === mod.dest.y) {
              console.log("B");
              return false;
            }
            console.log("C");
          }
          console.log("D");
          return true;
        });
        if (allyTeamCollision.length < 1) {
          char.pos.x = mod.dest.x;
          char.pos.y = mod.dest.y;
        }
      }
    }
  });
};

let createGameInst = () => {
  let gameId = 0;
  do {
    gameId = Math.floor(Math.random() * 1000000);
  } while (gameInstances[gameId] !== undefined);
  gameInstances[gameId] = [];
  editGameData(gameId, createMap(1, 1));
  editGameData(gameId, createArmy(testArmy, "blue"));
  editGameData(gameId, createArmy(testArmyB, "red"));
};
let moveinput = { type: "move", actorId: "", dest: { x: 1, y: 0 } };
createGameInst();

let keys = Object.keys(gameInstances);
console.log(gameInstances[keys[0]]);
let chars = gameInstances[keys[0]].filter(actor => {
  return actor.actorType === "char";
});
moveinput.actorId = chars[0].actorId;
console.log("this actor: " + moveinput.actorId);
console.log("________________________________");
editGameData(keys[0], [moveinput]);
console.log(gameInstances[keys[0]]);
console.log("________________________________");
moveinput.dest = { x: 0, y: 1 };
editGameData(keys[0], [moveinput]);
console.log(gameInstances[keys[0]]);
