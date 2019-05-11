import React, { Component } from "react";
import { connect } from "react-redux";
import "./../css/animatedMessage.css";

class UnconnectedAnimatedMessage extends Component {
  /*componentWillReceiveProps = () => {
    this.startTimeout(5000)
  };*/

  startTimeout = ms => {
    if (this.props.message === "") return;

    console.log("start timeout!");

    setTimeout(() => {
      this.props.dispatch({
        type: "show-message",
        message: ""
      });

      console.log("timed out!");
    }, ms);
  };

  render = () => {
    if (this.props.message === "") {
      return null;
    }
    console.log("Animated message: " + this.props.message);

    this.startTimeout(2000);

    return <div className="animated-message">{this.props.message}</div>;
  };
}

let mapStateToProps = state => {
  return {
    message: state.message
  };
};

let AnimatedMessage = connect(mapStateToProps)(UnconnectedAnimatedMessage);

export default AnimatedMessage;
