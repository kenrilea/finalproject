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
        <div className={"unitDetailsCont"}>
          <h2 className={"unitHeading"}>Pawn</h2>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Move: </span>pawns can move one tile
            in any direction per turn. If a pawn moves onto a tile occupied by a
            non-friendly unit, that non-friendly unit will be destroyed. Pawns
            cannot move onto tiles occupied by friendly units
          </p>
          <div className={"unitActionImageCont"}>
            <img src="/assets/how-to-play/pawnA.png" />
          </div>
        </div>
        <div>
          <h2 className={"unitHeading"}>Tank</h2>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Move: </span>Tanks move one tile per
            turn. If a tank moves onto a tile occupied by a non-friendly unit,
            both the tank and the non-friendly unit will be destroyed. Tanks
            cannot move onto tiles occupied by friendly units
          </p>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Well Armored (passive): </span>{" "}
            Tanks are well armoured and therefore will not be destroyed by
            arrows. Place tanks between enemy archers and friendly units to
            shield your units.
          </p>
          <div className={"unitActionImageCont"}>
            <img src="/assets/how-to-play/tankA.png" />
            <img src="/assets/how-to-play/tankB.png" />
          </div>
        </div>
        <div className={"unitDetailsCont"}>
          <h2 className={"unitHeading"}>Archer</h2>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Move-Passive: </span>Archers can
            move one tile per turn. Archers can not move onto tiles with enemy
            units, they instead destroy enemy units by preforming a ranged-shot
            action.
          </p>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Ranged-Shot: </span>Ranged-shot will
            destroy the first enemy unit within 3 tiles in a straight line
            unless the unit is a tank as tanks cannot be destroyed by the
            ranged-shot ability.
          </p>
          <div className={"unitActionImageCont"}>
            <img src="/assets/how-to-play/archerA.png" />
            <img src="/assets/how-to-play/archerB.png" />
          </div>
        </div>
        <div className={"unitDetailsCont"}>
          <h2 className={"unitHeading"}>Knight</h2>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Move: </span>Knights can move one
            tile in any direction per turn. If a Knight moves onto a tile
            occupied by a non-friendly unit, that non-friendly unit will be
            destroyed. Pawns cannot move onto tiles occupied by friendly units
          </p>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Charge: </span>Charge will move the
            Knight by 3 tiles in a straight line. If there is an enemy unit on a
            tile the knight passes through it will be destroyed. At most charge
            can destroy 3 enemy units.
          </p>
          <div className={"unitActionImageCont"}>
            <img src="/assets/how-to-play/knightA.png" />
            <img src="/assets/how-to-play/knightb.png" />
          </div>
        </div>
        <div className={"unitDetailsCont"}>
          <h2 className={"unitHeading"}>Grenadier</h2>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Move-Passive: </span>Grenadiers can
            move one tile per turn. Grenadiers can not move onto tiles with
            enemy units, they instead destroy enemy units by preforming a
            ranged-shot action.
          </p>
          <p className={"unitActionText"}>
            <span className={"abilityName"}>Bombard: </span>Bombard is a ranged
            ability that targets a tile, it cannot be blocked and will destroy
            any enemy unit on that tile. Bombard cannot strike adjacent tiles
            and it has a max range of between 2 and 3 tiles. This ability is
            currently overpowered.
          </p>
          <div className={"unitActionImageCont"}>
            <img src="/assets/how-to-play/catapultA.png" />
            <img src="/assets/how-to-play/catapultB.png" />
          </div>
        </div>
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
