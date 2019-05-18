import React, { Component } from "react";
import { Link } from "react-router-dom";

class Oops extends Component {
   render = () => {
      return (
         <div className="card-container material-shadow animated-grow-bounce animated-fade-in">
            <div className="card-top-cont">
               <h3 className="card-top-label">Oops! </h3>
            </div>
            Click <Link to={"/"}>here</Link> to go back.
         </div>
      );
   };
}

export default Oops;
