import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "./../css/howToPlay.css";

let maxStep = 5;

class UnconnectedHowToPlay extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: "none", newStep: 1 };
  }

  componentDidMount = () => {
    console.log();
  };

  renderStep = () => {
    let step = this.props.match.params.step;
    console.log(step);
    if (step === "links") {
      return this.renderLinks();
    }
    if (step === "before-playing") {
      return this.renderBeforePlaying();
    }
    if (step === "lobbies") {
      return this.renderLobbies();
    }
    if (step === "joining-a-game") {
      return this.renderJoiningAGame();
    }
    if (step === "unit-types") {
      return this.renderUnitTypes();
    }
  };
  handlerPrev = event => {
    event.stopPropagation();
    let newStep = parseInt(this.props.match.params.step) - 1;
    if (newStep < 1) {
      newStep = 1;
    }
    this.setState({ redirect: true, newStep });
  };
  handlerNext = event => {
    event.stopPropagation();
    let newStep = parseInt(this.props.match.params.step) + 1;
    if (newStep > maxStep) {
      newStep = maxStep;
    }
    this.setState({ redirect: true, newStep });
  };
  handlerKeyPress = event => {
    console.log(event);
  };
  renderLinks = () => {
    return (
      <div>
        <div className={"card-top-container"}>
          <h1 className={"card-top-label"}>How to Play</h1>
          <p className="card-top-sub-label">Click to learn more</p>
        </div>

        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/before-playing"}
        >
          Before you play
        </Link>

        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/joining-a-game"}
        >
          Joining a game
        </Link>
        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/before-playing"}
        >
          ArmyBuilder
        </Link>
        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/playing-a-game"}
        >
          Playing a game
        </Link>
        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/additional-features"}
        >
          Additional features
        </Link>
      </div>
    );
  };
  renderBeforePlaying = () => {
    return (
      <div>
        <h2 className={"card-top-label sectionHeading"}>Before Playing</h2>
        <p className={"sectionText"}>First you will need an account</p>
        <p> </p>
        <p className={"sectionText"}>
          Click on <span className={"material-fake-button"}>Signup</span> to
          create an account
        </p>
        <p className={"sectionText"}>
          Enter a username, password and then select your region
        </p>

        <p className={"sectionText"}>
          Once you are ready, press{" "}
          <span className={"material-fake-button"}>I'm Ready</span>
        </p>
        <img className={"sectionText"} src={"/assets/how-to-play/signup.png"} />

        <p className={"sectionText"}>
          Now you are ready to start playing!
          <Link
            className={"howToPlayLink material-button"}
            to={"/how-to-play/joining-a-game"}
          >
            Next
          </Link>
        </p>
      </div>
    );
  };
  renderJoiningAGame = () => {
    return (
      <div>
        <p>click on Lobbies in the top bar</p>
        <p>this will bring up the lobbies window</p>
        <img src={"/assets/default-user.png"} />
        <p>
          create a lobby by clicking on{" "}
          <span className={"round-fake-button"}>+</span>
        </p>

        <p>
          join an existing lobby by clicking on{" "}
          <span className={"material-fake-button green-fake"}>join</span>
        </p>
        <Link
          className={"howToPlayLink material-button"}
          to={"/how-to-play/lobbies"}
        >
          Next
        </Link>
      </div>
    );
  };
  renderLobbies = () => {
    return (
      <div>
        <p>press ready up when you are ready to play.</p>
        <img src={"/assets/default-user.png"} />
        <p>once both players are ready the game will start</p>
        <Link className={"howToPlayLink material-button"} to={"/how-to-play/"}>
          Next
        </Link>
      </div>
    );
  };
  renderUnitTypes = () => {
    return (
      <div>
        <img className={"sectionText"} src={"/assets/how-to-play/signup.png"} />
      </div>
    );
  };
  render = () => {
    return (
      <div className={"card-container material-shadow howToPlay-mainDiv"}>
        {this.renderStep()}
      </div>
    );
  };
}
let HowToPlay = connect()(UnconnectedHowToPlay);
export default HowToPlay;
