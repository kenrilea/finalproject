import React, { Component } from "react";
import { connect } from "react-redux";
import socket from "./SocketSettings.jsx"

import "../css/profile.css"

class UnconnectedProfile extends Component {

   constructor(props) {
      super(props)
      this.state = {
         wins: 0,
         losses: 0,
         isLoaded: false,
      }
   }

   componentDidMount = () => {

      // if (!this.state.isLoaded) {
         console.log("ABOUT TO GET SCORE")
         fetch("/get-user-score", {
            method: "GET",
            credentials: "include",
         })
            .then(head => {
               return head.text()
            })
            .then(body => {
               let data = JSON.parse(body)
               console.log("USER SCORE DATA", data)
               this.setState({
                  wins: data.wins,
                  losses: data.losses,
                  isLoaded: true
               })
            })
      // }
   }

   render = () => {

      return (
         <div className="profile animated-fade-in">
            <label className="profile-label">Current User</label>
            <div className="profile-username">{this.props.currentUser}</div>
            <table className="profile-table">
               <thead>
                  <tr className="profile-table-headers">
                     <th className="profile-table-headers">Wins</th>
                     <th className="profile-table-headers">Losses</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td>{this.state.wins}</td>
                     <td>{this.state.losses}</td>
                  </tr>
               </tbody>
            </table>
         </div>
      )
   }
}

let mapStateToProps = state => {
   return {
      currentUser: state.currentUser
   }
}

let Profile = connect(mapStateToProps)(UnconnectedProfile)

export default Profile 