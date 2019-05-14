export const setActionMenu = (visible, xPos, yPos, options) => {
  return {
    type: "set-action-menu",
    visible,
    xPos,
    yPos,
    options
  };
};

export const setGameData = (actors, width, height) => {
  return {
    type: "set-game-data",
    actors,
    width,
    height
  };
};

export const setGameState = gameState => {
  return {
    type: "set-game-state",
    gameState
  };
};
