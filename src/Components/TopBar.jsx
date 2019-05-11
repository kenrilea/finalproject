import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "../css/topBar.css"

class TopBar extends Component {

   render = () => {

      return (
         <div className="topBar">
            <div className="title">SUPER CHESS II</div>
            <Link className="link" to={"/leaderboard"}>Leaderboards</Link>
            <Link className="link" to={"/rules"}>How to Play</Link>
            <Link className="link" to={"/about"}>About</Link>
         </div>
      )
   }

}

export default TopBar