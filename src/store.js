import { createStore } from "redux";

let reducer = (state, action) => {
  switch (action.type) {
    case "logged-in":
      return { ...state, loggedIn: action.toggle, username: action.username };
    case "show-message":
      return { ...state, message: action.message };
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  {
    loggedIn: false,
    username: "",
    message: "Welcome!"
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
