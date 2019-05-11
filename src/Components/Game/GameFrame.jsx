import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameFrame.css";

const Sky = () => {
  const skyStyle = {
    fill: "#30abef"
  };
  const skyWidth = 5000;
  const gameHeight = 1500;
  return (
    <rect
      style={skyStyle}
      x={skyWidth / -2}
      y={100 - gameHeight}
      width={skyWidth}
      height={gameHeight}
    />
  );
};

const tiles = () => {
  const dimensions = { x: 8, y: 8 };
  const width = 100 / dimensions.x;
  const height = 100 / dimensions.y;
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
  return tiles;
};

class GameFrame extends Component {
  render = () => {
    return (
      <svg
        className="gameframe wrapper"
        id="chess-2-canvas"
        preserveAspectRatio="xMaxYMax none"
      >
        {tiles().map(tile => {
          const style = {
            fill: "#004400"
            //transform: "rotate3d(0.6, -0.2, 0.2, 75deg)"
          };
          return (
            <rect
              style={style}
              x={tile.x + "%"}
              y={tile.y + "%"}
              width={tile.width + "%"}
              height={tile.height + "%"}
            />
          );
        })}
      </svg>
    );
  };
}

export default GameFrame;
