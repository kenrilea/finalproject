import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Login from "./Login.jsx"
import Signup from "./Signup.jsx"

import "../css/sideBar.css"

class UnconnectedSideBar extends Component {

   constructor(props) {
      super(props)
      this.state = {

      }
   }

   showSignup = () => {
      this.setState({
         signup: true
      })
   }

   render = () => {

      if (this.props.loggedIn === false) {
         return this.notLoggedInSidebar()
      }


   }

   notLoggedInSidebar = () => {

      return (
         <div className="sideBar">
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