import { createStore } from "redux";
import reducer from "./reducer.js";
import { getInitialSceneState } from "./ThreeApp/threeApp.js";

const initialSceneState = getInitialSceneState();

const initialState = {
  loggedIn: false,
  username: "",
  message: "Welcome!",
  gameRunning: true,
  timestamp: 0,
  lastAction: "",
  scene: initialSceneState
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
