let defaultTile = {
  id: "ID_NOT_GIVEN",
  pos: { x: -999, y: -999 },
  type: "default"
};
let defaultArmyA = [
  {
    charType: "pawn",
    actions: ["move", "attack"],
    static: false,
    pos: { x: 7, y: 0 },
    actorType: "char",
    health: 100,
    moveSpeed: 1
  },
  {
    charType: "pawn",
    actions: ["move", "attack"],
    static: false,
    pos: { x: 7, y: 7 },
    actorType: "char",
    health: 100,
    moveSpeed: 1
  }
];
let defaultArmyB = [
  {
    charType: "pawn",
    actions: ["move", "attack"],
    static: false,
    pos: { x: 0, y: 0 },
    actorType: "char",
    health: 100,
    moveSpeed: 1
  },
  {
    charType: "pawn",
    actions: ["move", "attack"],
    static: false,
    pos: { x: 0, y: 7 },
    actorType: "char",
    health: 100,
    moveSpeed: 1
  }
];
let attacks = { attack: { range: 1, damage: 50 } };
let moveinput = { type: "move", actorId: "", dest: { x: 0, y: 0 } };
module.exports = { moveinput, defaultArmyA, defaultArmyB };
