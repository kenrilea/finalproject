const reducer = (state, action) => {
  switch (action.type) {
    case "logged-in":
      return {
        ...state,
        loggedIn: action.toggle,
        currentUser: action.currentUser
      };
    case "SIGN-OUT":
      return { ...state, loggedIn: action.toggle, currentUser: "" };
    case "show-message":
      return { ...state, message: action.message };
    case "set-action-menu":
      return {
        ...state,
        actionMenu: {
          visible: action.visible,
          xPos: action.xPos,
          yPos: action.yPos,
          options: action.options
        }
      };
    case "set-game-data":
      return {
        ...state,
        gameData: {
          actors: action.actors,
          width: action.width,
          height: action.height
        }
      };
    default:
      return state;
  }
};

export default reducer;
