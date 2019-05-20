let createMap = require(__dirname + "/createMap.js");
let createArmy = require(__dirname + "/createArmy.js");
let calcs = require(__dirname + "/calcs.js");
let data = require(__dirname + "/DATA.js");
let utils = require(__dirname + "/engine-utils.js");
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
  console.log("editing game data");
  let gameTurn =
    gameInstances[gameId]["players"][
      parseInt(gameInstances[gameId]["turn"]) %
        gameInstances[gameId]["players"].length
    ];
  console.log("players turn: " + gameTurn);
  let changes = [];
  if (gameInstances[gameId]["playerWon"] !== undefined) {
    changes = changes.concat([
      { type: "game-over", winner: gameInstances[gameId]["playerWon"] }
    ]);
    return changes;
  }
  if (gameInstances[gameId] === undefined) {
    console.log("gameId: " + gameId + " does not exist");
    return changes;
  }
  //_________________________________________________________
  ///////////////////////////////////////////////////////////
  //_________________________________________________________
  mods.forEach(mod => {
    if (mod.type === "add-new") {
      gameInstances[gameId]["map"].push(mod.actor);
    }
    //_________________________________________________________
    if (mod.type === "edit-existing") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      mod.edits.forEach(edit => {
        gameInstances[gameId]["map"][actorIndex][edit.prop] = edit.value;
      });
    }
    //_________________________________________________________
    if (mod.type === "move") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      let char = gameInstances[gameId]["map"][actorIndex];
      if (char.team === gameTurn) {
        if (char.actions.includes("move")) {
          if (calcs.isInRange(char.moveSpeed, char.pos, mod.dest)) {
            let allyTeamCollision = gameInstances[gameId]["map"].filter(
              actor => {
                if (actor.team === char.team) {
                  if (
                    actor.pos.x === mod.dest.x &&
                    actor.pos.y === mod.dest.y
                  ) {
                    return true;
                  }
                }
                return false;
              }
            );
            let collidedWithEnemy = false;
            let diedChanges = [];
            gameInstances[gameId]["map"] = gameInstances[gameId]["map"].filter(
              actor => {
                if (actor.team !== char.team && actor.team !== "none") {
                  if (
                    actor.pos.x === mod.dest.x &&
                    actor.pos.y === mod.dest.y
                  ) {
                    if (char.charType === "legionary") {
                      collidedWithEnemy = true;
                    }
                    diedChanges.push({ type: "died", actorId: actor.actorId });
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
            if (collidedWithEnemy) {
              changes.push({ type: "died", actorId: char.actorId });
              gameInstances[gameId]["map"] = gameInstances[gameId][
                "map"
              ].filter(actor => {
                return actor.actorId !== char.actorId;
              });
            }
            changes = changes.concat(diedChanges);
          }
        }
      }
    }
    //_________________________________________________________
    if (mod.type === "move-passive") {
      let actorIndex = gameInstances[gameId]["map"].findIndex(actor => {
        return actor.actorId === mod.actorId;
      });
      let char = gameInstances[gameId]["map"][actorIndex];
      if (char.team === gameTurn) {
        if (char.actions.includes("move-passive")) {
          if (calcs.isInRange(char.moveSpeed, char.pos, mod.dest)) {
            let allyTeamCollision = gameInstances[gameId]["map"].filter(
              actor => {
                if (actor.team !== "none") {
                  if (
                    actor.pos.x === mod.dest.x &&
                    actor.pos.y === mod.dest.y
                  ) {
                    return true;
                  }
                }
                return false;
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
    }
    //_________________________________________________________
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
                    changes = changes.concat({
                      ...mod,
                      target: { ...arrowPos }
                    });
                    if (actor.charType === "legionary") {
                      changes = changes.concat({
                        type: "block-arrow",
                        actorId: actor.actorId
                      });
                      return true;
                    }
                    changes.push({ type: "died", actorId: actor.actorId });
                    return false;
                  }
                }
                return true;
              });
            }
            if (stopArrow === false) {
              let modtemp = { ...mod, target: undefined };
              changes = changes.concat(modtemp);
            }
          }
        }
      }
    }
    //_________________________________________________________
    if (mod.type === "charge") {
      let char = utils.findActor(mod.actorId, gameInstances[gameId]);
      if (char.team === gameTurn) {
        if (char.actions.includes("charge")) {
          if (calcs.lineRange(char.range, char.pos, mod.dest)) {
            if (
              utils.teamCollision(mod.dest, char.team, gameInstances[gameId])
                .length <= 0
            ) {
              if (calcs.lineTarget(char.range, char.pos, mod.dest)) {
                changes.push(mod);
                for (let i = 0; i < char.range; i++) {
                  let stepLine = calcs.lineMove(char.range, char.pos, mod.dest);
                  char.pos.x = char.pos.x + stepLine.x;
                  char.pos.y = char.pos.y + stepLine.y;

                  gameInstances[gameId]["map"] = gameInstances[gameId][
                    "map"
                  ].filter(actor => {
                    if (actor.team !== char.team && actor.team !== "none") {
                      if (
                        actor.pos.x === char.pos.x &&
                        actor.pos.y === char.pos.y
                      ) {
                        gameInstances[gameId]["points"][char.team] =
                          gameInstances[gameId]["points"][char.team] +
                          actor.points;
                        changes.push({ type: "died", actorId: actor.actorId });
                        return false;
                      }
                    }
                    return true;
                  });
                }
              }
            }
          }
        }
      }
    }
    //_________________________________________________________
    if (mod.type === "bombard") {
      let char = utils.findActor(mod.actorId, gameInstances[gameId]);
      if (char.team === gameTurn) {
        if (char.actions.includes("bombard")) {
          if (
            calcs.isInRange(char.range, char.pos, mod.target) &&
            !calcs.isInRange(1, char.pos, mod.target)
          ) {
            changes.push(mod);
            gameInstances[gameId]["map"] = gameInstances[gameId]["map"].filter(
              actor => {
                if (actor.team !== char.team && actor.team !== "none") {
                  if (
                    actor.pos.x === mod.target.x &&
                    actor.pos.y === mod.target.y
                  ) {
                    changes.push({ type: "died", actorId: actor.actorId });
                    gameInstances[gameId]["points"][char.team] =
                      gameInstances[gameId]["points"][char.team] + actor.points;
                    return false;
                  }
                }

                return true;
              }
            );
          }
        }
      }
    }
    //_________________________________________________________
  });
  return changes;
};
//________________________________________________________________________________________________
let addMessage = (gameId, message) => {
  gameInstances[gameId][chat].push(message);
};

//________________________________________________________________________________________________

let createGameInst = (teamA, teamB, armyA, armyB, gameId) => {
  let width = 8;
  let height = 8;
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
  editGameData(gameId, createArmy(armyA, teamA, 0));
  editGameData(gameId, createArmy(armyB, teamB, height));
  return gameId;
};
let createTestGameInst = (teamA, teamB, armyA, armyB) => {
  let width = 8;
  let height = 8;
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
  console.log(input.action);
  let changes = [];
  let success = true;
  if (input.action === undefined) {
    return { changes, successs: false };
  }
  if (gameInstances[input.gameId] === undefined) {
    return { changes, successs: false };
  }
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
  if (input.action.type === "move-passive") {
    if (gameTurn === input.team) {
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "ranged-shot") {
    if (gameTurn === input.team) {
      input.action.target = input.action.dest;
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "charge") {
    if (gameTurn === input.team) {
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "bombard") {
    if (gameTurn === input.team) {
      input.action.target = input.action.dest;
      changes = changes.concat(editGameData(input.gameId, [input.action]));
    }
  }
  if (input.action.type === "leave") {
    let winner = endGame(input.gameId, input.team);
    changes = changes.concat({ type: "game-over", winner: winner });
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
