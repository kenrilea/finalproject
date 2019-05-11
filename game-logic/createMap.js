let actorUtils = require(__dirname + "/actor-utils.js");
let createMap = (width, height) => {
  let newMap = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let newPos = { x: x, y: y, z: 100 };
      let newTile = actorUtils.dispatch({
        type: "create-actor",
        pos: { ...newPos },
        actorType: "defaultTile"
      });
      newMap.push(newTile);
    }
  }
  return newMap;
};
module.exports = createMap;
