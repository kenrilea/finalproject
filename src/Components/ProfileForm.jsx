import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/profileForm.css";

class UnconnectedProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      statusMessage: "",
      bio: "",
      profilePic: "/assets/default-user.png",
      editField: { profilePic: false, statusMessage: false, bio: false }
    };
  }

  componentDidMount = () => {
    this.fetchProfile();
  };
  handlerSubmit = event => {
    console.log("submitted");
  };
  handlerInputStatusMessage = event => {
    this.setState({ statusMessage: event.target.value });
  };
  handlerInputBio = event => {
    this.setState({ bio: event.target.value });
  };
  handlerOnClickCurrentPic = event => {
    this.setState({
      editField: {
        ...this.state.editField,
        profilePic: !this.state.editField.profilePic
      }
    });
  };
  handlerOnCLickPicOption = action => {
    this.setState({ profilePic: action.target.src });
  };
  handlerEditStatus = event => {
    event.preventDefault();
    this.setState({
      editField: {
        ...this.state.editField,
        statusMessage: !this.state.editField.statusMessage
      }
    });
  };
  renderstatusMessage = () => {
    if (this.state.editField.statusMessage) {
      return (
        <div>
          <form onSubmit={this.handlerEditStatus}>
            <input
              onBlur={this.handlerEditStatus}
              type={"text"}
              onChange={this.handlerInputStatusMessage}
              value={this.state.statusMessage}
            />
          </form>
        </div>
      );
    }
    return (
      <p>
        {this.state.statusMessage}

        <img
          onClick={this.handlerEditStatus}
          className={"profileFormEditButtonImg"}
          src={"/assets/edit.jpg"}
        />
      </p>
    );
  };
  handlerEditBio = event => {
    event.preventDefault();
    this.setState({
      editField: {
        ...this.state.editField,
        bio: !this.state.editField.bio
      }
    });
  };
  renderBio = () => {
    if (this.state.editField.bio) {
      return (
        <div>
          <form onSubmit={this.handlerEditBio}>
            <input
              onBlur={this.handlerEditBio}
              type={"text"}
              onChange={this.handlerInputBio}
              value={this.state.bio}
            />
          </form>
        </div>
      );
    }
    return (
      <p>
        {this.state.bio}

        <img
          onClick={this.handlerEditBio}
          className={"profileFormEditButtonImg"}
          src={"/assets/edit.jpg"}
        />
      </p>
    );
  };
  renderProfilePics = () => {
    if (this.state.editField.profilePic) {
      return (
        <div className={"profilePicOptionsDiv"}>
          <img
            onClick={this.handlerOnCLickPicOption}
            className={"profileFormMiniPic"}
            src={"/assets/profilePicA.png"}
          />
          <img
            onClick={this.handlerOnCLickPicOption}
            className={"profileFormMiniPic"}
            src={"/assets/profilePicB.png"}
          />
          <img
            onClick={this.handlerOnCLickPicOption}
            className={"profileFormMiniPic"}
            src={"/assets/profilePicC.png"}
          />
          <img
            onClick={this.handlerOnCLickPicOption}
            className={"profileFormMiniPic"}
            src={"/assets/profilePicD.png"}
          />
        </div>
      );
    }
  };
  fetchProfile = () => {
    let data = new FormData();
    data.append("username", "sos236");
    fetch("/get-user-profile", { method: "Post", body: data })
      .then(resHeader => {
        return resHeader.text();
      })
      .then(resBody => {
        let userProfile = JSON.parse(resBody);
        this.setState({
          statusMessage: userProfile.statusMessage,
          bio: userProfile.bio,
          profilePic: userProfile.profilePic
        });
      });
  };
  handlerClickSaveChanges = () => {
    let data = new FormData();
    data.append("statusMessage", this.state.statusMessage);
    data.append("bio", this.state.bio);
    data.append("profilePic", this.state.profilePic);
    fetch("/change-user-profile", { method: "Post", body: data });
  };
  render = () => {
    if (this.props.loggedIn !== true) {
      return (
        <div className={"profileFormDiv"}>
          <p>please log in</p>
        </div>
      );
    }
    return (
      <div className={"profileFormDiv"}>
        <div onClick={this.handlerOnClickCurrentPic}>
          <h4>{this.props.username}</h4>
          <img
            className={"ProfileFormCurrentPic"}
            src={this.state.profilePic}
          />
        </div>

        {this.renderProfilePics()}
        <div>
          <div>
            <h4>Status message</h4>
            {this.renderstatusMessage()}
          </div>
          <div>
            <h4>User bio</h4>
            {this.renderBio()}
          </div>
        </div>
        <div>
          <button onClick={this.handlerClickSaveChanges}>Save changes</button>
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { username: state.currentUser, loggedIn: state.loggedIn };
};

let ProfileForm = connect(mapStateToProps)(UnconnectedProfileForm);
export default ProfileForm;
