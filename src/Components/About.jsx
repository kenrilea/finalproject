import React, { Component } from "react";
import { connect } from "react-redux";

class About extends Component {

   render = () => {
      return (

         <div className="card-container material-shadow animated-fade-in animated-grow-bounce">
            <div className="card-top-cont">
               <h3 className="card-top-label"> About us! </h3>
            </div>
            <div className="card-scrollable-cont">
               <div className="left-marge">Don't believe the facts? Just <a href="https://github.com/kenrilea/finalproject">check out our GitHub repo</a> </div>
            </div>
         </div>

      )
   }

}

export default About