import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/profile.css"

class UnconnectedProfile extends Component {


   render = () => {

      return (
         <div className="profile">
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
                     <td>0</td>
                     <td>0</td>
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