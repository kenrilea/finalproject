import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/cloudHud.css"

class CloudHud extends Component {

   render = () => {

      return (
         <div className="cloud-hud-cont">
            <img src="../../assets/cloud-hud.png" />
            <label className="label1" > 100 </label>
            <label className="label2"> 666 </label>
         </div>
      )
   }
}

export default CloudHud