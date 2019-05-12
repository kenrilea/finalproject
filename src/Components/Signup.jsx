import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/signup.css"

class Signup extends Component {



   render = () => {
      return (
         <div className="signup-container">
            <form className="signup-form">
               <div className="signup-label">Create an account</div>
               <input className="signup-input" type="text" />
               <input className="signup-input" type="text" />
               <input className="signup-input" type="text" />
               <input className="signup-input" type="country" />
               <input className="ghost-button-dark" type="submit" />
            </form>
         </div>
      )
   }
}

export default Signup