import React, { Component } from "react";

import "../css/cloudsBG.css"

let buttonStyle = {
   display: "block",
   position: "fixed",
   bottom: "-775px",
   left: "30px",
   "zIndex": "999",
   width: "145px"
}

class CloudsBG extends Component {

   constructor(props) {
      super(props)
      this.state = {
         style: {
            display: "block",
            text: "Hide Clouds"
         }
      }
   }

   handleClouds = () => {
      if (this.state.style.display === "block") {
         this.setState({
            style: {
               display: "none",
               text: "Show Clouds"
            }
         })
      }
      else {
         this.setState({
            style: {
               display: "block",
               text: "Hide Clouds"
            }
         })
      }
   }



   render = () => {
      return (
         <div>
            <div style={this.state.style} id="background-wrap">

               <div className="x1">
                  <div className="cloud"></div>
               </div>

               <div className="x2">
                  <div className="cloud"></div>
               </div>

               <div className="x3">
                  <div className="cloud"></div>
               </div>

               <div className="x4">
                  <div className="cloud"></div>
               </div>

               <div className="x5">
                  <div className="cloud"></div>
               </div>

            </div>
            <button style={buttonStyle} className="material-button" onClick={this.handleClouds}>{this.state.style.text}</button>
         </div>
      )

   }
}

export default CloudsBG