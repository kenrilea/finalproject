import ReactDOM from "react-dom";
import "./css/main.css";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "./store.js";
import App from "./Components/App.jsx";
import GameFrame from "./Components/Game/GameFrame.jsx";
import AnimatedMessage from "./Components/AnimatedMessage.jsx";
import Oops from "./Components/Oops.jsx";

let root = (
  <Provider store={store}>
    <BrowserRouter>
      <div className="container">
        <Route exact={false} path="/" component={AnimatedMessage} />
        <div className="topbar" />
        <div className="game-chat-container">
          <Switch>
            <Route exact={true} path="/" component={App} />
            <Route exact={true} path="/game/:gameId" component={GameFrame} />
            <Route
              render={props => (
                <Oops {...props} message={"This page doesn't exist."} />
              )}
            />
          </Switch>
          <div className="friends" />
        </div>
      </div>
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(root, document.getElementById("root"));
