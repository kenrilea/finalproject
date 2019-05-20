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
    let step = parseInt(this.props.match.params.step);
    if (step === 1) {
      console.log("here");
      return (
        <div>
          <h2>{"step: " + this.props.match.params.step}</h2>
          <h3>welcome to Joa Online.</h3>
          <p>
            joa online is a turn based strategy game. Here you will be given a
            tutorial on how to play!
          </p>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div>
          <h2>{"step: " + this.props.match.params.step}</h2>
          <h3>Creating a new game</h3>
          <p>click on the create a new game</p>
        </div>
      );
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
          to={"/how-to-play/before-you-play"}
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
          to={"/how-to-play/before-you-play"}
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
  renderBeforeYouPlay = () => {
    return (
      <div>
        <p>First you will need an account</p>
        <p>
          click on the <span className={"material-fake-button"}>Signup</span>{" "}
          button to create an account
        </p>
        <p>enter a username, password and then select your region</p>
        <img src={"/assets/default-user.png"} />
        <p>once you are ready, press the "I'm Ready" button</p>
        <p>
          at this point you are ready to start playing!
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
  render = () => {
    return (
      <div className={"card-container material-shadow howToPlay-mainDiv"}>
        {this.renderLobbies()}
      </div>
    );
  };
}
let HowToPlay = connect()(UnconnectedHowToPlay);
export default HowToPlay;
