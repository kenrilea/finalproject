import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import socket from "./SocketSettings.jsx"

import "../css/lobbiesListElem.css"

class UnconnectedLobbiesListElem extends Component {

   constructor(props) {
      super(props)
      this.state = {

         //
      }
   }

   joinLobby = lobbyId => {

      let data = new FormData()
      data.append("lobbyId", lobbyId)
      data.append("currentUser", this.props.currentUser)

      fetch("/join-lobby", {
         method: "POST",
         body: data,
         credentials: "include"
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {

            let parsed = JSON.parse(resBody)

            if (!parsed.success) {
               console.log("Error joining lobby")
               return;
            }

            console.log("Joining lobby...")
            this.props.dispatch({
               type: "JOIN-LOBBY",
               lobbyId: lobbyId,
               inLobby: true,
            })
            socket.emit("refresh-lobby-list")
         })
   }

   render = () => {

      return (
         <div className="lobbies-list-elem-container">


            <div className="player-label letter-spacing1">
               {this.props.lobbyId}
            </div>

            <div className="player-label">
               {this.props.playerOne}
            </div>

            <div className="player-label">
               VS
            </div>

            <div className="player-label">
               {this.props.playerTwo ? this.props.playerTwo : "Waiting..."}
            </div>

            <button className="pure-material-button-contained square bottom-pad" disabled={this.props.playerTwo ? true : false} onClick={this.props.playerTwo ? undefined : () => this.joinLobby(this.props.lobbyId)} >
               {this.props.playerTwo ? "FULL" : "JOIN!"}
            </button>

         </div>
      )

   }
}

let mapStateToProps = state => {
   return {
      currentUser: state.currentUser
   }
}

let LobbiesListElem = connect(mapStateToProps)(UnconnectedLobbiesListElem)

export default LobbiesListElem