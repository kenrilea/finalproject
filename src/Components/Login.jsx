import React, { Component } from "react";
import { connect } from "react-redux";

import socket from "./SocketSettings.jsx";

import "../css/login.css";

class UnconnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsername = event => {
    this.setState({
      username: event.target.value
    });
  };

  handlePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);

    fetch("/login", {
      method: "POST",
      body: data
    })
      .then(resHeader => {
        return resHeader.text();
      })
      .then(resBody => {
        let body = JSON.parse(resBody);

        if (!body.success) {
          console.log(body);
          this.props.dispatch({
            type: "show-message",
            message: "Login not successful. Please try again"
          });
          return;
        }

        this.props.dispatch({
          type: "logged-in",
          toggle: true,
          username: this.state.username
        });
        this.props.dispatch({
          type: "show-message",
          message: "Login successful. Welcome " + this.state.username + "."
        });
        socket.close();
        socket.open();
      });
  };

  render = () => {
    return (
      <div>
        <form className="login-form" onSubmit={this.handleSubmit}>
          <div>
            <div className="login-label">Username</div>
            <input
              className="cool-input"
              type="text"
              onChange={this.handleUsername}
              required={true}
            />
            <span className="span-effect" />
          </div>
          <div>
            <div className="login-label">Password</div>
            <input
              className="cool-input"
              type="password"
              onChange={this.handlePassword}
              required={true}
            />
            <span className="span-effect" />
          </div>
          <div>
            <input
              className="material-button top-margin bottom-margin"
              type="submit"
              value="Login!"
            />
          </div>
        </form>
      </div>
    );
  };
}

let Login = connect()(UnconnectedLogin);

export default Login;
