import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { STATES } from "./../../../GameStates";
import { resetToSelectUnitState } from "./../../../Helpers/GameStateHelpers.js";
import { getIsometricFrontendPos } from "./../../../Helpers/calcs.js";
import { ACTOR_HIGHLIGHT, ASSET_TILE } from "./../../../AssetConstants";
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
          type: this.props.gameState.actionType,
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
    const x = this.props.actorData.pos.x;
    const y = this.props.actorData.pos.y;
    const width = this.props.gameData.width;
    const height = this.props.gameData.height / 2;

    const isoPos = getIsometricFrontendPos({ x, y });
    const xFrontend = isoPos.x;
    const yFrontend = isoPos.y;

    const id = "actorId" + this.props.actorData.actorId;

    const highlighted = this.props.actorData.highlighted;
    const onTarget = this.props.actorData.onTarget;
    const occupiedByEnemy = this.props.actorData.occupiedByEnemy;

    const fill = occupiedByEnemy
      ? ACTOR_HIGHLIGHT.ACTOR_ENEMY_ON_TARGET
      : onTarget
      ? ACTOR_HIGHLIGHT.TILE_TARGET
      : ACTOR_HIGHLIGHT.TILE_ON_PATH;
    const stroke = "#fff";

    const style = {
      fill: fill,
      //transform: "rotate3d(0.6, -0.2, 0.2, 75deg)"
      stroke: stroke,
      strokeWidth: "0.1",
      strokeLinecap: "square"
      // width: height,
      // height: height
    };

    const polyPoints = [
      [xFrontend + width / 2, yFrontend], // top
      [xFrontend + width, yFrontend + height / 2], // right
      [xFrontend + width / 2, yFrontend + height], // bottom
      [xFrontend, yFrontend + height / 2] // left
    ];
    const animate =
      highlighted || onTarget ? (
        <polygon
          points={polyPoints.map(inner => inner.join(",")).join(" ")}
          id={"rect" + id}
          style={style}
          x={xFrontend}
          y={yFrontend}
          onClick={this.handleClick}
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
        <image
          id={id}
          xlinkHref={ASSET_TILE.REGULAR}
          x={xFrontend}
          y={yFrontend}
          width={width}
          height={height}
          pointerEvents={"none"}
          // onClick={this.handleClick}
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
