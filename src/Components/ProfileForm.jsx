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
      editField: { profilePic: false, statusMessage: false, bio: false }
    };
  }

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
  render = () => {
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
      </div>
    );
  };
}
let mapStateToProps = state => {
  return { username: state.currentUser };
};

let ProfileForm = connect(mapStateToProps)(UnconnectedProfileForm);
export default ProfileForm;
