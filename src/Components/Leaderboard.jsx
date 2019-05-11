import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/leaderboard.css"

import mockLeaderboardData from "./mockLeaderboardData.jsx"

class Leaderboard extends Component {


   render = () => {
      return (
         <div>
            <h2 className="center-text">Leaderboard!</h2>
            <table>
               <tr>
                  <th>Username</th>
                  <th>Wins</th>
                  <th>Country</th>
               </tr>
               {mockLeaderboardData.map(user => {
                  return (
                     <tr>
                        <th>{user.username}</th>
                        <th>{user.wins}</th>
                        <th>{user.country}</th>
                     </tr>
                  )
               })}
            </table>
         </div>
      )
   }
}

export default Leaderboard