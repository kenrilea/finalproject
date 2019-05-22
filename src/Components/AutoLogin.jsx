import { Component } from "react";
import { connect } from "react-redux";
import socket from "./SocketSettings.jsx";

class UnconnectedAutoLogin extends Component {
   componentDidMount = () => {
      //If not loggedIn in props, check if the cookie is valid!
      if (!this.props.loggedIn) {
         fetch("/verify-cookie", { credentials: "include" })
            .then(res => {
               return res.text();
            })
            .then(resBody => {
               let parsedBody = JSON.parse(resBody);
               if (!parsedBody.success) {
                  console.log("Auto-Login DENIED - Invalid cookie");
                  return;
               }
               console.log(`Automatically logging in ${parsedBody.username}`);
               console.log(parsedBody);
               this.props.dispatch({
                  type: "logged-in",
                  toggle: true,
                  username: parsedBody.username
               });
               socket.close()
               socket.open()
            });
      }
   };

   render = () => {
      return null;
   };
}

let mapStateToProps = state => {
   return {
      loggedIn: state.loggedIn
   };
};

let AutoLogin = connect(mapStateToProps)(UnconnectedAutoLogin);

export default AutoLogin;
