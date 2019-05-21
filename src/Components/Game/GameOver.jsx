import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameover.css";
import { Redirect } from "react-router-dom";


class GameOver extends Component {

   componentWillMount = () => {
      // this.props.dispatch({
      //    type: "LEAVE-GAME"
      // })
   }

   getScores = () => {
      let keys = Object.keys(this.props.gameData.points);
      return (
         <div className="gameover-scores-row">
            <div className="gameover-scores-container">
               {keys.map(key => {
                  return (
                     <div className="gameover-scores-entry">
                        <div className="gameover-score-username">{key + ":"}</div>
                        <div className="gameover-score">
                           {this.props.gameData.points[key]}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      );
   };

   handleLeaveGame = () => {
      this.props.dispatch({
         type: "LEAVE-GAME"
      })
   }

   render = () => {

      if (!this.props.inGame) {
         return <Redirect to="/lobbies-list" />
      }

      return (
         <div className="gameframe wrapper game-over">
            <div className="score-container">
               <div className="gameover-header">Game over</div>
               <div className="gameover-subtitle">{this.props.winner + " won!"}</div>
               {this.getScores()}
               <div className="gameover-turns">
                  {"Game lasted " + this.props.gameData.turn + " turns"}
                  <button className="material-button" onClick={this.handleLeaveGame} >Leave Game</button>
               </div>
            </div>
         </div>
      );
   };

}

const mapStateToProps = state => {
   return {
      gameData: state.gameData,
      inGame: state.inGame
   };
};

export default connect(mapStateToProps)(GameOver);
