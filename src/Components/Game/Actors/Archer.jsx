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
  updatePositionAtSpeed,
  degreesBetweenPoints,
  getSquaredLengthBetweenPoints,
  normalizedDirectionBetweenPoints,
  multiplyDirectionVector,
  isInRange,
  lineTarget,
  lineRange,
  isTileOccupied,
  getIsometricFrontendPos
} from "./../../../Helpers/calcs.js";
import {
  ASSET_ACTOR_TYPE,
  ASSET_TEAM,
  ASSET_ITEM,
  ACTOR_HIGHLIGHT
} from "./../../../AssetConstants";
import socket from "./../../SocketSettings.jsx";

class Archer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frontendPos: getIsometricFrontendPos({
        x: this.props.actorData.pos.x,
        y: this.props.actorData.pos.y
      }),
      arrowPos: {
        x: 900,
        y: 900
      },
      arrowDest: {
        x: 100,
        y: 100
      },
      arrowDirection: {},
      arrowTravelDistance: {}
    };
  }

  componentDidMount = () => {
    console.log("Archer did mount");
  };

  updateMove = (speed = 0.05) => {
    let dest = getIsometricFrontendPos({ ...this.props.actorData.action.dest });

    //console.log("positions: ",this.state.frontendPos, dest);

    let newPos = updatePosition(this.state.frontendPos, dest, speed);

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
      this.updateMove(speed);
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

  updateRangedShot = () => {
    const startPos = this.state.frontendPos;

    if (this.state.arrowPos.x === 900) {
      let dest = {};
      let direction = 0;

      if (this.props.actorData.action.target === undefined) {
        dest = getIsometricFrontendPos({ ...this.props.actorData.action.dest });

        direction = normalizedDirectionBetweenPoints(
          this.state.frontendPos,
          dest
        );

        dest = multiplyDirectionVector(direction, 30000);
      } else {
        dest = getIsometricFrontendPos({
          ...this.props.actorData.action.target
        });
        direction = normalizedDirectionBetweenPoints(
          this.state.frontendPos,
          dest
        );
      }

      this.setState({
        arrowPos: { ...startPos },
        arrowDest: {
          x: dest.x,
          y: dest.y
        },
        arrowDirection: direction,
        arrowTravelDistance: getSquaredLengthBetweenPoints(startPos, dest)
      });

      cancelAnimationFrame(this.animationRangedShot);
      this.animationRangedShot = requestAnimationFrame(() => {
        this.updateRangedShot();
      });
      return;
    }

    let newPos = updatePositionAtSpeed(
      this.state.arrowPos,
      startPos,
      this.state.arrowDest,
      this.state.arrowDirection,
      this.state.arrowTravelDistance,
      100
    );

    //console.log("positions: ", newPos, this.state.arrowDest);

    if (
      (newPos.x === this.state.arrowDest.x &&
        newPos.y === this.state.arrowDest.y) ||
      newPos.x > 140 ||
      newPos.x < -40 ||
      newPos.y > 140 ||
      newPos.y < -40
    ) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationRangedShot);
      assignAnimationToActor();
      this.setState({
        arrowPos: {
          x: 900,
          y: 900
        },
        arrowDest: {
          x: 100,
          y: 100
        }
      });
      return;
    }

    this.setState({
      arrowPos: {
        x: newPos.x,
        y: newPos.y
      }
    });

    cancelAnimationFrame(this.animationRangedShot);
    this.animationRangedShot = requestAnimationFrame(() => {
      this.updateRangedShot();
    });
  };

  componentDidUpdate = () => {
    console.log(
      "state: ",
      this.props.gameState.type,
      " action: ",
      this.props.actorData.action
    );
    if (
      this.isGameState(STATES.SHOW_ANIMATIONS) &&
      this.props.actorData.action !== undefined
    ) {
      if (this.props.actorData.action.type === "move-passive") {
        this.animationMove = requestAnimationFrame(() => {
          this.updateMove(0.05);
        });
      } else if (this.props.actorData.action.type === "died") {
        this.animationDied = requestAnimationFrame(() => {
          this.updateDied();
        });
      } else if (this.props.actorData.action.type === "ranged-shot") {
        this.animationRangedShot = requestAnimationFrame(() => {
          this.updateRangedShot();
        });
      }
    }
  };

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  getCallbackFunc = action => {
    switch (action) {
      case "move-passive":
        return () => {
          this.props.dispatch(
            // Highlight nearby tiles
            setGameData({
              ...this.props.gameData,
              actors: this.props.gameData.actors.map(actor => {
                let archerPos = this.props.actorData.pos;
                let archerRange = this.props.actorData.moveSpeed;
                if (
                  actor.actorType !== "char" &&
                  isInRange(archerRange, archerPos, actor.pos) &&
                  !isTileOccupied(actor, this.props.gameData.actors)
                ) {
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
          this.props.dispatch(
            setGameState(selectTile(this.props.actorData, "move-passive"))
          );
        };
      case "ranged-shot":
        return () => {
          this.props.dispatch(
            // Highlight nearby tiles
            setGameData({
              ...this.props.gameData,
              actors: this.props.gameData.actors.map(actor => {
                let archerPos = this.props.actorData.pos;
                let archerRange = this.props.actorData.range;

                if (
                  lineTarget(archerRange, archerPos, actor.pos) ||
                  lineRange(archerRange, archerPos, actor.pos)
                ) {
                  return {
                    ...actor,
                    onTarget: true,
                    highlighted: true
                  };
                }

                return actor;
              })
            })
          );

          // Set state to selectTile
          console.log("actorData: ", this.props.actorData);
          this.props.dispatch(
            setGameState(selectTile(this.props.actorData, "ranged-shot"))
          );
        };
      default:
        return () => console.log("Unknown action");
    }
  };

  handleClick = () => {
    event.stopPropagation();
    console.log(
      "Archer: ",
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

    //console.log("STUFF: ", this.state.arrowPos, this.state.arrowDest);
    let rotation =
      "rotate(" +
      parseFloat(
        degreesBetweenPoints(
          {
            x: xFrontend + width / 2,
            y: yFrontend + height / 2
          },
          {
            x: this.state.arrowDest.x + width,
            y: this.state.arrowDest.y + height / 2
          }
        )
      ) +
      " " +
      parseFloat(this.state.arrowPos.x + width) +
      " " +
      parseFloat(this.state.arrowPos.y + height / 2) +
      ")";
    console.log("ROTATION: ", rotation);
    const arrow = (
      <image
        xlinkHref={ASSET_ACTOR_TYPE.ARCHER + ASSET_ITEM.ARROW}
        x={this.state.arrowPos.x + width / 2}
        y={this.state.arrowPos.y}
        width={width}
        height={height}
        transform={rotation}
      />
    );

    //THIS WORKS
    // const arrow = (
    //   <image
    //     xlinkHref={ASSET_ACTOR_TYPE.ARCHER + ASSET_ITEM.ARROW}
    //     x={"50"}
    //     y={"50"}
    //     width={width}
    //     height={height}
    //     transform={
    //       "rotate(" +
    //       parseFloat(
    //         degreesBetweenPoints({ x: 50, y: 50 }, { x: 62.5, y: 37.5 })
    //       ) +
    //       " " +
    //       parseFloat(50 + width / 2) +
    //       " " +
    //       parseFloat(50 + height / 2) +
    //       ")"
    //     }
    //   />
    // );

    return (
      <g>
        {animateOtherUnits}
        <image
          id={id}
          xlinkHref={
            this.props.currentUser === this.props.actorData.team
              ? ASSET_ACTOR_TYPE.ARCHER + ASSET_TEAM.FRIENDLY
              : ASSET_ACTOR_TYPE.ARCHER + ASSET_TEAM.ENEMY
          }
          x={xFrontend}
          y={yFrontend}
          width={width}
          height={height}
          onClick={this.handleClick}
        />
        {animateUnitInAction}
        {arrow}
      </g>
    );
  };
}

let mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    actionMenuVisible: state.actionMenu.visible,
    numActions: state.actionMenu.options.length,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(Archer);
