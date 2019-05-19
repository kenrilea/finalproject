import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

import "../css/sideBar.css";
import Profile from "./Profile.jsx";

import { Animate } from "react-animate-mount"

class UnconnectedSideBar extends Component {
   constructor(props) {
      super(props);
      this.state = {
         show: false
      };
   }

   signout = () => {
      this.props.dispatch({
         type: "SIGN-OUT",
         toggle: false
      });

      fetch("/logout", {
         credentials: "include"
      });
   };

   loggedInSidebar = () => {
      return (
         <div className="sideBar animated-fade-in material-shadow">
            <Profile />
            <Link className="material-button top-marge" to="/army-builder">Army Builder </Link>
            <button className="material-button signout-button top-marge" onClick={this.signout} >
               Sign Out
            </button>
         </div>
      );
   };

   notLoggedInSidebar = () => {
      return (
         <div className="animated-fade-in sideBar material-shadow">
            <div className="sideBarForm">
               <Login />
               <Signup className="animated-fade-in show-button" />
            </div>
         </div>
      );
   };

   handleShow = () => {
      this.setState({
         show: !this.state.show
      })
   }

   render = () => {
      if (this.props.loggedIn === false) {
         return (
            <div>
               <button onClick={this.handleShow} className="material-button show-button "> LOGIN </button>
               <Animate show={this.state.show} >
                  {this.notLoggedInSidebar()}
               </Animate>
            </div>
         )
      }
      else {
         return (
            <div>
               <button onClick={this.handleShow} className="material-button show-button"> PROFILE </button>
               <Animate show={this.state.show}>
                  {this.loggedInSidebar()}
               </Animate>
            </div>
         )
      }

   };
}

const mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn,
      currentUser: state.currentUser
   };
};

let SideBar = connect(mapStateToProps)(UnconnectedSideBar);

export default SideBar;
