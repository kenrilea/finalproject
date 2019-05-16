import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import socket from "./SocketSettings.jsx"

import "../css/lobby.css";

class UnconnectedLobby extends Component {

   constructor(props) {
      super(props);
      this.state = {
         readyPlayerOne: false,
         readyPlayerTwo: false,
         playerOne: "",
         playerTwo: ""
      };
   }

   componentDidMount = () => {

      console.log("Initial state from constructor: ", this.state)

      socket.open()

      socket.emit("join", this.props.currentLobbyId)

      socket.on("lobby-data", lobby => {
         console.log("Lobby from socket: ", lobby)
         this.setState({
            playerOne: lobby.playerOne,
            playerTwo: lobby.playerTwo,
            readyPlayerOne: lobby.readyPlayerOne,
            readyPlayerTwo: lobby.readyPlayerTwo
         })
      })

      socket.emit("refresh-lobby", this.props.currentLobbyId)
   }

   // componentWillUnmount = () => {
   //    socket.close()
   // }


   handlerReadyButton = () => {

      let data = new FormData()
      data.append("lobbyId", this.props.currentLobbyId)
      data.append("currentUser", this.props.currentUser)

      fetch("/user-ready", {
         method: "POST",
         body: data
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {

            let parsed = JSON.parse(resBody)

            if (!parsed.success) {
               console.log("Error received from /user-ready endpoint")
               return
            }

            if (parsed.user === 1) {
               this.setState({ readyOne: true })
            }
            if (parsed.user === 2) {
               this.setState({ readyTwo: true })
            }

            socket.emit("refresh-lobby", this.props.currentLobbyId)
         })
   };

   renderReadyOne = () => {
      if (this.state.readyPlayerOne === true) {
         return "ready to go";
      }
      return "not yet ready";
   };

   renderReadyTwo = () => {
      if (this.state.readyPlayerTwo === true) {
         return "ready to go";
      }
      return "not yet ready";
   };


   renderReadyButtonOne = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.currentUser === this.state.playerOne) {
         if (this.state.readyPlayerOne === true) {
            buttonClass = "lobbyButtonReady";
         }
         if (this.state.readyPlayerOne === false) {
            buttonClass = "lobbyButtonNotReady";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButton}>
               Ready
            </button>
         );
      }
      return (
         <div>BUTTON HIDDEN</div>
      )
   };

   renderReadyButtonTwo = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.currentUser === this.state.playerTwo) {

         if (this.state.readyPlayerTwo === true) {
            buttonClass = "lobbyButtonReady";
         }
         if (this.state.readyPlayerTwo === false) {
            buttonClass = "lobbyButtonNotReady";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButton}>
               Ready
            </button>
         );
      }
      return (
         <div>BUTTON HIDDEN</div>
      )
   };

   render = () => {

      //Redirect to lobby list if !props.inLobby
      if (!this.props.inLobby) {
         return <Redirect to={"lobbies_list"} />
      }

      //If both players have pressed ready, redirect to the appropriate game page
      if (this.state.readyPlayerOne && this.state.readyPlayerTwo) {
         return <Redirect to={"/game/" + this.props.currentLobbyId} />
      }

      return (
         <div className="lobbies-list-background">
            <div className={"MainLobbyDiv animated-fade-in lobbies-list-foreground material-shadow"}>
               <div className={"PlayerOneLobbyDiv"}>
                  <img src="/assets/char-pawn-blue.png" />
                  <div className={"lobbyCenterContent"}>
                     <p>{this.state.playerOne + " is " + this.renderReadyOne()}</p>
                     {this.renderReadyButtonOne()}
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
