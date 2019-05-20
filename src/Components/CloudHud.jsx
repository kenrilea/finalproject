import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/cloudHud.css"

class CloudHud extends Component {

   render = () => {

      let currentPlayerScore
      let opponentScore

      const keys = Object.keys(this.props.gameData.points);

      //Check if point first key is current user
      if (keys[0] === this.props.currentUser) {
         currentPlayerScore = this.props.gameData.points[keys[0]]
         opponentScore = this.props.gameData.points[keys[1]]
      }
      else {
         currentPlayerScore = this.props.gameData.points[keys[1]]
         opponentScore = this.props.gameData.points[keys[0]]
      }

      let turnLabel = this.props.currentTurnPlayer === this.props.currentUser ? "Blue's Turn" : "Red's Turn"

      return (
         <div className="cloud-hud-cont">
            <img src="../../assets/cloud-hud.png" />
            <label className="cloud-label1" > {currentPlayerScore} </label>
            <label className="cloud-label2"> {opponentScore} </label>
            <label className="turn-label"> {turnLabel} </label>
         </div>
      )
   }
}

const mapStateToProps = state => {
   return {
      actionMenuOptions: state.actionMenu.options,
      gameData: state.gameData,
      gameState: state.gameState,
      currentUser: state.currentUser
   };
};

export default connect(mapStateToProps)(CloudHud);