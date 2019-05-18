import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "../css/ResponsiveNavBar.css"

class ResponsiveNavBar extends Component {

   constructor(props) {
      super(props)
      this.state = {
         slide: false
      }
   }


   handleSlide = () => {
      this.setState({
         slide: !this.state.slide
      })
   }

   render = () => {

      return (
         <nav className="material-shadow">

            <div className="logo">
               <h1>SUPER CHESS II</h1>
            </div>

            <ul className={this.state.slide ? "nav-active" : "nav-links"}>
               <li>
                  <Link className={this.state.slide ? "nav-link-show" : "nav-link-hide"} to={"/"} onClick={this.handleSlide}>Lobbies</Link>
               </li>
               <li>
                  <Link className={this.state.slide ? "nav-link-show" : "nav-link-hide"} to={"/leaderboard"} onClick={this.handleSlide}>Leaderboard</Link>
               </li>
               <li>
                  <Link className={this.state.slide ? "nav-link-show" : "nav-link-hide"} to={"/how-to-play"} onClick={this.handleSlide}>How to Play</Link>
               </li>
               <li>
                  <Link className={this.state.slide ? "nav-link-show" : "nav-link-hide"} to={"/about"} onClick={this.handleSlide}>About</Link>
               </li>
            </ul>

            <div className="burger" onClick={this.handleSlide}>
               <div className={this.state.slide ? "line1" : "line1-close"}></div>
               <div className={this.state.slide ? "line2" : "line2-close"}></div>
               <div className={this.state.slide ? "line3" : "line3-close"}></div>
            </div>

         </nav>
      )
   }
}

export default ResponsiveNavBar