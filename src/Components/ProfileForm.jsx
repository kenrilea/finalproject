import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/profileForm.css";

class UnconnectedProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusMessage: "",
      bio: "",
      profilePic: "/assets/default-user.png",
      showProfilePics: false
    };
  }
  handlerSubmit = event => {
    console.log("submitted");
  };
  handlerInputStatusMessage = event => {
    console.log(event.target.value);
  };
  handlerOnClick = event => {
    console.log("click");
    this.setState({ showProfilePics: !this.state.showProfilePics });
  };
  renderProfilePics = () => {
    if (this.state.showProfilePics) {
      console.log("test");
      return (
        <div>
          <img src={this.state.profilePic} />
          <img src={this.state.profilePic} />
          <img src={this.state.profilePic} />
        </div>
      );
    }
  };
  render = () => {
    return (
      <div>
        <div onClick={this.handlerOnClick}>
          <h4>Select profile picture</h4>

          <img className={"profilePicDiv"} src={this.state.profilePic} />
        </div>

        {this.renderProfilePics()}
        <form onSubmit={this.handlerSubmit}>
          <div>
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
