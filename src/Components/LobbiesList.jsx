import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import mockLobbies from "./mockLobbies.jsx"

import LobbiesListElem from "./LobbiesListElem.jsx"

import "../css/lobbiesList.css"

class UnconnectedLobbiesList extends Component {

   constructor(props) {
      super(props)
      this.state = {
         lobbies: []
      }
   }

   componentDidMount = () => {
      //Populate lobbies array in state upon loading!
      this.getLobbies()
   }

   getLobbies = () => {

      fetch("/get-lobbies")
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            let parsedLobbies = JSON.parse(resBody) // Array of all lobbies in collection
            this.setState({
               lobbies: parsedLobbies
            })
         })
   }

   getMockLobbies = () => {
      return mockLobbies;
   }

   createLobby = () => {

      let data = new FormData()
      data.append("currentUser", this.props.currentUser)

      fetch("/create-lobby", {
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
               console.log("Error creating lobby")
               return
            }
            console.log("Joining the lobby!!")

            this.props.dispatch({
               type: "JOIN-LOBBY",
               lobbyId: parsed.lobbyId
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

            <div className="lobbies-list-foreground material-shadow animated-fade-in-delay">

               <div className="lobbies-list-button-cont">

                  <h3 className="lobbies-label">Lobbies</h3>
                  <button className="ghost-button-dark" onClick={this.createLobby}>Create new lobby</button>
                  <button className="ghost-button-dark" onClick={this.getLobbies}>Refresh lobbies </button>

               </div>
               <div className="lobbies-list-container">
                  {this.state.lobbies.map(elem => {
                     return <LobbiesListElem lobbyId={elem._id} playerOne={elem.playerOne} playerTwo={elem.playerTwo} />
                  })}
               </div>

            </div>

         </div>
      )
   }

}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn,
      currentUser: state.currentUser,
      currentLobby: state.currentLobby,
      inLobby: state.inLobby,
      lobbyToJoinId: state.currentLobby
   }
}

let LobbiesList = connect(mapStateToProps)(UnconnectedLobbiesList)

export default LobbiesList