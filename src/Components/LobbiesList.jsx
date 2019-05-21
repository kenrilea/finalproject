import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import LobbiesListElem from "./LobbiesListElem.jsx";
import socket from "./SocketSettings.jsx";
import { AnimateGroup } from "react-animate-mount";
import Spinner from "./Spinner.jsx";


class UnconnectedLobbiesList extends Component {
   constructor(props) {
      super(props);
      this.state = {
         lobbies: [],
         lobbyCount: 0,
         fullLobbies: 0
      };
   }

   componentDidMount = () => {
      socket.open();

      socket.on("lobby-list-data", data => {
         console.log("Socket: receiving data from backend: ", data);
         this.setState({
            lobbies: data.lobbies,
            lobbyCount: data.lobbyCount,
            fullLobbies: data.fullLobbies
         });
      });
      //Delay to allow for proper animation on load
      setTimeout(() => {
         socket.emit("refresh-lobby-list");
      }, 700);

      // this.getLobbies()
   };

   getLobbies = () => {
      fetch("/get-lobbies")
         .then(resHead => {
            return resHead.text();
         })
         .then(resBody => {
            let parsedLobbies = JSON.parse(resBody); // Array of all lobbies in collection
            this.setState({
               lobbies: parsedLobbies
            });
         });
   };

   getMockLobbies = () => {
      return mockLobbies;
   };

   createLobby = () => {
      let data = new FormData();
      data.append("currentUser", this.props.currentUser);

      fetch("/create-lobby", {
         method: "POST",
         body: data,
         credentials: "include"
      })
         .then(resHead => {
            return resHead.text();
         })
         .then(resBody => {
            let parsed = JSON.parse(resBody);

            if (!parsed.success) {
               console.log("Error creating lobby");
               return;
            }
            console.log("Joining the lobby!!");

            this.props.dispatch({
               type: "JOIN-LOBBY",
               lobbyId: parsed.lobbyId
            });
            socket.emit("refresh-lobby-list");
         });
   };

   renderElems = () => {
      {
         return this.state.lobbies
            .map(elem => {
               return (
                  <LobbiesListElem
                     key={elem._id}
                     lobbyId={elem._id}
                     playerOne={elem.playerOne}
                     playerTwo={elem.playerTwo}
                  />
               );
            })
            .reverse();
      }
   };

   render = () => {
      //  if (!this.props.loggedIn) {
      //    return <Redirect to="/" />;
      //  }

      if (this.props.inLobby) {
         return <Redirect to={"lobby/" + this.props.lobbyToJoinId} />;
      }

      if (this.state.lobbies === undefined || this.state.lobbies.length === 0) {
         return <Spinner />;
      }

      return (
         <div className="lobbies-list-background">
            <div className="card-container material-shadow animated-fade-in animated-grow-bounce">
               <div className="card-top-cont">
                  <h3 className="card-top-label">Lobbies</h3>
                  <label className="card-top-sub-label">
                     {" "}
                     Active: {this.state.fullLobbies} / {this.state.lobbyCount}{" "}
                  </label>
                  <button className="round-button" disabled={this.props.loggedIn ? false : true} onClick={this.createLobby}>
                     <div className="plus-symbol" >+</div>
                  </button>
               </div>
               <div className="card-scrollable-cont">
                  <AnimateGroup>{this.renderElems()}</AnimateGroup>
               </div>
            </div>
         </div>
      );
   };
}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn,
      currentUser: state.currentUser,
      currentLobby: state.currentLobby,
      inLobby: state.inLobby,
      lobbyToJoinId: state.currentLobbyId
   };
};

let LobbiesList = connect(mapStateToProps)(UnconnectedLobbiesList);

export default LobbiesList;
