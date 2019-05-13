let createMap = require(__dirname + "/createMap.js");
let createArmy = require(__dirname + "/createArmy.js");
let calcs = require(__dirname + "/calcs.js");
let data = require(__dirname + "/DATA.js");

//________________________________________________________________________________________________
let gameInstances = {};

let editGameData = (gameId, mods) => {
  if (gameInstances[gameId] === undefined) {
    console.log("gameId: " + gameId + " does not exist");
    return;
  }
  mods.forEach(mod => {
    if (mod.type === "add-new") {
      gameInstances[gameId]["map"].push(mod.actor);
    }
    if (mod.type === "edit-existing") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      mod.edits.forEach(edit => {
        gameInstances[gameId]["map"][actorIndex][edit.prop] = edit.value;
      });
    }
    if (mod.type === "move") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      let char = gameInstances[gameId]["map"][actorIndex];

      if (calcs.isInRange(char.moveSpeed, char.pos, mod.dest)) {
        let allyTeamCollision = gameInstances[gameId]["map"].filter(actor => {
          if (actor.team === char.team) {
            if (actor.pos.x === mod.dest.x && actor.pos.y === mod.dest.y) {
              return true;
            }
          }
          return false;
        });
        gameInstances[gameId]["map"] = gameInstances[gameId]["map"].filter(
          actor => {
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
          }
        );
        if (allyTeamCollision.length < 1) {
          char.pos.x = mod.dest.x;
          char.pos.y = mod.dest.y;
        }
      }
    }
  });
};
//________________________________________________________________________________________________
let addMessage = (gameId, message) => {
  gameInstances[gameId][chat].push(message);
};

//________________________________________________________________________________________________
let createGameInst = (teamA, teamB, armyA, armyB) => {
  let width = 8;
  let height = 8;
  let gameId = 0;
  do {
    gameId = Math.floor(Math.random() * 1000000);
  } while (gameInstances[gameId] !== undefined);
  gameInstances[gameId] = {
    map: [],
    turn: 0,
    players: [],
    chat: [],
    width,
    height
  };
  editGameData(gameId, createMap(width, height));
  editGameData(gameId, createArmy(armyA, teamA));
  editGameData(gameId, createArmy(armyB, teamB));
};
//________________________________________________________________________________________________
let handlerUserInput = input => {
  if (input.action.type === "move") {
    let players = gameInstance[gameId]["players"];
    console.log(players);
    console.log(
      "index: " + players[gameInstances[gameId]["turn"] % players.length]
    );
    if (
      players[gameInstances[gameId]["turn"] % players.length] === input.turn
    ) {
      editGameData(input.gameId, input.action);
      gameInstances[gameId]["turn"] = playersgameInstances[gameId]["turn"] + 1;
    }
  }
};
//________________________________________________________________________________________________
module.exports = { editGameData, addMessage, createGameInst, handlerUserInput };
