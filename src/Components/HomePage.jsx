import React, { Component } from 'react'
import WhatsNew from "./WhatsNew.jsx"
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";


import "../css/main.css"


class UnconnectedHomePage extends Component {
   render = () => {

      if (this.props.loggedIn) {
         return <Redirect to="/lobbies_list" />
      }

      return (
         <div className="animated-fade-in">
            {/* Other content? */}
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
