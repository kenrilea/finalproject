let defaultTile = {
  id: "ID_NOT_GIVEN",
  pos: { x: -999, y: -999 },
  type: "default"
};
let defaultArmyA = [
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 1, y: 0 },
    actorType: "char",
    moveSpeed: 1
  },
  {
    charType: "pawn",
    actions: ["move"],
    static: false,
    pos: { x: 1, y: 1 },
    actorType: "char",
    moveSpeed: 1
  }
];
let defaultArmyB = [
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
let moveinput = { type: "move", actorId: "", dest: { x: 0, y: 0 } };
module.exports = { moveinput, defaultArmyA, defaultArmyB };
