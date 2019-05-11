import React, { Component } from "react";
import { Link } from "react-router-dom";

class Oops extends Component {
  render = () => {
    return (
      <div>
        <h1>Oops! {this.props.message}</h1>
        Click <Link to={"/"}>here</Link> to go back.
      </div>
    );
  };
}

export default Oops;
