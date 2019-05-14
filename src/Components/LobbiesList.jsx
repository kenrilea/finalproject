import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import mockLobbies from "./mockLobbies.jsx"

import LobbiesListElem from "./LobbiesListElem.jsx"

import "../css/lobbiesList.css"

class UnconnectedLobbiesList extends Component {

   getLobbies = () => {

      fetch("/get-lobbies")
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            return resBody.lobbies // Array of all lobbies in collection
         })
   }

   getMockLobbies = () => {
      return mockLobbies;
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


   render = () => {


      if (!this.props.loggedIn) {
         return <Redirect to="/" />
      }

      if (this.props.inLobby) {
         return <Redirect to={"lobby/:" + this.props.lobbyToJoinId} />
      }

      return (
         <div className="lobbies-list-background">

            <div className="lobbies-list-foreground animated-fade-in-delay">

               Lobbies

               <button className="ghost-button-dark" onClick={this.createLobby}>Create new lobby</button>

               {this.getMockLobbies().map(elem => {
                  return <LobbiesListElem lobbyId={elem.lobbyId} playerOne={elem.playerOne} playerTwo={elem.playerTwo} />
               })}

            </div>
         </div>
      )
   }

}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn,
      currentLobby: state.currentLobby,
      inLobby: state.inLobby,
      lobbyToJoinId: state.currentLobby
   }
}

let LobbiesList = connect(mapStateToProps)(UnconnectedLobbiesList)

export default LobbiesList