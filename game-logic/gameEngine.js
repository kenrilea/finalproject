let createMap = require(__dirname + "/createMap.js");
let createArmy = require(__dirname + "/createArmy.js");
let calcs = require(__dirname + "/calcs.js");
let data = require(__dirname + "/DATA.js");

//________________________________________________________________________________________________
let gameInstances = {};
let endGame = (gameId, team) => {
  gameInstances[gameId]["points"][team] =
    gameInstances[gameId]["points"][team] - 50;

  let winner = undefined;
  let winnerPoints = undefined;
  gameInstances[gameId]["players"].forEach(player => {
    if (winnerPoints === undefined) {
      winner = player;
      winnerPoints = gameInstances[gameId]["points"][player];

      return;
    }
    if (gameInstances[gameId]["points"][player] > winnerPoints) {
      winner = player;
      winnerPoints = gameInstances[gameId]["points"][player];

      return;
    }
    if (gameInstances[gameId]["points"][player] === winnerPoints) {
      winner = undefined;
      winnerPoints = gameInstances[gameId]["points"][player];

      return;
    }
  });

  gameInstances[gameId]["playerWon"] = winner;
  return winner;
};
let editGameData = (gameId, mods) => {
  let gameTurn =
    gameInstances[gameId]["players"][
      parseInt(gameInstances[gameId]["turn"]) %
        gameInstances[gameId]["players"].length
    ];
  console.log(gameTurn);
  let changes = [];
  if (gameInstances[gameId]["playerWon"] !== undefined) {
    changes = changes.concat([
      { type: "game over", winner: gameInstances[gameId]["playerWon"] }
    ]);
    return changes;
  }
  if (gameInstances[gameId] === undefined) {
    console.log("gameId: " + gameId + " does not exist");
    return changes;
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
      console.log(char.team);
      if (char.team === gameTurn) {
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
              if (actor.team !== char.team && actor.team !== "none") {
                if (actor.pos.x === mod.dest.x && actor.pos.y === mod.dest.y) {
                  changes.push({ type: "died", actorId: actor.actorId });
                  gameInstances[gameId]["points"][char.team] =
                    gameInstances[gameId]["points"][char.team] + actor.points;
                  return false;
                }
              }

              return true;
            }
          );
          if (allyTeamCollision.length < 1) {
            changes.push(mod);
            char.pos.x = mod.dest.x;
            char.pos.y = mod.dest.y;
          }
        }
      }
    }
    if (mod.type === "ranged-shot") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      let char = gameInstances[gameId]["map"][actorIndex];
      if (char.team === gameTurn) {
        if (char.actions.includes("ranged-shot")) {
          if (calcs.lineRange(char.range, char.pos, mod.target)) {
            let arrowPos = { ...char.pos };
            let stopArrow = false;
            console.log("target");
            console.log(mod.target);
            for (let i = 0; i < char.range; i++) {
              let stepLine = calcs.lineMove(char.range, char.pos, mod.target);
              arrowPos.x = arrowPos.x + stepLine.x;
              arrowPos.y = arrowPos.y + stepLine.y;

              gameInstances[gameId]["map"] = gameInstances[gameId][
                "map"
              ].filter(actor => {
                if (stopArrow) {
                  return true;
                }
                if (actor.team !== char.team && actor.team !== "none") {
                  if (
                    actor.pos.x === arrowPos.x &&
                    actor.pos.y === arrowPos.y
                  ) {
                    gameInstances[gameId]["points"][char.team] =
                      gameInstances[gameId]["points"][char.team] + actor.points;
                    stopArrow = true;
                    console.log("setting end");
                    changes = changes.concat({
                      ...mod,
                      target: { ...arrowPos }
                    });
                    changes.push({ type: "died", actorId: actor.actorId });
                    return false;
                  }
                }

                return true;
              });
            }
            if (stopArrow === false) {
              changes = changes.concat(mod);
            }
          }
        }
      }
    }
  });

  return changes;
};
//________________________________________________________________________________________________
let addMessage = (gameId, message) => {
  gameInstances[gameId][chat].push(message);
};

//________________________________________________________________________________________________

let createGameInst = (teamA, teamB, armyA, armyB) => {
  let width = 5;
  let height = 5;
  let gameId = 0;
  let points = {};
  points[teamA] = 0;
  points[teamB] = 0;
  do {
    gameId = Math.floor(Math.random() * 1000000);
  } while (gameInstances[gameId] !== undefined);
  gameInstances[gameId] = {
    map: [],
    turn: 0,
    players: [teamA, teamB],
    chat: [],
    width,
    height,
    playerWon: undefined,
    points: points
  };
  editGameData(gameId, createMap(width, height));
  editGameData(gameId, createArmy(armyA, teamA, 1));
  editGameData(gameId, createArmy(armyB, teamB, 2));
  return gameId;
};
let createTestGameInst = (teamA, teamB, armyA, armyB) => {
  let width = 5;
  let height = 5;
  let gameId = "test";
  let points = {};
  points[teamA] = 0;
  points[teamB] = 0;
  gameInstances[gameId] = {
    map: [],
    turn: 0,
    players: [teamA, teamB],
    chat: [],
    width,
    height,
    playerWon: undefined,
    points: points
  };
  editGameData(gameId, createMap(width, height));
  editGameData(gameId, createArmy(armyA, teamA, 1));
  editGameData(gameId, createArmy(armyB, teamB, 2));
  return gameId;
};
//________________________________________________________________________________________________
let handlerUserInput = input => {
  let changes = [];
  let success = true;

  let players = gameInstances[input.gameId]["players"];
  let gameTurn =
    players[parseInt(gameInstances[input.gameId]["turn"]) % players.length];
  console.log("playerTurn: ", gameTurn);
  if (input.action.type === "move") {
    console.log("moving actor");
    if (gameTurn === input.team) {
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "ranged-shot") {
    if (gameTurn === input.team) {
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "leave") {
    let winner = endGame(input.gameId, input.team);
    changes = changes.concat({ type: "game over", winner: winner });
  }
  if (changes.length > 0) {
    gameInstances[input.gameId]["turn"] =
      parseInt(gameInstances[input.gameId]["turn"]) + 1;
  }
  if (changes.length < 1) {
    success = false;
  }
  return { changes, success };
};

let getGameInst = gameId => {
  return gameInstances[gameId];
};
//________________________________________________________________________________________________
module.exports = {
  editGameData,
  addMessage,
  createGameInst,
  handlerUserInput,
  createTestGameInst,
  getGameInst
};
