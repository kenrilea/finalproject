import React, { Component } from "react";
import { connect } from "react-redux";
import socket from "./../SocketSettings.jsx";
import "./../../css/outerbar.css";

class OuterBar extends Component {
  componentDidMount = () => {
    socket.on("game-over", data => {
      console.log("game-over data: ", data);
      socket.emit("get-game-data", {
        gameId: "test"
      });
    });
  };

  handleSurrender = () => {
    socket.emit("game-input", {
      type: "leave"
    });
    console.log("leave");
  };

  render = () => {
    console.log(this.props.gameData);

    const keys = Object.keys(this.props.gameData.points);
    const pointsDisplay = keys.map(key => {
      return (
        <div className="outerbar-points-players">
          <div className="outerbar-player-names">{key}</div>
          <div className="outerbar-points">
            {this.props.gameData.points[key]}
          </div>
        </div>
      );
    });

    const surrenderButton = this.props.gameOver ? null : (
      <button onClick={this.handleSurrender}>Surrender</button>
    );

    return (
      <div className="outerbar">
        <div className="outerbar-points-section">
          <div className="outerbar-point-label">Points</div>
          <div className="outerbar-points-container">{pointsDisplay}</div>
        </div>
        {surrenderButton}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    actionMenuOptions: state.actionMenu.options,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(OuterBar);
