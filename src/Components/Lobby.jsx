import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import socket from "./SocketSettings.jsx"

import "../css/lobby.css";

class UnconnectedLobby extends Component {

   constructor(props) {
      super(props);
      this.state = {
         readyOne: false,
         readyTwo: false,
         playerOne: "",
         playerTwo: ""
      };
   }

   componentDidMount = () => {
      socket.open()

      socket.on("setStatePlayerOneReady", () => {
         console.log("Setting state for readyOne to true !!!")
         this.setState({ readyOne: true })
      })
      socket.on("setStatePlayerTwoReady", () => {
         console.log("Setting state for readyTwo to true !!!")
         this.setState({ readyTwo: true })
      })

      this.getCurrentLobby()
   }


   getCurrentLobby = () => {

      let data = new FormData()
      data.append("currentLobbyId", this.props.currentLobbyId)

      fetch("/get-current-lobby", {
         method: "POST",
         body: data,
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {

            let parsed = JSON.parse(resBody)

            this.setState({
               playerOne: parsed.playerOne,
               playerTwo: parsed.playerTwo,
            })
         })
   }

   renderReadyOne = () => {
      if (this.state.readyOne === false) {
         return "not ready";
      }
      return "ready";
   };
   renderReadyTwo = () => {
      if (this.state.readyTwo === false) {
         return "not ready";
      }
      return "ready";
   };
   handlerReadyButtonOne = () => {
      // this.setState({ readyOne: !this.state.readyOne });
      socket.emit("playerOneReady")
   };
   handlerReadyButtonTwo = () => {
      // this.setState({ readyTwo: !this.state.readyTwo });
      socket.emit("playerTwoReady")
   };
   renderReadyButtonOne = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.username === this.state.playerOne) {
         if (this.state.readyOne === true) {
            buttonClass = "lobbyButtonReady";
         }
         if (this.state.readyOne === false) {
            buttonClass = "lobbyButtonNotReady";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButtonOne}>
               Ready
            </button>
         );
      }
   };
   renderReadyButtonTwo = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.username === this.state.playerTwo) {
         if (this.state.readyTwo === true) {
            buttonClass = "lobbyButtonReady";
         }
         if (this.state.readyTwo === false) {
            buttonClass = "lobbyButtonNotReady";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButtonTwo}>
               Ready
        </button>
         );
      }
   };
   render = () => {

      //Redirect to lobby list if !props.inLobby
      if (!this.props.inLobby) {
         return <Redirect to={"/lobbies_list"} />
      }

      //If both players have pressed ready, redirect to the appropriate game page
      if (this.state.readyOne && this.state.readyTwo) {
         return <Redirect to={"game/:" + this.props.lobbyToJoinId} />
      }

      return (
         <div className={"MainLobbyDiv animated-fade-in"}>
            <div className={"PlayerOneLobbyDiv"}>
               <img src="/assets/char-pawn-blue.png" />
               <div className={"lobbyCenterContent"}>
                  <p>{this.state.playerOne + " is " + this.renderReadyOne()}</p>
                  {/* {this.renderReadyButtonOne()} */}
                  <button onClick={this.handlerReadyButtonOne}>
                     Ready
                  </button>
               </div>
            </div>
            <div className={"PlayerTwoLobbyDiv"}>
               <img src="/assets/char-pawn-red.png" />
               <div className={"lobbyCenterContent"}>
                  <p>{this.state.playerTwo + " is " + this.renderReadyTwo()}</p>
                  {this.renderReadyButtonTwo()}
               </div>
            </div>
         </div>
      );
   };

}
let mapStateToProps = state => {
   return {
      currentUser: state.currentUser,
      currentLobbyId: state.currentLobby,
      inLobby: state.inLobby
   }
};
let Lobby = connect(mapStateToProps)(UnconnectedLobby);

export default Lobby;
