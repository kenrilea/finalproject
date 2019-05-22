import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameInfoDisplay.css";

class GameStart extends Component {
  constructor(props) {
    super(props);
    this.rectAnim = React.createRef();
    this.textSvgAnim = React.createRef();
  }

  componentDidMount = () => {
    this.rectAnim.current.beginElement();
    this.textSvgAnim.current.beginElement();
  };

  componentDidUpdate = () => {
    this.rectAnim.current.beginElement();
    this.textSvgAnim.current.beginElement();
  };

  shouldComponentUpdate = nextProps => {
    return this.props.turn !== nextProps.turn;
  };

  getText = () => {
    const currentTurn = this.props.turn;
    if (currentTurn === 0) {
      return "START!";
    } else {
      return "TURN " + currentTurn;
    }
  };

  render = () => {
    console.log("gamestart RENDER!");

    const width = 90;
    const height = 30;
    const x = 50 - width / 2;
    const y = height / 2;

    const animStyle = {
      attributeName: "y",
      values: "-100;" + y.toString() + ";" + y.toString() + ";" + "-100;",
      keyTimes: "0; 0.2; 0.8; 1",
      begin: "indefinite",
      dur: "3s",
      repeatCount: "1"
    };

    return (
      <g className="game-start-group">
        <rect
          id={"game-start-rect" + this.props.turn}
          className="game-start-rect"
          x={x}
          y={"-200"}
          width={width}
          height={height}
        />
        <svg
          id={"game-start-text" + this.props.turn}
          width={width}
          height={height}
          x={x}
          y={"-200"}
        >
          <text
            className="game-start-text"
            x="50%"
            y="50%"
            alignment-baseline="middle"
            text-anchor="middle"
          >
            {this.getText()}
          </text>
        </svg>
        <animate
          ref={this.rectAnim}
          xlinkHref={"#game-start-rect" + this.props.turn}
          attributeName={animStyle.attributeName}
          values={animStyle.values}
          keyTimes={animStyle.keyTimes}
          begin={animStyle.begin}
          dur={animStyle.dur}
          repeatCount={animStyle.repeatCount}
        />
        <animate
          ref={this.textSvgAnim}
          xlinkHref={"#game-start-text" + this.props.turn}
          attributeName={animStyle.attributeName}
          values={animStyle.values}
          keyTimes={animStyle.keyTimes}
          begin={animStyle.begin}
          dur={animStyle.dur}
          repeatCount={animStyle.repeatCount}
        />
      </g>
    );
  };
}

let mapStateToProps = state => {
  return {
    gameData: state.gameData
  };
};

export default connect(mapStateToProps)(GameStart);
