import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu } from "./../../../Actions";
import { STATES } from "./../../../GameStates";
import { resetToSelectUnitState } from "./../../../Helpers/GameStateHelpers.js";

class VoidTile extends Component {
  componentDidMount = () => {};

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  handleClick = event => {
    event.stopPropagation();
    console.log("VoidTile: ", this.props.actorData.actorId);

    if (this.isGameState(STATES.SHOW_ANIMATIONS)) return;

    if (this.isGameState(STATES.SELECT_UNIT)) {
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      }
    } else if (this.isGameState(STATES.SELECT_TILE)) {
      resetToSelectUnitState();
    }
  };

  render = () => {
    const xFrontend = this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.props.actorData.pos.y * this.props.gameData.height;

    const fill = "#000";
    const stroke = "#000";

    const style = {
      fill: fill,
      //transform: "rotate3d(0.6, -0.2, 0.2, 75deg)"
      stroke: stroke,
      strokeWidth: "0.1",
      strokeLinecap: "square",
      width: this.props.gameData.width,
      height: this.props.gameData.height
    };

    const id = "actorId" + this.props.actorData.actorId;

    return (
      <rect
        id={id}
        style={style}
        x={xFrontend}
        y={yFrontend}
        onClick={this.handleClick}
      />
    );
  };
}

const mapStateToProps = state => {
  return {
    actionMenuVisible: state.actionMenu.visible,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(VoidTile);
