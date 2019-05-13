import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu } from "./../../../Actions";
import { deflate } from "zlib";

class Pawn extends Component {
  componentDidMount = () => {};

  getCallbackFunc = action => {
    switch (action) {
      case "move":
        return () => console.log("Triggered action: " + action);
      default:
        return () => console.log("Unknown action");
    }
  };

  handleClick = () => {
    event.stopPropagation();
    console.log("Pawn: ", this.props.actorData.actorId);

    if (this.props.visible) {
      this.props.dispatch(setActionMenu(false, 0, 0, []));
    } else {
      this.props.dispatch(
        setActionMenu(
          true,
          this.props.xFrontend, // Not being used right now.
          this.props.yFrontend, // Not being used right now.
          this.props.actorData.actions.map(action => {
            return {
              text: action,
              callbackFunc: this.getCallbackFunc(action)
            };
          })
        )
      );
    }
  };

  render = () => {
    const xFrontend = this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.props.actorData.pos.y * this.props.gameData.height;

    return (
      <image
        xlinkHref="/assets/char-pawn-blue.png"
        x={xFrontend + "%"}
        y={yFrontend + "%"}
        width={this.props.gameData.width + "%"}
        height={this.props.gameData.height + "%"}
        onClick={this.handleClick}
      />
    );
  };
}

const mapStateToProps = state => {
  return {
    visible: state.actionMenu.visible,
    numActions: state.actionMenu.options.length,
    gameData: state.gameData
  };
};

export default connect(mapStateToProps)(Pawn);
