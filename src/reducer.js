import {
   switchColor,
   fadeColor,
   updatePosition
} from "./ThreeApp/threeActionHelpers.js";

const reducer = (state, action) => {
   switch (action.type) {
      case "logged-in":
         return { ...state, loggedIn: action.toggle, currentUser: action.currentUser };
      case "SIGN-OUT":
         return { ...state, loggedIn: action.toggle, currentUser: "" }
      case "show-message":
         return { ...state, message: action.message };
      case "FADE_COLOR": {
         const newState = fadeColor(state, action.e);
         return {
            ...newState,
            lastAction: "FADE_COLOR"
         };
      }
      case "SWITCH_COLOR": {
         const newState = switchColor(state);
         return {
            ...newState,
            lastAction: "SWITCH_COLOR"
         };
      }
      case "RUN":
         return {
            ...state,
            gameRunning: true,
            lastAction: "RUN"
         };
      case "UPDATE": {
         const newState = {
            ...state,
            timestamp: action.timestamp,
            lastAction: "UPDATE"
         };
         return updatePosition(newState);
      }
      default:
         return state;
   }
};

export default reducer;
