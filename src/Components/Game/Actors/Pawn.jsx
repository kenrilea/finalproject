import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { selectTile, STATES } from "./../../../GameStates";
import {
  assignAnimationToActor,
  resetToSelectUnitState
} from "./../../../Helpers/GameStateHelpers.js";
import {
  updatePosition,
  isInRange,
  isTileOccupied,
  getIsometricFrontendPos
} from "./../../../Helpers/calcs.js";
import {
  ASSET_ACTOR_TYPE,
  ASSET_TEAM,
  ACTOR_HIGHLIGHT
} from "./../../../AssetConstants";
import socket from "./../../SocketSettings.jsx";

class Pawn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frontendPos: getIsometricFrontendPos({
        x: this.props.actorData.pos.x,
        y: this.props.actorData.pos.y
      })
    };
  }

  componentDidMount = () => {
    console.log("Pawn did mount");
  };

  updateMove = () => {
    let dest = getIsometricFrontendPos({ ...this.props.actorData.action.dest });

    //console.log("positions: ", this.state.frontendPos, dest);

    let newPos = updatePosition(this.state.frontendPos, dest, 0.5);

    if (newPos.x === dest.x && newPos.y === dest.y) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationMove);
      assignAnimationToActor();
      this.setState({
        frontendPos: {
          x: newPos.x,
          y: newPos.y
        }
      });
      return;
    }

    this.setState({
      frontendPos: {
        x: newPos.x,
        y: newPos.y
      }
    });

    cancelAnimationFrame(this.animationMove);
    this.animationMove = requestAnimationFrame(() => {
      this.updateMove();
    });
  };

  updateDied = () => {
    let dest = { x: this.state.frontendPos.x, y: 110 };

    //console.log("positions: ", this.state.frontendPos, dest);

    let newPos = updatePosition(this.state.frontendPos, dest, 0.05);

    if (newPos.x > 100 || newPos.x < 0 || newPos.y > 100 || newPos.y < 0) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationDied);
      assignAnimationToActor();
      this.setState({
        frontendPos: {
          x: newPos.x,
          y: newPos.y
        }
      });
      return;
    }

    this.setState({
      frontendPos: {
        x: newPos.x,
        y: newPos.y
      }
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
                  if (
                    (actor.actorType !== "char" &&
                      !isTileOccupied(actor, this.props.gameData.actors)) ||
                    actor.actorType === "char"
                  ) {
                    // If actor is a tile but isn't occupied, highlight
                    // If in range, highlight
                    return {
                      ...actor,
                      onTarget: true,
                      highlighted: true
                    };
                  }
                }

                return actor;
              })
            })
          );

          // Set state to selectTile
          console.log("actorData: ", this.props.actorData);
          this.props.dispatch(
            setGameState(selectTile(this.props.actorData, "move"))
          );
        };
      default:
        return () => console.log("Unknown action");
    }
  };

  handleClick = () => {
    event.stopPropagation();
    console.log(
      "Pawn: ",
      this.props.actorData.actorId,
      " team: " + this.props.actorData.team
    );

    if (this.isGameState(STATES.SHOW_ANIMATIONS)) return;

    if (this.isGameState(STATES.SELECT_UNIT)) {
      // Show or hide action menu
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      } else {
        this.props.dispatch(
          setActionMenu(
            true,
            this.state.frontendPos.x,
            this.state.frontendPos.y,
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
        // send a ws message that the player
        // wants to do an action to that position

        socket.emit("game-input", {
          type: this.props.gameState.actionType,
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
    const width = this.props.gameData.width / 2;
    const height = this.props.gameData.height / 2;
    const isoPos = this.state.frontendPos;
    const xFrontend = isoPos.x + width / 2;
    const yFrontend = isoPos.y;

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
            ";" +
            (yFrontend - 1).toString() +
            ";" +
            yFrontend.toString() +
            ";"
          }
          begin="0s"
          dur="1s"
          repeatCount="indefinite"
        />
      ) : null;

    const polyPoints = [
      [xFrontend + width / 2, yFrontend], // top
      [xFrontend + width + width / 2, yFrontend + height / 2], // right
      [xFrontend + width / 2, yFrontend + height], // bottom
      [xFrontend - width / 2, yFrontend + height / 2] // left
    ];
    const animateOtherUnits =
      this.props.actorData.highlighted &&
      this.props.gameState.unitInAction !== undefined &&
      this.props.actorData.team !== this.props.gameState.unitInAction.team ? (
        <polygon
          points={polyPoints.map(inner => inner.join(",")).join(" ")}
          id={"rect" + id}
          stroke={"#42f4eb"}
          strokeWidth="0.1"
          strokeLinecap="square"
          fill={ACTOR_HIGHLIGHT.ACTOR_ENEMY_ON_TARGET}
          x={xFrontend}
          y={yFrontend}
          width={width}
          height={height}
        >
          <animate
            xlinkHref={"#rect" + id}
            attributeName="opacity"
            from="0"
            to="1"
            begin="0s"
            dur="1s"
            repeatCount="indefinite"
          />
        </polygon>
      ) : null;
    return (
      <g>
        {animateOtherUnits}
        <image
          id={id}
          xlinkHref={
            this.props.currentUser === this.props.actorData.team
              ? ASSET_ACTOR_TYPE.PAWN + ASSET_TEAM.FRIENDLY
              : ASSET_ACTOR_TYPE.PAWN + ASSET_TEAM.ENEMY
          }
          x={xFrontend}
          y={yFrontend}
          width={width}
          height={height}
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
