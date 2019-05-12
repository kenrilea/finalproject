import React, { Component } from "react";
import { connect } from "react-redux";
import "./../../css/gameFrame.css";

import { update } from "./../../Actions";

import GameDisplay from "./GameDisplay.jsx";

import {
  getThreeCamera,
  getThreeRenderer,
  getThreeScene
} from "./../../ThreeApp/threeApp.js";

import { mapStateToScene } from "./../../ThreeApp/threeHelpers.js";

class GameFrame extends Component {
  renderNextFrame = () => {
    this.threeRenderer.render(this.scene, this.camera);
    requestAnimationFrame(timestamp => this.props.update(timestamp));
  };

  componentDidMount() {
    this.scene = getThreeScene();
    this.camera = getThreeCamera();
    this.threeRenderer = getThreeRenderer();

    this.renderNextFrame();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.lastAction === "UPDATE";
  }

  componentWillUpdate() {
    mapStateToScene(this.props.sceneState, this.scene);
    this.renderNextFrame();
  }

  render = () => {
    return (
      <div className="gameframe wrapper">
        <GameDisplay />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    timestamp: state.timestamp,
    lastAction: state.lastAction,
    sceneState: state.scene
  };
};

const mapDispatchTopProps = dispatch => {
  return {
    update: timestamp => dispatch(update(timestamp))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchTopProps
)(GameFrame);
