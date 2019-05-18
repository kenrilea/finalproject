import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import socket from "./SocketSettings.jsx"

import "../css/lobby.css";
import LobbyChat from "./LobbyChat.jsx";

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

            // if (parsed.user === 1) {
            //    this.setState({ readyOne: true })
            // }
            // if (parsed.user === 2) {
            //    this.setState({ readyTwo: true })
            // }

            socket.emit("refresh-lobby", this.props.currentLobbyId)
         })
   };

   renderReadyLabel = isFirstPlayer => {
      if (isFirstPlayer) {

         if (this.state.readyPlayerOne) {
            return "is ready to go";
         }
         if (!this.state.readyPlayerOne) {
            return "is not yet ready";
         }
      }
      if (!isFirstPlayer) {

         if (this.state.playerTwo === "") {
            return "Waiting"
         }

         if (this.state.readyPlayerTwo) {
            return "is ready to go";
         }
         if (!this.state.readyPlayerTwo) {
            return "is not yet ready";
         }
      }
   }

   renderReadyButtonText = (ready) => {
      if (ready) {
         return "Not ready!"
      }
      if (!ready) {
         return "Ready"
      }
   }


   renderReadyButtonOne = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.currentUser === this.state.playerOne) {
         if (this.state.readyPlayerOne === true) {
            buttonClass = "pure-material-button-contained red";
         }
         if (this.state.readyPlayerOne === false) {
            buttonClass = "pure-material-button-contained green";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButton}>
               {this.renderReadyButtonText(this.state.readyPlayerOne)}
            </button>
         );
      }
   };

   renderReadyButtonTwo = () => {
      let buttonClass = "lobbyButtonNotReady";
      if (this.props.currentUser === this.state.playerTwo) {

         if (this.state.readyPlayerTwo === true) {
            buttonClass = "pure-material-button-contained red";
         }
         if (this.state.readyPlayerTwo === false) {
            buttonClass = "pure-material-button-contained green";
         }
         return (
            <button className={buttonClass} onClick={this.handlerReadyButton}>
               {this.renderReadyButtonText(this.state.readyPlayerTwo)}
            </button>
         );
      }
   };

   renderAvatar = (ready, playerOne) => {

      if (ready && playerOne) {
         return "/assets/char-pawn-blue-ready.png"
      }
      if (!ready && playerOne) {
         return "/assets/char-pawn-blue.png"
      }
      if (ready && !playerOne) {
         return "/assets/char-pawn-red-ready.png"
      }
      if (!ready && !playerOne) {
         return "/assets/char-pawn-red-not-ready.png"
      }
   }

   leaveLobby = () => {

      socket.emit("leave-lobby", { lobbyId: this.props.currentLobbyId, currentUser: this.props.currentUser }, () => {
         socket.emit("refresh-lobby-list")
      })

      this.props.dispatch({
         type: "LEAVE-LOBBY"
      })

   }

   render = () => {

      //Redirect to lobby list if !props.inLobby
      if (!this.props.inLobby) {
         return <Redirect to={"/lobbies_list"} />
      }

      //If both players have pressed ready, redirect to the appropriate game page
      if (this.state.readyPlayerOne && this.state.readyPlayerTwo) {
         return <Redirect to={"/game/" + this.props.currentLobbyId} />
      }

      return (
         <div className="lobbies-list-background">

            <div className={"animated-fade-in animated-grow-bounce card-container material-shadow"}>

               <div className="card-top-cont">
                  <div className="card-top-label"> Lobby <label className="card-top-sub-label2"> id: {this.props.currentLobbyId} </label></div>
                  <button className="pure-material-button-contained" onClick={this.leaveLobby}>Leave</button>
               </div>

               <div className="players-div" >

                  <div className={"PlayerOneLobbyDiv"}>
                     <img src={this.renderAvatar(this.state.readyPlayerOne, true)} />
                     <div className={"lobbyCenterContent"}>
                        <p>{this.state.playerOne + " " + this.renderReadyLabel(true)}</p>
                        {this.renderReadyButtonOne()}
                     </div>
                  </div>

                  <div className={"PlayerTwoLobbyDiv"}>
                     <img src={this.renderAvatar(this.state.readyPlayerTwo, false)} />
                     <div className={"lobbyCenterContent"}>
                        <p>{this.state.playerTwo + " " + this.renderReadyLabel(false)}</p>
                        {this.renderReadyButtonTwo()}
                     </div>
                  </div>

               </div>

            </div>
            <LobbyChat className="chatComponent" />
         </div>
      );
   };

}
let mapStateToProps = state => {
   return {
      currentUser: state.currentUser,
      currentLobbyId: state.currentLobbyId,
      inLobby: state.inLobby
   }
};
let Lobby = connect(mapStateToProps)(UnconnectedLobby);

export default Lobby;
