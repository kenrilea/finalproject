import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "../css/ResponsiveNavBar.css";

class ResponsiveNavBar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         slide: false
      };
   }

   handleSlide = () => {
      this.setState({
         slide: !this.state.slide
      });
   };

   render = () => {
      return (
         <nav className="material-shadow2">
            <div className="logo">
               <h1>
                  <Link
                     to={"/"}
                     style={{ "text-decoration": "none", color: "inherit" }}
                  >
                     SUPER CHESS II
            </Link>
               </h1>
            </div>

            <ul className={this.state.slide ? "nav-active" : "nav-links"}>
               <li className="nav-li">
                  <Link
                     className={this.state.slide ? "nav-link-show" : "nav-link-hide"}
                     to={"/lobbies-list"}
                     onClick={this.handleSlide}
                  >
                     Lobbies
            </Link>
               </li>

               <li className="nav-li">
                  <Link
                     className={this.state.slide ? "nav-link-show" : "nav-link-hide"}
                     to={"/leaderboard"}
                     onClick={this.handleSlide}
                  >
                     Leaderboard
            </Link>
               </li>

               <li className="nav-li">
                  <Link
                     className={this.state.slide ? "nav-link-show" : "nav-link-hide"}
                     to={"/how-to-play/list"}
                     onClick={this.handleSlide}
                  >
                     How to Play
            </Link>
               </li>

               <li className="nav-li">
                  <Link
                     className={this.state.slide ? "nav-link-show" : "nav-link-hide"}
                     to={"/about"}
                     onClick={this.handleSlide}
                  >
                     About
            </Link>
               </li>
            </ul>

            <div className="burger" onClick={this.handleSlide}>
               <div><img className={this.state.slide ? "line1" : "line1-close"} src="../../assets/sword-black.png" alt="Nav Sword" height="4px" width="25px" /></div>
               <div><img className={this.state.slide ? "line2" : "line2-close"} src="../../assets/sword-black.png" alt="Nav Sword" height="4px" width="25px" /> </div>
               <div><img className={this.state.slide ? "line3" : "line3-close"} src="../../assets/sword-black.png" alt="Nav Sword" height="4px" width="25px" /> </div>
            </div>
         </nav>
      );
   };
}

let mapStateToProps = state => {
   return { loggedIn: state.loggedIn };
};

export default connect(mapStateToProps)(ResponsiveNavBar);
