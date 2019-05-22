import React, { Component } from "react";

import "../css/cloudsBG.css";

let buttonStyle = {
   display: "block",
   position: "fixed",
   bottom: "30px",
   left: "30px",
   zIndex: "1005",
   width: "145px",
   minWidth: "145px",
   maxWidth: "225px"
};

class CloudsBG extends Component {
   constructor(props) {
      super(props);
      this.state = {
         style: {
            display: "block",
            text: "Hide Clouds"
         }
      };
   }

   handleClouds = () => {
      if (this.state.style.display === "block") {
         this.setState({
            style: {
               display: "none",
               text: "Show Clouds"
            }
         });
      } else {
         this.setState({
            style: {
               display: "block",
               text: "Hide Clouds"
            }
         });
      }
   };

   render = () => {
      return (
         <div>
            <div style={this.state.style} id="background-wrap">
               <div className="x1">
                  <div className="cloud" />
               </div>

               <div className="x2">
                  <div className="cloud" />
               </div>

               <div className="x3">
                  <div className="cloud" />
               </div>

               <div className="x4">
                  <div className="cloud" />
               </div>

               <div className="x5">
                  <div className="cloud" />
               </div>
            </div>
            <button
               style={buttonStyle}
               className="material-button"
               onClick={this.handleClouds}
            >
               {this.state.style.text}
            </button>
         </div>
      );
   };
}

export default CloudsBG;
