import "./../../css/gameFrame.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import OuterBar from "./OuterBar.jsx";
import GameOver from "./GameOver.jsx";
import Tile from "./Actors/Tile.jsx";
import VoidTile from "./Actors/VoidTile.jsx";
import Archer from "./Actors/Archer.jsx";
import Catapult from "./Actors/Catapult.jsx";
import Knight from "./Actors/Knight.jsx";
import Legionary from "./Actors/Legionary.jsx";
import Pawn from "./Actors/Pawn.jsx";
import Menu from "./Menu/Menu.jsx";
import { setGameData } from "./../../Actions";
import { STATES } from "./../../GameStates";
import {
  resetToSelectUnitState,
  updateAnimationPhase,
  goToOpponentState
} from "./../../Helpers/GameStateHelpers.js";
import socket from "./../SocketSettings.jsx";
import LobbyChat from "./../LobbyChat.jsx";

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      currentTurnPlayer: "",
      gameOver: false,
      winner: "",
      playerOne: "",
      playerTwo: ""
    };
  }

  isGameState = state => {
    return state === this.props.gameState.type;
  };

  handleOverworldClick = event => {
    event.stopPropagation;
    if (this.isGameState(STATES.SELECT_TILE)) {
      // if actor is part of the unit in action's team,
      // change game state back to SELECT_UNIT
      resetToSelectUnitState();
    }
  };

  componentDidMount = () => {
    this.props.dispatch({
      type: "JOIN-LOBBY",
      lobbyId: this.props.match.params.gameId,
      inLobby: false
    });
    console.log("wildcard");
    console.log(this.props.match.params.gameId);
    if (!this.state.loaded) {
      socket.open();
    }

    socket.on("game-data", data => {
      console.log("________________GAME DATA______________");
      console.log(data);

      const width = 100 / data.width;
      const height = 100 / data.height;

      if (data.playerWon !== undefined) {
        console.log(data.playerWon + " won!");
        this.props.dispatch(
          setGameData({
            ...data,
            actors: data.map,
            width,
            height
          })
        );
        this.setState({
          gameOver: true,
          currentTurnPlayer: "",
          winner: data.playerWon
        });
        return;
      }

      let actors = data.map.slice();
      console.log("actors: ", actors);

      let player = data.players[parseInt(data.turn) % data.players.length];
      console.log("Player turn: ", player);

      this.props.dispatch(
        setGameData({
          ...data,
          actors: data.map,
          width,
          height
        })
      );

      this.setState({
        loaded: true,
        currentTurnPlayer: player
      });

      if (player === this.props.currentUser) {
        resetToSelectUnitState();
      } else {
        goToOpponentState();
      }
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
    socket.on("game-created", msg => {
      console.log("game is created loading game");
      socket.emit("get-game-data", { gameId: this.props.match.params.gameId });
    });
    socket.emit("join-game", this.props.match.params.gameId);

    socket.on("lobby-data", lobby => {
      console.log("Recieved player data from lobby: ", lobby);
      this.setState({
        ...this.state,
        playerOne: lobby.playerOne,
        playerTwo: lobby.playerTwo
      });
    });

    console.log("Getting Lobby data for player data:");
    socket.emit("refresh-lobby", this.props.match.params.gameId);
    console.log("Gamestate Props:");
    console.log(this.props);
    console.log("Getting chat data...");
    socket.emit("refresh-lobby-chat", this.props.match.params.gameId);
  };

  getActorElements = () => {
    const actors = this.props.gameData.actors;

    return actors.map(actor => {
      if (actor.actorType === "defaultTile") {
        return <Tile key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "pawn") {
        return <Pawn key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "knight") {
        return <Knight key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "legionary") {
        return <Legionary key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "catapult") {
        return <Catapult key={actor.actorId} actorData={actor} />;
      } else if (actor.charType === "archer") {
        return <Archer key={actor.actorId} actorData={actor} />;
      }
    });
  };

  render = () => {
    if (!this.state.loaded) return null;

    let gameOverContent = this.state.gameOver ? (
      <GameOver winner={this.state.winner} />
    ) : null;

    return (
      <div className="wrapper" onClick={this.handleOverworldClick}>
        <div className="gameframe wrapper">
          <svg
            className="svg-canvas"
            id="chess-2-canvas"
            /*preserveAspectRatio="xMaxYMax none"*/
            viewBox="0 0 100 100"
          >
            {this.getActorElements()}
          </svg>
          <Menu options={this.props.actionMenuOptions} />
          {gameOverContent}
        </div>
        <OuterBar
          gameOver={this.state.gameOver}
          currentTurnPlayer={this.state.currentTurnPlayer}
        />
        <LobbyChat
          className="chatComponent"
          playerOne={this.state.playerOne}
          playerTwo={this.state.playerTwo}
        />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    actionMenuOptions: state.actionMenu.options,
    gameData: state.gameData,
    gameState: state.gameState,
    currentLobbyId: state.currentLobbyId
  };
};

export default connect(mapStateToProps)(GameFrame);
