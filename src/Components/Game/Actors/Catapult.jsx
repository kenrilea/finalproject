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
  isTileOccupied
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
      x: this.props.actorData.pos.x * this.props.gameData.width,
      y: this.props.actorData.pos.y * this.props.gameData.height,
      cannonballPos: {
        x: 900,
        y: 900
      },
      cannonballDimensions: {
        width: this.props.gameData.width,
        height: this.props.gameData.height
      }
    };
  }

  componentDidMount = () => {
    console.log("Catapult did mount");
  };

  updateMove = (speed = 0.05) => {
    let dest = { ...this.props.actorData.action.dest };
    dest.x = dest.x * this.props.gameData.width;
    dest.y = dest.y * this.props.gameData.height;

    //console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos = updatePosition(
      { x: this.state.x, y: this.state.y },
      dest,
      speed
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
      this.updateMove(speed);
    });
  };

  updateDied = () => {
    let dest = { x: this.state.x, y: 110 };

    //console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos = updatePosition(
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

  updateBombard = () => {
    let dest = { ...this.props.actorData.action.dest };
    dest.x = dest.x * this.props.gameData.width;
    dest.y = dest.y * this.props.gameData.height;

    //console.log("positions: ", { x: this.state.x, y: this.state.y }, dest);

    let newPos =
      this.state.cannonballPos.x === 900
        ? { x: this.state.x, y: this.state.y }
        : updatePosition(this.state.cannonballPos, dest, 0.15);

    if (newPos.x === dest.x && newPos.y === dest.y) {
      console.log("cancelled anim");
      this.props.actorData.action = undefined;
      cancelAnimationFrame(this.animationBombard);
      assignAnimationToActor();
      this.setState({
        cannonballPos: {
          x: 900,
          y: 900
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

    const animateOtherUnits =
      this.props.actorData.highlighted &&
      this.props.gameState.unitInAction !== undefined &&
      this.props.actorData.team !== this.props.gameState.unitInAction.team ? (
        <rect
          id={"rect" + id}
          stroke={"#42f4eb"}
          strokeWidth="0.1"
          strokeLinecap="square"
          fill={ACTOR_HIGHLIGHT.ACTOR_ENEMY_ON_TARGET}
          x={xFrontend}
          y={yFrontend}
          width={this.props.gameData.width}
          height={this.props.gameData.height}
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
        </rect>
      ) : null;

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
        {animateOtherUnits}
        <image
          id={id}
          xlinkHref={
            this.props.currentUser === this.props.actorData.team
              ? ASSET_ACTOR_TYPE.CATAPULT + ASSET_TEAM.FRIENDLY
              : ASSET_ACTOR_TYPE.CATAPULT + ASSET_TEAM.ENEMY
          }
          x={xFrontend}
          y={yFrontend}
          width={this.props.gameData.width}
          height={this.props.gameData.height}
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
