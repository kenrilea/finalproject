import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "../css/topBar.css"

class TopBar extends Component {

   render = () => {

      return (
         <nav className="topBar material-shadow">
            <Link className="link" to={"/"}>SUPER CHESS II</Link>
            <Link className="link" to={"/leaderboard"}>Leaderboard</Link>
            <Link className="link" to={"/rules"}>How to Play</Link>
            <Link className="link" to={"/about"}>About</Link>
         </nav>
      )
   }
}

export default TopBar