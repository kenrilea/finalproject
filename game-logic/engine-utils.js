let findActor = (findId, gameInstance) => {
  let actorIndex = gameInstance["map"].findIndex(actor => {
    return actor.actorId === findId;
  });
  let char = gameInstance["map"][actorIndex];
  return char;
};
//_________________________________________________________
let teamCollision = (checkPos, team, gameInstance) => {
  let allyTeamCollision = gameInstance["map"].filter(actor => {
    if (actor.team === team) {
      if (actor.pos.x === checkPos.x && actor.pos.y === checkPos.y) {
        return true;
      }
    }
    return false;
  });
  return allyTeamCollision;
};
//_________________________________________________________
let attackCollision = (checkPos, team, gameInstance) => {
  let collisions = gameInstance["map"].filter(actor => {
    if (actor.team === !team && actor.team !== "none") {
      if (actor.pos.x === checkPos.x && actor.pos.y === checkPos.y) {
        return true;
      }
    }
    return false;
  });
  return collisions;
};
//_________________________________________________________
module.exports = { findActor, teamCollision };
