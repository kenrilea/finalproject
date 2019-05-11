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
import TopBar from "./Components/TopBar.jsx";
import SideBar from "./Components/SideBar.jsx"
import Leaderboard from "./Components/Leaderboard.jsx";

let root = (
   <Provider store={store}>
      <BrowserRouter>
         <div className="container">
            <Route exact={false} path="/" component={AnimatedMessage} />
            <TopBar />
            <div className="game-chat-container">
               <SideBar />
               <div className="main-div">
                  <Switch>
                     <Route exact={true} path="/" component={App} />
                     <Route exact={true} path="/game/:gameId" component={GameFrame} />
                     <Route exact={true} path="/leaderboard" component={Leaderboard} />
                     <Route
                        render={props => (
                           <Oops {...props} message={"This page doesn't exist... yet"} />
                        )}
                     />
                  </Switch>
               </div>
            </div>
            {/* Google Fonts imports */}
            <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/css?family=Rubik" rel="stylesheet"></link>
         </div>
      </BrowserRouter>
   </Provider>
);

ReactDOM.render(root, document.getElementById("root"));
