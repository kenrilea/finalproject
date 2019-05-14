import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/leaderboard.css"

import mockLeaderboardData from "./mockLeaderboardData.jsx"

class Leaderboard extends Component {

   constructor(props) {
      super(props)
      this.state = {
         leaderboard: []
      }
   }

   componentDidMount = () => {

      fetch("/get-leaderboard")
         .then(resHead => {
            return resHead.text()
         })
         .then(resBody => {
            let parsed = JSON.parse(resBody)

            this.setState({
               leaderboard: parsed
            })
         })

   }

   render = () => {
      { console.log("State : ", this.state) }
      {
         if (this.state.leaderboard.length === 0) {
            return (
               <div className="lobbies-list-background">
                  <div className="lobbies-list-foreground">
                     Loading...
               </div>
               </div>
            )
         }
      }

      return (
         <div className="lobbies-list-background">
            <div className="animated-fade-in lobbies-list-foreground material-shadow">
               <div id="scrolltable">
                  <table className="leader-table">
                     <thead className="leader-header">
                        <tr className="leader-row">
                           <th className="leader-entry">Standing</th>
                           <th className="leader-entry">Username</th>
                           <th className="leader-entry">Rank</th>
                           <th className="leader-entry">Wins</th>
                           <th className="leader-entry">Country</th>
                        </tr>
                     </thead>
                     <tbody className="leader-body">
                        {this.state.leaderboard.map((user, standing) => {
                           return (
                              <tr className="leader-row">
                                 <td className="leader-entry">{standing + 1}</td>
                                 <td className="leader-entry">{user.username}</td>
                                 <td className="leader-entry">{user.rank}</td>
                                 <td className="leader-entry">{user.wins}</td>
                                 <td className="leader-entry">{user.country}</td>
                              </tr>
                           )
                        })}
                        <tr className="leader-row">
                           <td className="leader-entry"></td>
                           <td className="leader-entry">END OF LIST</td>
                           <td className="leader-entry"></td>
                           <td className="leader-entry"></td>
                           <td className="leader-entry"></td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      )
   }
}

export default Leaderboard