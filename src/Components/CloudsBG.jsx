import React, { Component } from "react";

import "../css/cloudsBG.css"

let buttonStyle = {
   display: "block",
   position: "absolute",
   bottom: "-775px",
   left: "25px",
   "z-index": "999"
}

class CloudsBG extends Component {

   constructor(props) {
      super(props)
      this.state = {
         style: {
            display: "block"
         }
      }
   }

   handleClouds = () => {
      if (this.state.style.display === "block") {
         this.setState({
            style: {
               display: "none"
            }
         })
      }
      else {
         this.setState({
            style: {
               display: "block"
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
            <button style={buttonStyle} className="material-button" onClick={this.handleClouds}>Hide Clouds</button>
         </div>
      )

   }
}

export default CloudsBG