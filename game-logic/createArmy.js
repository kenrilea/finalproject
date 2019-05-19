let actorUtils = require(__dirname + "/actor-utils.js");
let data = require(__dirname + "/DATA.js");

let createArmy = (army, team, side) => {
  if (side > 0) {
    side = side - 1;
  }
  let addArmyMod = [];
  let armyTemp = army;
  army = [];
  armyTemp.forEach((armyRow, yIndex) => {
    if (side > 0) {
      yIndex = -yIndex;
    }
    armyRow.forEach((char, index) => {
      let newChar = { ...data.unitTypes[char] };
      newChar.pos = { ...newChar.pos, x: index, y: side + yIndex };
      army.push(newChar);
    });
  });
  army = army.filter(char => {
    if (char === undefined) {
      return false;
    }
    return char.charType !== undefined;
  });
  army.forEach(char => {
    let newActorMod = actorUtils.dispatch({
      type: "create-actor",
      pos: { ...char.pos }
    });
    let newCharMod = actorUtils.dispatch({
      ...char,
      team: team,
      actorId: newActorMod.actor.actorId,
      type: "change-to-char"
    });
    addArmyMod.push(newActorMod);
    addArmyMod.push(newCharMod);
  });

  console.log("army mod length: " + addArmyMod.length);
  return addArmyMod;
};

module.exports = createArmy;
