import React, { Component } from 'react'
import WhatsNew from "./WhatsNew.jsx"
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";




import "../css/main.css"


class UnconnectedHomePage extends Component {

   // checkAutoLogin = () => {

   //    fetch("/verify-cookie2", { credentials: "include" })
   //       .then(res => {
   //          return res.text();
   //       })
   //       .then(resBody => {
   //          let parsedBody = JSON.parse(resBody);
   //          if (typeof parsedBody !== "object") {
   //             console.log("autologin fetch needs to return an object");
   //          }
   //          if (parsedBody.success === true) {
   //             console.log("Automatically logged in user");
   //             console.log(parsedBody);
   //             this.props.dispatch({
   //                type: "logged-in",
   //                toggle: true,
   //                username: parsedBody.username
   //             });
   //          }
   //       });
   // }

   componentDidMount = () => {
      // this.checkAutoLogin()
   }

   render = () => {

      if (this.props.loggedIn) {
         return <Redirect to="/lobbies_list" />
      }

      return (
         <div className="animated-fade-in">

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
