import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { selectTile, STATES } from "./../../../GameStates";
import {
  assignAnimationToActor,
  resetToSelectUnitState
} from "./../../../Helpers/GameStateHelpers.js";
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

    //console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos = this.updatePosition(
      { x: this.state.x, y: this.state.y },
      dest,
      0.05
    );

    if (newPos.x === dest.x && newPos.y === dest.y) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationMove);
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

    cancelAnimationFrame(this.animationMove);
    this.animationMove = requestAnimationFrame(() => {
      this.updateMove();
    });
  };

  updateDied = () => {
    let dest = { ...this.props.actorData.action.dest, y: 110 };

    //console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos = this.updatePosition(
      { x: this.state.x, y: this.state.y },
      dest,
      0.05
    );

    if (newPos.y > 100) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationDied);
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

    cancelAnimationFrame(this.animationDied);
    this.animationDied = requestAnimationFrame(() => {
      this.updateDied();
    });
  };

  componentDidUpdate = () => {
    console.log("state: ", this.props.gameState.type);
    if (
      this.isGameState(STATES.SHOW_ANIMATIONS) &&
      this.props.actorData.action !== undefined
    ) {
      if (this.props.actorData.action.type === "move") {
        this.animationMove = requestAnimationFrame(() => {
          this.updateMove();
        });
      } else if (this.props.actorData.action.type === "died") {
        this.animationDied = requestAnimationFrame(() => {
          this.updateDied();
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
            setGameData({
              ...this.props.gameData,
              actors: this.props.gameData.actors.map(actor => {
                let pawnPos = this.props.actorData.pos;
                let pawnRange = this.props.actorData.moveSpeed;
                if (isInRange(pawnRange, pawnPos, actor.pos)) {
                  return {
                    ...actor,
                    highlighted: true
                  };
                }

                return actor;
              })
            })
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
      if (
        this.props.actorData.team === this.props.gameState.unitInAction.team
      ) {
        // if actor is part of the unit in action's team,
        // change game state back to SELECT_UNIT
        resetToSelectUnitState();
      } else {
        // else,
        // send a ws message that the player wants to move
        // to that position

        socket.emit("game-input", {
          type: "move",
          actorId: this.props.gameState.unitInAction.actorId,
          dest: {
            x: this.props.actorData.pos.x,
            y: this.props.actorData.pos.y
          }
        });
      }
    }
  };

  render = () => {
    const xFrontend = this.state.x; // this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.state.y; // this.props.actorData.pos.y * this.props.gameData.height;

    const id = "actorId" + this.props.actorData.actorId;

    const animateUnitInAction =
      this.props.gameState.unitInAction !== undefined &&
      this.props.actorData.actorId ===
        this.props.gameState.unitInAction.actorId ? (
        <animate
          xlinkHref={"#" + id}
          attributeName="y"
          values={
            yFrontend.toString() +
            "%;" +
            (yFrontend - 1).toString() +
            "%;" +
            yFrontend.toString() +
            "%;"
          }
          begin="0s"
          dur="1s"
          repeatCount="indefinite"
        />
      ) : null;

    const animateOtherUnits =
      this.props.actorData.highlighted &&
      this.props.gameState.unitInAction !== undefined &&
      this.props.actorData.team !== this.props.gameState.unitInAction.team ? (
        <rect
          id={"rect" + id}
          stroke={"#42f4eb"}
          strokeWidth="2"
          strokeLinecap="square"
          x={xFrontend + "%"}
          y={yFrontend + "%"}
          width={this.props.gameData.width + "%"}
          height={this.props.gameData.height + "%"}
        >
          <animate
            xlinkHref={"#rect" + id}
            attributeName="fill"
            from="#000"
            to="#f00"
            begin="0s"
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
      ) : null;

    return (
      <g>
        {animateOtherUnits}
        <image
          id={id}
          xlinkHref={
            this.props.currentUser === this.props.actorData.team
              ? "/assets/char-pawn-blue.png"
              : "/assets/char-pawn-red.png"
          }
          x={xFrontend + "%"}
          y={yFrontend + "%"}
          width={this.props.gameData.width + "%"}
          height={this.props.gameData.height + "%"}
          onClick={this.handleClick}
        />
        {animateUnitInAction}
      </g>
    );
  };
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    actionMenuVisible: state.actionMenu.visible,
    numActions: state.actionMenu.options.length,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(Pawn);
