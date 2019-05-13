import "./../../css/gameFrame.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import Tile from "./Actors/Tile.jsx";
import VoidTile from "./Actors/VoidTile.jsx";
import Pawn from "./Actors/Pawn.jsx";
import Menu from "./Menu/Menu.jsx";
import { setGameData } from "./../../Actions";

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount = () => {
    let body = {
      map: [
        {
          actorId: "1",
          pos: { x: 0, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "2",
          pos: { x: 0, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "3",
          pos: { x: 0, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "4",
          pos: { x: 0, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "5",
          pos: { x: 0, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "6",
          pos: { x: 0, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "7",
          pos: { x: 0, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "8",
          pos: { x: 0, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "9",
          pos: { x: 1, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "10",
          pos: { x: 1, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "11",
          pos: { x: 1, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "12",
          pos: { x: 1, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "13",
          pos: { x: 1, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "14",
          pos: { x: 1, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "15",
          pos: { x: 1, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "16",
          pos: { x: 1, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "17",
          pos: { x: 2, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "18",
          pos: { x: 2, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "19",
          pos: { x: 2, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "20",
          pos: { x: 2, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "21",
          pos: { x: 2, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "22",
          pos: { x: 2, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "23",
          pos: { x: 2, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "24",
          pos: { x: 2, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "25",
          pos: { x: 3, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "26",
          pos: { x: 3, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "27",
          pos: { x: 3, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "28",
          pos: { x: 3, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "29",
          pos: { x: 3, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "30",
          pos: { x: 3, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "31",
          pos: { x: 3, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "32",
          pos: { x: 3, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "33",
          pos: { x: 4, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "34",
          pos: { x: 4, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "35",
          pos: { x: 4, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "36",
          pos: { x: 4, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "37",
          pos: { x: 4, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "38",
          pos: { x: 4, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "39",
          pos: { x: 4, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "40",
          pos: { x: 4, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "41",
          pos: { x: 5, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "42",
          pos: { x: 5, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "43",
          pos: { x: 5, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "44",
          pos: { x: 5, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "45",
          pos: { x: 5, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "46",
          pos: { x: 5, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "47",
          pos: { x: 5, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "48",
          pos: { x: 5, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "49",
          pos: { x: 6, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "50",
          pos: { x: 6, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "51",
          pos: { x: 6, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "52",
          pos: { x: 6, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "53",
          pos: { x: 6, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "54",
          pos: { x: 6, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "55",
          pos: { x: 6, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "56",
          pos: { x: 6, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "57",
          pos: { x: 7, y: 0 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "58",
          pos: { x: 7, y: 1 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "59",
          pos: { x: 7, y: 2 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "60",
          pos: { x: 7, y: 3 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "61",
          pos: { x: 7, y: 4 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "62",
          pos: { x: 7, y: 5 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "63",
          pos: { x: 7, y: 6 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "64",
          pos: { x: 7, y: 7 },
          actorType: "defaultTile",
          team: "none"
        },
        {
          actorId: "65",
          pos: { x: 0, y: 0 },
          actorType: "char",
          team: "red",
          charType: "pawn",
          actions: ["move"],
          static: false,
          moveSpeed: 1
        },
        {
          actorId: "66",
          pos: { x: 5, y: 0 },
          actorType: "char",
          team: "blue",
          charType: "pawn",
          actions: ["move"],
          static: false,
          moveSpeed: 1
        }
      ],
      turn: 0,
      players: [],
      chat: [],
      width: 8,
      height: 8
    };

    const width = 100 / body.width;
    const height = 100 / body.height;

    let actors = body.map.slice();

    /*let xBackend = 0;
    let yBackend = 0;
    for (let xFrontend = 0; xFrontend < 100; xFrontend += width) {
      for (let yFrontend = 0; yFrontend < 100; yFrontend += height) {
        actors.push({
          xBackend,
          yBackend,
          xFrontend,
          yFrontend,
          width,
          height
        });
        yBackend++;
      }
      xBackend++;
    }*/

    console.log("actors: ", actors);
    this.setState({
      loaded: true
    });
    this.props.dispatch(setGameData(actors, width, height));
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
        <svg
          className="gameframe wrapper"
          id="chess-2-canvas"
          /*preserveAspectRatio="xMaxYMax none"
          viewBox="0 0 100 100"*/
        >
          {this.getActorElements()}
        </svg>
        <Menu options={this.props.actionMenuOptions} />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    actionMenuOptions: state.actionMenu.options,
    gameData: state.gameData
  };
};

export default connect(mapStateToProps)(GameFrame);
