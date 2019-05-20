import React, { Component } from 'react'
import WhatsNew from "./WhatsNew.jsx"
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import CloudHud from "./CloudHud.jsx"

import "../css/main.css"


class UnconnectedHomePage extends Component {


   componentDidMount = () => {
      // this.checkAutoLogin()
   }

   render = () => {

      if (this.props.loggedIn) {
         return <Redirect to="/lobbies-list" />
      }

      return (
         <div className="animated-fade-in">
            <CloudHud />
            <WhatsNew />
         </div>
      );
   }
}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn
   }
}

let HomePage = connect(mapStateToProps)(UnconnectedHomePage)


export default HomePage
