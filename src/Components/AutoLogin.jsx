import { Component } from "react";
import { connect } from "react-redux";

class UnconnectedAutoLogin extends Component {
  componentDidMount = () => {
    fetch("/verify-cookie", { credentials: "include" })
      .then(res => {
        return res.text();
      })
      .then(resBody => {
        let parsedBody = JSON.parse(resBody);
        if (typeof parsedBody !== "object") {
          console.log("autologin fetch needs to return an object");
        }
        if (parsedBody.success === true) {
          console.log("!!!!!!!!!!!!!!!!! LOGGED IN !!!!!!!!!!!!!!!!!!!!!!");
          console.log(parsedBody);
          this.props.dispatch({
            type: "logged-in",
            toggle: true,
            username: parsedBody.username
          });
        }
      });
  };
  render = () => {
    return null;
  };
}
let AutoLogin = connect()(UnconnectedAutoLogin);
export default AutoLogin;
