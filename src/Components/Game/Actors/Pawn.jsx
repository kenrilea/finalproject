import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { selectTile, STATES } from "./../../../GameStates";
import { assignAnimationToActor } from "./../../../Helpers/GameStateHelpers.js";
import { isInRange } from "./../../../Helpers/calcs.js";
import socket from "./../../SocketSettings.jsx";

class Pawn extends Component {
  componentDidMount = () => {};

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  updatePosition = (start, end, mult) => {
    let newPos = start;

    newPos.x += (end.x - start.x) * mult;
    newPos.y += (end.y - start.y) * mult;

    if (Math.abs(newPos.x - end.x) < 0.5) {
      newPos.x = end.x;
    }
    if (Math.abs(newPos.y - end.y) < 0.5) {
      newPos.y = end.y;
    }

    return newPos;
  };

  componentDidUpdate = () => {
    console.log("state: ", this.props.gameState.type);
    if (
      this.isGameState(STATES.SHOW_ANIMATIONS) &&
      this.props.actorData.action !== undefined
    ) {
      console.log("moving");
      setTimeout(() => {
        assignAnimationToActor();
      }, 3000);
    }
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

    if (this.isGameState(STATES.SHOW_ANIMATIONS)) return;

    if (this.isGameState(STATES.SELECT_UNIT)) {
      // Show or hide action menu
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      } else {
        this.props.dispatch(
          setActionMenu(
            true,
            this.props.actorData.pos.x * this.props.gameData.width,
            this.props.actorData.pos.y * this.props.gameData.height,
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

    const id = "actorId" + this.props.actorData.actorId;

    const action = this.props.actorData.action;

    const animations =
      action !== undefined && action.type === "move" ? (
        <g>
          <animate
            xlinkHref={"#" + id}
            attributeName="x"
            from={xFrontend + "%"}
            to={action.dest.x * this.props.gameData.width + "%"}
            dur="3s"
            begin="0s"
            fill="freeze"
          />
          <animate
            xlinkHref={"#" + id}
            attributeName="y"
            from={yFrontend + "%"}
            to={action.dest.y * this.props.gameData.height + "%"}
            dur="3s"
            begin="0s"
            fill="freeze"
          />
        </g>
      ) : null;

    return (
      <g>
        <image
          id={id}
          xlinkHref="/assets/char-pawn-blue.png"
          x={xFrontend + "%"}
          y={yFrontend + "%"}
          width={this.props.gameData.width + "%"}
          height={this.props.gameData.height + "%"}
          onClick={this.handleClick}
        />
        {animations}
      </g>
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
