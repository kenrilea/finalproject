import ReactDOM from "react-dom";
import "./css/main.css";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import store from "./store.js";
import HomePage from "./Components/HomePage.jsx";
import GameFrame from "./Components/Game/GameFrame.jsx";
import AnimatedMessage from "./Components/AnimatedMessage.jsx";
import Oops from "./Components/Oops.jsx";
import TopBar from "./Components/TopBar.jsx";
import SideBar from "./Components/SideBar.jsx";
import Leaderboard from "./Components/Leaderboard.jsx";
import Signup from "./Components/Signup.jsx";
import LobbiesList from "./Components/LobbiesList.jsx";
import AutoLogin from "./components/AutoLogin.jsx";
import Lobby from "./components/Lobby.jsx";
import About from "./components/About.jsx";
import ProfileForm from "./components/ProfileForm.jsx";

import CloudsBG from "./components/CloudsBG.jsx"

let root = (
   <Provider store={store}>
      <BrowserRouter>
         <div className="main-container">
            <CloudsBG />
            <Route exact={false} path="/" component={AutoLogin} />
            <Route exact={false} path="/" component={AnimatedMessage} />
            <TopBar />
            <div className="sidebar-and-game-container">
               <SideBar />
               <div className="main-div">
                  <Switch>
                     <Route exact={true} path="/" component={HomePage} />
                     <Route exact={true} path="/game/:gameId" component={GameFrame} />
                     <Route exact={true} path="/leaderboard" component={Leaderboard} />
                     <Route exact={true} path="/signup" component={Signup} />
                     <Route
                        exact={true}
                        path="/lobbies_list"
                        component={LobbiesList}
                     />
                     <Route exact={true} path="/lobby/:lobbyId" component={Lobby} />
                     <Route exact={true} path="/about" component={About} />
                     <Route
                        exact={true}
                        path="/edit-profile"
                        component={ProfileForm}
                     />
                     <Route
                        render={props => (
                           <Oops {...props} message={"This page doesn't exist... yet"} />
                        )}
                     />
                  </Switch>
               </div>
            </div>
            {/* Google Fonts imports */}
            <link
               href="https://fonts.googleapis.com/css?family=Merriweather"
               rel="stylesheet"
            />
            <link
               href="https://fonts.googleapis.com/css?family=Rubik"
               rel="stylesheet"
            />
         </div>
      </BrowserRouter>
   </Provider>
);

ReactDOM.render(root, document.getElementById("root"));
