export const setActionMenu = (visible, xPos, yPos, options) => {
  return {
    type: "set-action-menu",
    visible,
    xPos,
    yPos,
    options
  };
};

export const setGameData = data => {
  return {
    type: "set-game-data",
    data
  };
};

export const setGameState = gameState => {
  return {
    type: "set-game-state",
    gameState
  };
};
