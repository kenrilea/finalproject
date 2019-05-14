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
         return { ...state, currentLobby: action.lobbyId, inLobby: true }
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
      default:
         return state;
   }
};

export default reducer;
