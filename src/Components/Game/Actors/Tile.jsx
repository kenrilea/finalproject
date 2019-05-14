import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu, setGameData, setGameState } from "./../../../Actions";
import { STATES, selectUnit } from "./../../../GameStates";
import { resetToSelectUnitState } from "./../../../Helpers/GameStateHelpers.js";

class Tile extends Component {
  componentDidMount = () => {};

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  handleClick = event => {
    event.stopPropagation();
    console.log("Tile: ", this.props.actorData.actorId);

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

        // temp action: actually move :D
        this.props.dispatch(
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
        );

        resetToSelectUnitState();
      }
    }
  };

  render = () => {
    const style = {
      fill: !this.props.actorData.highlighted ? "#004400" : "#440000"
      //transform: "rotate3d(0.6, -0.2, 0.2, 75deg)"
    };

    const xFrontend = this.props.actorData.pos.x * this.props.gameData.width;
    const yFrontend = this.props.actorData.pos.y * this.props.gameData.height;

    return (
      <rect
        style={style}
        stroke="red"
        strokeWidth="2"
        strokeLinecap="square"
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
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(Tile);
