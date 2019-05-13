import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import "../css/lobbies.css"

class UnconnectedLobbies extends Component {

   getLobbies = () => {


   }

   render = () => {

      if (!this.props.loggedIn) {
         return <Redirect to="/" />
      }

      return (
         <div className="lobbies-background">
            <button onClick={this.createLobby}>Create new lobby</button>
            <div className="lobbies-foreground animated-fade-in-delay"> Lobbies </div>

         </div>
      )
   }

}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn
   }
}

let Lobbies = connect(mapStateToProps)(UnconnectedLobbies)

export default Lobbies