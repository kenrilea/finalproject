import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import "../css/lobbiesListElem.css"

class UnconnectedLobbiesListElem extends Component {

   constructor(props) {
      super(props)
      this.state = {

         full: false,
         playerTwo: ""
      }
   }

   joinLobby = lobbyId => {

      let data = new FormData()
      data.append("lobbyId", lobbyId)

      fetch("/join-lobby", {
         method: "POST",
         body: data,
         credentials: "include"
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            if (!resBody.success) {
               console.log("Error joining lobby")
            }
         })
      console.log("Joining lobby...")
      this.props.dispatch({
         type: "JOIN-LOBBY",
         lobbyId: lobbyId,
      })
      this.setState({ full: true, playerTwo: this.props.currentUser })
   }

   render = () => {

      return (
         <div className="lobbies-list-elem-container">

            <div className="player-label">
               {this.props.lobbyId}
            </div>

            <div className="player-label">
               {this.props.playerOne}
            </div>

            <div>
               -VS-
            </div>

            <div className="player-label">
               {this.props.playerTwo ? this.props.playerTwo : "Waiting for challenger..."}
            </div>

            <button className="ghost-button-dark" /*onClick={this.props.full ? undefined : this.joinLobby(this.props.lobbyId)} */ >
               {this.props.playerTwo ? "In Progress" : "I want some!"}
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