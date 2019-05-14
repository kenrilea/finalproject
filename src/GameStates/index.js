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

export const selectTile = unitInAction => {
  return {
    type: STATES.SELECT_TILE,
    unitInAction
  };
};

export const showAnimations = () => {
  return {
    type: STATES.SHOW_ANIMATIONS
  };
};

export const opponentTurn = () => {
  return {
    type: STATES.OPPONENT_TURN
  };
};
