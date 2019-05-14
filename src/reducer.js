const reducer = (state, action) => {
  switch (action.type) {
    case "logged-in":
      return {
        ...state,
        loggedIn: action.toggle,
        currentUser: action.username
      };
    case "SIGN-OUT":
      return { ...state, loggedIn: action.toggle, currentUser: "" };
    case "JOIN-LOBBY":
      return { ...state, currentLobby: action.lobbyId, inLobby: true };
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
    case "set-game-state":
      return {
        ...state,
        gameState: action.gameState
      };
    default:
      return state;
  }
};

export default reducer;
