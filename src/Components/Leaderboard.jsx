import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/leaderboard.css";

import mockLeaderboardData from "./mockLeaderboardData.jsx";

import socket from "./SocketSettings.jsx"

import Spinner from "./Spinner.jsx"

class Leaderboard extends Component {
   constructor(props) {
      super(props);
      this.state = {
         leaderboard: []
      };
   }

   componentDidMount = () => {

      socket.open()

      socket.on("leaderboard-data", data => {
         console.log("Receiving leaderboard from socket: ", data)
         this.setState({
            leaderboard: data
         })
      })

      setTimeout(() => {
         socket.emit("refresh-leaderboard-data")
      }, 700)

   };

   getRank = wins => {

      let rank
      switch (true) {

         case wins < 5:
            rank = "Noob Scrubber"
            break;
         case wins < 10:
            rank = "Super Scrub"
            break;
         case wins < 15:
            rank = "Master Noob"
            break;
         case wins < 20:
            rank = "Explorer"
            break;
         case wins < 25:
            rank = "Chief"
            break;
         case wins < 30:
            rank = "Conqueror"
            break;
         case wins < 35:
            rank = "Emperor"
            break;
         case wins < 40:
            rank = "Master"
            break;
         case wins < 45:
            rank = "Super Master"
            break;
         case wins < 50:
            rank = "Chess God"
            break;
         case wins > 50:
            rank = "Super Chess God"
            break;
         default:
            rank = "default"
            break;
      }

      return rank
   }

   render = () => {

      {
         if (this.state.leaderboard.length === 0) {
            return (
               <Spinner />
            );
         }
      }

      return (

         <div className="animated-fade-in animated-grow-bounce card-container material-shadow">

            <div className="card-top-cont">
               <label className="card-top-label"> Leaderboard </label>
            </div>

            <div id="scrolltable">
               <table className="leader-table">
                  <thead className="leader-header">
                     <tr className="leader-row">
                        <th className="leader-entry">Standing</th>
                        <th className="leader-entry">Username</th>
                        <th className="leader-entry">Rank</th>
                        <th className="leader-entry">Wins</th>
                        <th className="leader-entry">Losses</th>
                        <th className="leader-entry">Country</th>
                     </tr>
                  </thead>
                  <tbody className="leader-body">
                     {this.state.leaderboard.map((user, standing) => {
                        return (
                           <tr key={user.username + user.rank} className="leader-row">
                              <td className="leader-entry">{standing + 1}</td>
                              <td className="leader-entry">{user.username}</td>
                              <td className="leader-entry">{this.getRank(user.wins)}</td>
                              <td className="leader-entry">{user.wins}</td>
                              <td className="leader-entry">{user.losses}</td>
                              <td className="leader-entry">{user.country}</td>
                           </tr>
                        );
                     })}
                     <tr className="leader-row">
                        <td className="leader-entry" />
                        <td className="leader-entry">END OF LIST</td>
                        <td className="leader-entry" />
                        <td className="leader-entry" />
                        <td className="leader-entry" />
                        <td className="leader-entry" />
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

      );
   };
}

export default Leaderboard;

