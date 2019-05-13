export const fadeColor = e => {
  return {
    type: "FADE_COLOR",
    e
  };
};

export const switchColor = () => {
  return {
    type: "SWITCH_COLOR"
  };
};

export const run = () => {
  return {
    type: "RUN"
  };
};

export const update = timestamp => {
  return {
    type: "UPDATE",
    timestamp
  };
};

export const setActionMenu = (visible, xPos, yPos, options) => {
  return {
    type: "set-action-menu",
    visible,
    xPos,
    yPos,
    options
  };
};
