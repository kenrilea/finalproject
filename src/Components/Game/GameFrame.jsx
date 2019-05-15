import "./../../css/gameFrame.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import OuterBar from "./OuterBar.jsx";
import Tile from "./Actors/Tile.jsx";
import VoidTile from "./Actors/VoidTile.jsx";
import Pawn from "./Actors/Pawn.jsx";
import Menu from "./Menu/Menu.jsx";
import { setGameData } from "./../../Actions";
import { STATES } from "./../../GameStates";
import {
  resetToSelectUnitState,
  updateAnimationPhase,
  assignAnimationToActor
} from "./../../Helpers/GameStateHelpers.js";
import socket from "./../SocketSettings.jsx";

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  componentDidMount = () => {
    if (!this.state.loaded) {
      socket.open();
      socket.emit("get-game-data", {
        gameId: "test"
      });
    }

    socket.on("game-data", data => {
      const width = 100 / data.width;
      const height = 100 / data.height;

      let actors = data.map.slice();

      console.log("actors: ", actors);
      this.props.dispatch(
        setGameData({ ...data, actors: data.map, width, height })
      );

      let player = data.players[parseInt(data.turn) % data.players.length];
      console.log("Player turn: ", player);

      this.setState({
        loaded: true
      });
    });

    socket.on("game-state-change", data => {
      console.log("Changes: ", data);
      if (!data.success) {
        alert("error!");
        return;
      }

      let changes = data.changes;

      updateAnimationPhase(changes);
    });
  };

  getActorElements = () => {
    const actors = this.props.gameData.actors;

    return actors.map(actor => {
      if (actor.actorType === "defaultTile") {
        return <Tile key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "pawn") {
        return <Pawn key={actor.actorId} actorData={actor} />;
      }
    });
  };

  render = () => {
    if (!this.state.loaded) return null;

    return (
      <div className="wrapper">
        <div className="gameframe wrapper">
          <svg
            className="svg-canvas"
            id="chess-2-canvas"
            /*preserveAspectRatio="xMaxYMax none"
          viewBox="0 0 100 100"*/
          >
            {this.getActorElements()}
          </svg>
          <Menu options={this.props.actionMenuOptions} />
        </div>
        <OuterBar />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    actionMenuOptions: state.actionMenu.options,
    gameData: state.gameData,
    gameState: state.gameState
  };
};

export default connect(mapStateToProps)(GameFrame);
