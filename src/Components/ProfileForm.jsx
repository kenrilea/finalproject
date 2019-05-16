import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMessage: "",
      bio: "",
      profilePic: "/assets/default-user.png"
    };
  }
  handlerSubmit = event => {
    console.log("submitted");
  };
  handlerInputStatusMessage = event => {
    console.log(event.target.value);
  };
  handlerOnClick = event => {};
  render = () => {
    return (
      <div>
        <form onSubmit={this.handlerSubmit}>
          <div>
            <h4>Select profile picture</h4>
            <button onClick={this.handlerOnClick}>
              <img src={this.state.profilePic} />
            </button>
            <h4>Status message</h4>
            <input
              type={"text"}
              onChange={this.handlerInputStatusMessage}
              value={this.state.statusMessage}
            />
          </div>
          <div>
            <h4>User bio</h4>
            <input
              type={"text"}
              onChange={this.handlerInputBio}
              value={this.state.bio}
            />
          </div>
        </form>
      </div>
    );
  };
}
let ProfileForm = connect()(UnconnectedProfileForm);
export default ProfileForm;
