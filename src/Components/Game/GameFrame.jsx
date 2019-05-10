import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameFrame.css";

class GameFrame extends Component {
  render = () => {
    return (
      <div className="gameframe wrapper">
        <p>
          container with fixed aspect ratio of 5/4 that expands to take up as
          much of the available space as it can
        </p>
      </div>
    );
  };
}

export default GameFrame;
