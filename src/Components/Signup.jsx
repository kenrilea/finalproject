import React, { Component } from "react";
import { connect } from "react-redux";
import Popup from "reactjs-popup";

import "../css/signup.css"

class Signup extends Component {

   constructor(props) {
      super(props)
      this.state = {
         username: "",
         password: "",
         country: "",
      }
   }

   handleUsername = event => {
      this.setState({
         username: event.target.value
      })
   }

   handlePassword = event => {
      this.setState({
         password: event.target.value
      })
   }

   handleCountry = event => {
      this.setState({
         country: event.target.value
      })
   }

   handleSubmit = event => {
      event.preventDefault()
      let data = new FormData()
      data.append("username", this.state.username)
      data.append("password", this.state.password)
      data.append("country", this.state.country)
      data.append("joinedDate", new Date())

      fetch("/signup", {
         method: "POST",
         body: data
      })
         .then(resHeader => {
            return resHeader.text()
         })
         .then(resBody => {
            let body = JSON.parse(resBody)

            if (!body.success) {
               console.log("Error creating account!")
               return;
            }

            this.props.dispatch({
               type: "logged-in",
               toggle: true,
               username: this.props.username
            })

         })
   }

   render = () => {
      return (
         <Popup trigger={<button className="ghost-button">Sign up!</button>} position="bottom center" modal>
            <div className="signup-container">
               <form className="" onSubmit={this.handleSubmit}>
                  <div className="signup-label">Create an account</div>
                  <div className="signup-label">Username</div>
                  <input className="signup-input" type="text" onChange={this.handleUsername} required={true} />
                  <div className="signup-label">Password</div>
                  <input className="signup-input" type="text" onChange={this.handlePassword} required={true} />
                  <div className="signup-label">Country</div>
                  <input className="signup-input" type="text" onChange={this.handleCountry} required={true} />
                  <div>
                     <input className="ghost-button-dark bottom-margin" type="submit" value="I'm Ready!" />
                  </div>
               </form>
            </div>
         </Popup >
      )
   }
}

export default Signup