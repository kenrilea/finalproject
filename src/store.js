import { createStore } from "redux";
import reducer from "./reducer.js";

const initialState = {
  loggedIn: false,
  currentUser: "",
  currentLobby: "",
  message: "Welcome!",
  actionMenu: {
    visible: false,
    xPos: 0,
    yPos: 0,
    options: []
  },
  gameData: {
    actors: [],
    width: 0,
    height: 0
  }
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
