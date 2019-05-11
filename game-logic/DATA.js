let gameInstances = { DEFUALT_GAME: [] };
let defaultTile = {
  id: "ID_NOT_GIVEN",
  pos: { x: -999, y: -999 },
  type: "default"
};
let army = [
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 0, y: 0 },
    actorType: "char"
  },
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 1, y: 0 },
    actorType: "char"
  },
  {
    charType: "pawn",
    actions: ["pawn"],
    static: false,
    pos: { x: 2, y: 1 },
    actorType: "char"
  }
];

let moveinput = { type: "move", actorId: "", dest: { x: 0, y: 0 } };

let getDataByPos = (gameId, pos) => {
  gameInstances[gameId].filter(actor => {
    return actor.myPos.x === pos.x && actor.myPos.y === pos.y;
  });
};
let getDataById = (gameId, actorId) => {
  let foundActor = gameInstances[gameId].findIndex(actor => {
    return actor.actorId === actorId;
  });
  return foundActor;
};
module.exports = { getDataByPos, getDataById };
