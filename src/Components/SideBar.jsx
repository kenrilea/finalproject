import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Login from "./Login.jsx"
import Signup from "./Signup.jsx"

import "../css/sideBar.css"
import Profile from "./Profile.jsx";

class UnconnectedSideBar extends Component {

   constructor(props) {
      super(props)
      this.state = {

      }
   }

   signout = () => {
      this.props.dispatch({
         type: "SIGN-OUT",
         toggle: false
      })
   }

   render = () => {

      if (this.props.loggedIn === false) {
         return this.notLoggedInSidebar()
      }
      else {
         return this.loggedInSidebar()
      }
   }

   loggedInSidebar = () => {
      return (
         <div className="w3-animate-left sideBar">
            <Profile />
            <button className="ghost-button signout-button" onClick={this.signout}>Sign Out</button>
         </div>
      )
   }

   notLoggedInSidebar = () => {
      return (
         <div className="w3-animate-left sideBar">
            <div className="sideBarForm">
               <Login />
               <Signup />
            </div>
         </div>
      )
   }

}



const mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn
   }
}

let SideBar = connect(mapStateToProps)(UnconnectedSideBar)

export default SideBar