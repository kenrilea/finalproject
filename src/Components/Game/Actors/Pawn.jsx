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
    return (
      <image
        xlinkHref="/assets/char-pawn-blue.png"
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
