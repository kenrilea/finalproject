import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu } from "./../../../Actions";

class Tile extends Component {
  componentDidMount = () => {};

  handleClick = event => {
    event.stopPropagation();
    console.log("Tile: ");
    console.log(this.props.xBackend);
    console.log(this.props.yBackend);
    console.log(this.props.xFrontend);
    console.log(this.props.yFrontend);
    console.log(this.props.width);
    console.log(this.props.height);

    if (this.props.visible) {
      this.props.dispatch(setActionMenu(false, 0, 0, []));
    }
  };

  render = () => {
    const style = {
      fill: "#004400"
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

const mapStateToProps = state => {
  return {
    visible: state.actionMenu.visible
  };
};

export default connect(mapStateToProps)(Tile);
