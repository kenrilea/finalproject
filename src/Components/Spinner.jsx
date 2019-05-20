import React, { Component } from "react";

import "../css/spinner.css"

class Spinner extends Component {

   render = () => {
      return (
         // <div className="card-spinner">
         <div className="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
         </div>
         //  </div> 
      )
   }
}

export default Spinner