import ReactDOM from "react-dom";
import "./css/main.css";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "./store.js";
import App from "./Components/App.jsx";
import AnimatedMessage from "./Components/AnimatedMessage.jsx";
import Oops from "./Components/Oops.jsx";

let root = (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container">
        <Route exact={false} path="/" component={AnimatedMessage} />
        <Switch>
          <Route exact={true} path="/" component={App} />
          <Route
            render={props => (
              <Oops {...props} message={"This page doesn't exist."} />
            )}
          />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(root, document.getElementById("root"));
