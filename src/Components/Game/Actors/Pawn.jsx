import React, { Component } from "react";

class Pawn extends Component {
  componentDidMount = () => {};

  handleClick = () => {
    event.stopPropagation();
    console.log("Pawn: ");
    console.log(this.props.xBackend);
    console.log(this.props.yBackend);
    console.log(this.props.xFrontend);
    console.log(this.props.yFrontend);
    console.log(this.props.width);
    console.log(this.props.height);
  };

  render = () => {
    const style = {
      fill: "#0044ff"
      //transform: "rotate3d(0.6, -0.2, 0.2, 75deg)"
    };

    return (
      <rect
        style={style}
        x={this.props.xFrontend + "%"}
        y={this.props.yFrontend + "%"}
        width={this.props.width + "%"}
        height={this.props.height + "%"}
        onClick={this.handleClick}
      />
    );
  };
}

export default Pawn;
