import React, { Component } from "react";
import { connect } from "react-redux";
import socket from "./SocketSettings.jsx"

import "../css/profile.css"

class UnconnectedProfile extends Component {

   constructor(props) {
      super(props)

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
                     <td>{this.props.wins}</td>
                     <td>{this.props.losses}</td>
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