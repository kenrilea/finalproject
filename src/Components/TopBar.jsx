import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "../css/topBar.css";

class TopBar extends Component {
  render = () => {
    return (
      <div className="topBar material-shadow">
        <Link className="link" to={"/"}>
          SUPER CHESS II
        </Link>
        <Link className="link" to={"/leaderboard"}>
          Leaderboard
        </Link>
        <Link className="link" to={"/how-to-play/start"}>
          How to Play
        </Link>
        <Link className="link" to={"/about"}>
          About
        </Link>
      </div>
    );
  };
}

export default TopBar;
