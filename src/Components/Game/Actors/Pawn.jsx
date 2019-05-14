import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { selectTile, STATES } from "./../../../GameStates";
import { isInRange } from "./../../../Helpers/calcs.js";
import socket from "./../../SocketSettings.jsx";

class Pawn extends Component {
  componentDidMount = () => {};

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  getCallbackFunc = action => {
    switch (action) {
      case "move":
        return () => {
          this.props.dispatch(
            // Highlight nearby tiles
            setGameData(
              this.props.gameData.actors.map(actor => {
                let pawnPos = this.props.actorData.pos;
                let pawnRange = this.props.actorData.moveSpeed;
                if (isInRange(pawnRange, pawnPos, actor.pos)) {
                  return {
                    ...actor,
                    highlighted: true
                  };
                }

                return actor;
              }),
              this.props.gameData.width,
              this.props.gameData.height
            )
          );

          // Set state to selectTile
          console.log("actorData: ", this.props.actorData);
          this.props.dispatch(setGameState(selectTile(this.props.actorData)));
        };
      default:
        return () => console.log("Unknown action");
    }
  };

  handleClick = () => {
    event.stopPropagation();
    console.log("Pawn: ", this.props.actorData.actorId);

    if (this.isGameState(STATES.SELECT_UNIT)) {
      // Show or hide action menu
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      } else {
        this.props.dispatch(
          setActionMenu(
            true,
            this.props.actorData.pos.x * this.props.gameData.width, // Not being used right now.
            this.props.actorData.pos.y * this.props.gameData.height, // Not being used right now.
            this.props.actorData.actions.map(action => {
              return {
                text: action,
                callbackFunc: this.getCallbackFunc(action)
              };
            })
          )
        );
      }
    } else if (this.isGameState(STATES.SELECT_TILE)) {
      // do nothing
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
    actionMenuVisible: state.actionMenu.visible,
    numActions: state.actionMenu.options.length,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(Pawn);
