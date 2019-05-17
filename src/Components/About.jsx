import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/about.css"

class About extends Component {

   render = () => {
      return (
         <div className="lobbies-list-background">
            <div className="card-container material-shadow animated-fade-in animated-grow-bounce">
               <h3 className="about-top-label"> About us! </h3>
               <div>Don't believe the facts? Just <a href="https://github.com/kenrilea/finalproject">check out our GitHub repo</a> </div>
            </div>
         </div>
      )
   }

}

export default About