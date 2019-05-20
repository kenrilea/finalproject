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
  getLengthBetweenPoints,
  normalizedDirectionBetweenPoints,
  multiplyDirectionVector,
  isInRange,
  isTileOccupied,
  getIsometricFrontendPos,
  getCenterPoint,
  getRelativeValue
} from "./../../../Helpers/calcs.js";
import {
  ASSET_ACTOR_TYPE,
  ASSET_TEAM,
  ASSET_ITEM,
  ACTOR_HIGHLIGHT
} from "./../../../AssetConstants";
import socket from "./../../SocketSettings.jsx";

class Catapult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      frontendPos: getIsometricFrontendPos({
        x: this.props.actorData.pos.x,
        y: this.props.actorData.pos.y
      }),
      cannonballPos: {
        x: 900,
        y: 900
      },
      cannonballDest: {
        x: 100,
        y: 100
      },
      cannonballDirection: {},
      cannonballTravelDistance: {},
      cannonballDimensions: {
        width: this.props.gameData.width,
        height: this.props.gameData.height / 2
      },
      centerPointOfTravel: {}
    };
  }

  componentDidMount = () => {
    console.log("Catapult did mount");
  };

  updateMove = (speed = 0.05) => {
    let dest = getIsometricFrontendPos({ ...this.props.actorData.action.dest });

    //console.log("positions: ", this.state.frontendPos, dest);

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

  updateBombard = () => {
    const startPos = this.state.frontendPos;

    if (this.state.cannonballPos.x === 900) {
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
        cannonballPos: { ...startPos },
        cannonballDest: {
          x: dest.x,
          y: dest.y
        },
        arrowDirection: direction,
        arrowTravelDistance: getSquaredLengthBetweenPoints(startPos, dest),
        centerPointOfTravel: getCenterPoint(startPos, {
          x: dest.x,
          y: dest.y
        })
      });

      cancelAnimationFrame(this.animationBombard);
      this.animationBombard = requestAnimationFrame(() => {
        this.updateBombard();
      });
      return;
    }

    let newPos = updatePositionAtSpeed(
      this.state.cannonballPos,
      startPos,
      this.state.cannonballDest,
      this.state.arrowDirection,
      this.state.arrowTravelDistance,
      100
    );

    // let dist = Math.abs(
    //   getLengthBetweenPoints(this.state.centerPointOfTravel, newPos)
    // );
    // console.log("dist: ", dist);
    // newPos.y *= getRelativeValue(dist, 0, 10, 0, 1);

    //console.log("positions: ", newPos, this.state.cannonballDest);

    if (
      newPos.x === this.state.cannonballDest.x &&
      newPos.y === this.state.cannonballDest.y
    ) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationBombard);
      assignAnimationToActor();
      this.setState({
        cannonballPos: {
          x: 900,
          y: 900
        },
        cannonballDest: {
          x: 100,
          y: 100
        }
      });
      return;
    }

    this.setState({
      cannonballPos: {
        x: newPos.x,
        y: newPos.y
      }
    });

    cancelAnimationFrame(this.animationBombard);
    this.animationBombard = requestAnimationFrame(() => {
      this.updateBombard();
    });
  };

  componentDidUpdate = () => {
    // console.log(
    //   "state: ",
    //   this.props.gameState.type,
    //   " action: ",
    //   this.props.actorData.action
    // );
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
      } else if (this.props.actorData.action.type === "bombard") {
        this.animationBombard = requestAnimationFrame(() => {
          this.updateBombard();
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
                let catapultPos = this.props.actorData.pos;
                let catapultRange = this.props.actorData.moveSpeed;
                if (
                  actor.actorType !== "char" &&
                  isInRange(catapultRange, catapultPos, actor.pos) &&
                  !isTileOccupied(actor, this.props.gameData.actors).success
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
      case "bombard":
        return () => {
          this.props.dispatch(
            // Highlight nearby tiles
            setGameData({
              ...this.props.gameData,
              actors: this.props.gameData.actors.map(actor => {
                let catapultPos = this.props.actorData.pos;
                let catapultRange = this.props.actorData.range;

                if (
                  isInRange(catapultRange, catapultPos, actor.pos) &&
                  !isInRange(1, catapultPos, actor.pos)
                ) {
                  const occupiedTile = isTileOccupied(
                    actor,
                    this.props.gameData.actors
                  );

                  return {
                    ...actor,
                    onTarget: true,
                    highlighted: true,
                    occupiedByEnemy: occupiedTile.success
                      ? occupiedTile.actor.team !== this.props.actorData.team
                      : undefined
                  };
                }

                return actor;
              })
            })
          );

          // Set state to selectTile
          console.log("actorData: ", this.props.actorData);
          this.props.dispatch(
            setGameState(selectTile(this.props.actorData, "bombard"))
          );
        };
      default:
        return () => console.log("Unknown action");
    }
  };

  handleClick = () => {
    event.stopPropagation();
    console.log(
      "Catapult: ",
      this.props.actorData.actorId,
      " team: " + this.props.actorData.team
    );

    if (
      this.isGameState(STATES.SHOW_ANIMATIONS) ||
      this.isGameState(STATES.OPPONENT_TURN)
    )
      return;

    if (this.isGameState(STATES.SELECT_UNIT)) {
      if (this.props.currentUser !== this.props.actorData.team) return;

      // Show or hide action menu
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      } else {
        this.props.dispatch(
          setActionMenu(
            true,
            event.offsetX,
            event.offsetY,
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
    const yFrontend = isoPos.y - height / 3;

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

    let rotation =
      "rotate(" +
      parseFloat(
        degreesBetweenPoints(
          {
            x: xFrontend + width / 2,
            y: yFrontend + height / 2
          },
          {
            x: this.state.cannonballDest.x + width,
            y: this.state.cannonballDest.y + height / 2
          }
        )
      ) +
      " " +
      parseFloat(this.state.cannonballPos.x + width) +
      " " +
      parseFloat(this.state.cannonballPos.y + height / 2) +
      ")";
    //console.log("ROTATION: ", rotation);
    const cannonball = (
      <image
        xlinkHref={ASSET_ACTOR_TYPE.CATAPULT + ASSET_ITEM.CANNONBALL}
        x={this.state.cannonballPos.x}
        y={this.state.cannonballPos.y}
        width={this.state.cannonballDimensions.width}
        height={this.state.cannonballDimensions.height}
      />
    );

    return (
      <g>
        <image
          id={id}
          xlinkHref={
            this.props.currentUser === this.props.actorData.team
              ? ASSET_ACTOR_TYPE.CATAPULT + ASSET_TEAM.FRIENDLY
              : ASSET_ACTOR_TYPE.CATAPULT + ASSET_TEAM.ENEMY
          }
          x={xFrontend}
          y={yFrontend}
          width={width}
          height={height}
          onClick={this.handleClick}
        />
        {animateUnitInAction}
        {cannonball}
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

export default connect(mapStateToProps)(Catapult);
