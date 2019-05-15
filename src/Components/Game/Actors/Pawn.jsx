import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { selectTile, STATES } from "./../../../GameStates";
import { assignAnimationToActor } from "./../../../Helpers/GameStateHelpers.js";
import { isInRange } from "./../../../Helpers/calcs.js";
import socket from "./../../SocketSettings.jsx";

class Pawn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x: this.props.actorData.pos.x * this.props.gameData.width,
      y: this.props.actorData.pos.y * this.props.gameData.height,
      startAnimation: false,
      doneAnimation: false
    };
  }

  componentDidMount = () => {
    console.log("Pawn did mount");
  };

  updateMove = () => {
    let dest = { ...this.props.actorData.action.dest };
    dest.x = dest.x * this.props.gameData.width;
    dest.y = dest.y * this.props.gameData.height;

    console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos = this.updatePosition(
      { x: this.state.x, y: this.state.y },
      dest,
      0.05
    );

    if (newPos.x === dest.x && newPos.y === dest.y) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationId);
      assignAnimationToActor();
      this.setState({
        x: newPos.x,
        y: newPos.y
      });
      return;
    }

    this.setState({
      x: newPos.x,
      y: newPos.y
    });

    cancelAnimationFrame(this.animationId);
    this.animationId = requestAnimationFrame(() => {
      this.updateMove();
    });
  };

  componentDidUpdate = () => {
    console.log("state: ", this.props.gameState.type);
    if (
      this.isGameState(STATES.SHOW_ANIMATIONS) &&
      this.props.actorData.action !== undefined
    ) {
      if (this.props.actorData.action.type === "move") {
        this.animationId = requestAnimationFrame(() => {
          this.updateMove();
        });
      }
    }
  };

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  updatePosition = (start, end, mult) => {
    let newPos = {};

    /*newPos.x = (1 - mult) * start.x + mult * end.x;
    newPos.y = (1 - mult) * start.y + mult * end.y;*/
    newPos.x = start.x + mult * (end.x - start.x);
    newPos.y = start.y + mult * (end.y - start.y);

    if (Math.abs(newPos.x - end.x) < 0.5) {
      newPos.x = end.x;
    }
    if (Math.abs(newPos.y - end.y) < 0.5) {
      newPos.y = end.y;
    }

    return newPos;
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
    const xFrontend = this.state.x; // this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.state.y; // this.props.actorData.pos.y * this.props.gameData.height;

    const id = "actorId" + this.props.actorData.actorId;

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
