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
    default:
      return state;
  }
};

export default reducer;
