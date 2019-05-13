import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameFrame.css";
import Tile from "./Actors/Tile.jsx";
import Pawn from "./Actors/Pawn.jsx";

class GameFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      tiles: []
    };
  }

  componentDidMount = () => {
    const dimensions = { x: 8, y: 8 };
    const width = 100 / dimensions.x;
    const height = 100 / dimensions.y;
    const min = Math.min(width, height);
    let tiles = [];
    for (let x = 0; x < 100; x += width) {
      for (let y = 0; y < 100; y += height) {
        tiles.push({
          x,
          y,
          width,
          height
        });
      }
    }
    console.log("tiles: ", tiles);
    this.setState({
      tiles,
      loaded: true
    });
  };
  render = () => {
    if (!this.state.loaded) return null;

    const tiles = this.state.tiles;
    console.log("tiles[0]: ", tiles[0]);
    return (
      <div className="wrapper">
        <svg
          className="gameframe wrapper"
          id="chess-2-canvas"
          preserveAspectRatio="xMaxYMax none"
        >
          {console.log(this.width)}
          {tiles.map(tile => {
            return (
              <Tile
                key={tile.x + " " + tile.y}
                xFrontend={tile.x}
                yFrontend={tile.y}
                width={tile.width}
                height={tile.height}
              />
            );
          })}
          <Pawn
            key={tiles[0].x + " " + tiles[0].y}
            xFrontend={tiles[0].x}
            yFrontend={tiles[0].y}
            width={tiles[0].width}
            height={tiles[0].height}
          />
        </svg>
      </div>
    );
  };
}

export default GameFrame;
