import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/about.css"

class About extends Component {

   render = () => {
      return (
         <div className="lobbies-list-background">
            <div className="lobbies-list-foreground material-shadow animated-fade-in">
               <h3> About us! </h3>
               <div>This our about page. Wow!</div>
            </div>
         </div>
      )
   }

}

export default About