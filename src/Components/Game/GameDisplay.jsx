import "./../../css/gameDisplay.css";

import React from "react";
import { connect } from "react-redux";

import { fadeColor, switchColor } from "./../../Actions";

class GameDisplay extends React.Component {
  shouldComponentUpdate(nextProps) {
    const shouldUpdate = nextProps.lastAction === "RUN" || "UPDATE";

    if (!shouldUpdate) {
      // This never gets logged, even if nextProps.lastAction is not 'RUN' or 'UPDATE'
      console.log("GameDisplay will not update");
      console.log("Last action: " + nextProps.lastAction);
    }

    return shouldUpdate;
  }

  componentWillUpdate() {
    // This gets logged even if this.props.lastAction is not 'RUN' or 'UPDATE
    console.log("GameDisplay will update");
    console.log("Last action: " + this.props.lastAction);
  }

  render() {
    return (
      <div
        id="game-display"
        className={this.props.running ? "game-display" : "game-display hidden"}
        onClick={this.props.switchColor}
        onMouseMove={this.props.fadeColor}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    running: state.gameRunning,
    lastAction: state.lastAction
  };
};

const mapDispatchTopProps = dispatch => {
  return {
    fadeColor: e => dispatch(fadeColor(e)),
    switchColor: () => dispatch(switchColor())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(GameDisplay);
