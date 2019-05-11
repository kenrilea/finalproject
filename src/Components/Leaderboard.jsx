import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/leaderboard.css"

import mockLeaderboardData from "./mockLeaderboardData.jsx"

class Leaderboard extends Component {


   render = () => {
      return (
         <div>
            <h2 className="center-text">Leaderboard!</h2>
            <div id="scrolltable">
               <table>
                  <thead>
                     <tr>
                        <th> </th>
                        <th>Username</th>
                        <th>Wins</th>
                        <th>Country</th>
                     </tr>
                  </thead>
                  <tbody>
                     {mockLeaderboardData.map((user, rank) => {
                        return (
                           <tr>
                              <td>{rank + 1}</td>
                              <td>{user.username}</td>
                              <td>{user.wins}</td>
                              <td>{user.country}</td>
                           </tr>
                        )
                     })}
                     <tr>
                        <td> END OF LIST</td>
                        <td></td>
                        <td></td>
                        <td></td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      )
   }
}

export default Leaderboard