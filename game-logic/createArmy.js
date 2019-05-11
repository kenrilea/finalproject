let actorUtils = require(__dirname + "/actor-utils.js");

let createArmy = (army, team) => {
  let addArmyMod = [];
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
  return addArmyMod;
};

module.exports = createArmy;
