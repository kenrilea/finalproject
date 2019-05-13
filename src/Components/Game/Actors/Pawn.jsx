import React, { Component } from "react";
import { connect } from "react-redux";
import { setActionMenu } from "./../../../Actions";

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

    if (this.props.visible) {
      this.props.dispatch(setActionMenu(false, 0, 0, []));
    } else {
      this.props.dispatch(
        setActionMenu(
          true,
          this.props.xFrontend, // Not being used right now.
          this.props.yFrontend, // Not being used right now.
          [
            {
              text: "Option 1",
              callbackFunc: () => console.log("hiya!")
            },
            {
              text: "Option 2",
              callbackFunc: () => console.log("heyo!")
            },
            {
              text: "Option 3",
              callbackFunc: () => console.log("heyo!")
            },
            {
              text: "Option 4",
              callbackFunc: () => console.log("heyo!")
            },
            {
              text: "Option 5",
              callbackFunc: () => console.log("heyo!")
            }
          ]
        )
      );
    }
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

const mapStateToProps = state => {
  return {
    visible: state.actionMenu.visible,
    numActions: state.actionMenu.options.length
  };
};

export default connect(mapStateToProps)(Pawn);
