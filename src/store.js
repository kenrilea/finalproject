import { createStore } from "redux";
import reducer from "./reducer.js";

const initialState = {
  loggedIn: false,
  currentUser: "",
  message: "Welcome!"
};

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
