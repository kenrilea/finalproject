import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Login from "./Login.jsx"

import "../css/sideBar.css"

class SideBar extends Component {

   constructor(props) {
      super(props)
      this.state = {
         signup: false
      }
   }

   showSignup = () => {
      this.setState({
         signup: true
      })
   }

   render = () => {

      if (!this.state.signup) {
         return (
            <div className="sideBar">
               <div className="sideBarForm">
                  <Login />
                  <button onClick={this.showSignup}>Sign up!</button>
               </div>
            </div>
         )
      }
      else if (this.state.signup)
         return (
            <div className="sideBar">
               <div className="sideBarForm">
                  <Login />
               </div>
               <div className="sideBarForm">
                  <Login />
               </div>
            </div>
         )
   }


}

export default SideBar