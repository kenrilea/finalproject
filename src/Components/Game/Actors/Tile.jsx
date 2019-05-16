import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { STATES } from "./../../../GameStates";
import {
  resetToSelectUnitState,
  updateAnimationPhase
} from "./../../../Helpers/GameStateHelpers.js";
import socket from "./../../SocketSettings.jsx";

class Tile extends Component {
  componentDidMount = () => {};

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  handleClick = event => {
    event.stopPropagation();
    console.log("Tile: ", this.props.actorData.actorId);

    if (this.isGameState(STATES.SHOW_ANIMATIONS)) return;

    if (this.isGameState(STATES.SELECT_UNIT)) {
      if (this.props.actionMenuVisible) {
        this.props.dispatch(setActionMenu(false, 0, 0, []));
      }
    } else if (this.isGameState(STATES.SELECT_TILE)) {
      if (!this.props.actorData.highlighted) {
        // if tile is not highlighted,
        // change game state back to SELECT_UNIT
        //this.props.dispatch(setGameState(selectUnit()));
        resetToSelectUnitState();
      } else {
        // if the tile is highlighted,
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

        // temp action: actually move :D
        /*this.props.dispatch(
          setGameData(
            this.props.gameData.actors.map(actor => {
              if (actor.actorId === this.props.gameState.unitInAction.actorId) {
                console.log(actor, this.props.gameState.unitInAction);
                return {
                  ...actor,
                  pos: {
                    ...actor.pos,
                    x: this.props.actorData.pos.x,
                    y: this.props.actorData.pos.y
                  }
                };
              }
              return actor;
            }),
            this.props.gameData.width,
            this.props.gameData.height
          )
        );*/
      }
    }
  };

  render = () => {
    const xFrontend = this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.props.actorData.pos.y * this.props.gameData.height;

    const fill = "#000";
    const stroke = "#42f4eb";

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

    const animate = this.props.actorData.highlighted ? (
      <animate
        xlinkHref={"#" + id}
        attributeName="fill"
        from="#000"
        to="#999"
        begin="0s"
        dur="1s"
        repeatCount="indefinite"
      />
    ) : null;

    return (
      <g>
        <rect
          id={id}
          style={style}
          x={xFrontend}
          y={yFrontend}
          onClick={this.handleClick}
        />
        {animate}
      </g>
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

export default connect(mapStateToProps)(Tile);
