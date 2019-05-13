import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import "../css/lobbies.css"

class UnconnectedLobbiesList extends Component {

   getLobbies = () => {

      fetch("get-lobbies")
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            return resBody.lobbies
         })
   }

   createLobby = () => {

      fetch("/create-lobby", {
         credentials: "include"
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {

            if (!resBody.success) {
               console.log("Error creating lobby")
               return
            }

            console.log("Joining the lobby!!")

            this.props.dispatch({
               type: "JOIN-LOBBY",
               lobbyId: resBody.lobbyId
            })
         })
   }

   joinLobby = lobbyId => {

      let data = formData()
      data.append("lobbyId", lobbyId)

      fetch("/join-lobby", {
         method: "POST",
         body: data
      })
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            if (!resBody.success) {
               console.log("Error joining lobby")
            }
         })

      this.props.disptach({
         type: "JOIN-LOBBY",
         lobbyId: lobbyId,
      })
   }

   render = () => {

      if (!this.props.loggedIn) {
         return <Redirect to="/" />
      }

      return (
         <div className="lobbies-background">
            <button onClick={this.createLobby}>Create new lobby</button>
            <div className="lobbies-foreground animated-fade-in-delay">
               Lobbies
               <div className="lobbies-lobby-elem">
                  Lobby 1 , User 1, User 2
               </div>

            </div>
         </div>
      )
   }

}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn,
      currentLobby: state.currentLobby
   }
}

let LobbiesList = connect(mapStateToProps)(UnconnectedLobbiesList)

export default LobbiesList