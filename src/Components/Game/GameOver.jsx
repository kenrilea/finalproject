import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameover.css";

class GameOver extends Component {
  render = () => {
    return (
      <div className="gameframe wrapper game-over">
        GAME OVER. {this.props.winner} won!
      </div>
    );
  };
}

export default GameOver;
