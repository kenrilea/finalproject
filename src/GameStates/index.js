export const STATES = {
  SELECT_UNIT: "select-unit",
  SELECT_TILE: "select-tile",
  SHOW_ANIMATIONS: "show-animations",
  OPPONENT_TURN: "opponent-turn"
};

export const selectUnit = () => {
  return {
    type: STATES.SELECT_UNIT
  };
};

export const selectTile = (unitInAction, actionType) => {
  return {
    type: STATES.SELECT_TILE,
    unitInAction,
    actionType
  };
};

export const updateAnimations = actionList => {
  return {
    type: STATES.SHOW_ANIMATIONS,
    actionList
  };
};

export const opponentTurn = () => {
  return {
    type: STATES.OPPONENT_TURN
  };
};
