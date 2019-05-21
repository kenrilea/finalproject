import React, { Component } from "react";
import { connect } from "react-redux";
import { Launcher } from "react-chat-window";
import socket from "./SocketSettings.jsx";

class UnconnectedLobbyChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponentUsername: "",
      messageList: []
    };
  }

  messagesFromUserPOV = messages => {
    let povMessages = messages.map(message => {
      if (message.username == this.props.currentUser) {
        message.author = "me";
      } else {
        message.author = "them";
      }
      return message;
    });
    return povMessages;
  };

  setOpponentUsername = () => {
    let username = "Waiting for opponent...";
    if (this.props.playerOne == this.props.currentUser) {
      username = this.props.playerTwo;
    } else if (this.props.playerTwo == this.props.currentUser) {
      username = this.props.playerOne;
    }
    this.setState({
      ...this.state,
      opponentUsername: username
    });
  };

  componentDidMount() {
    //remove alert when done. was only for testing
    //window.alert("Hey! Listen! \n - Navi");
    console.log("Initial LobbyChat state from constructor: ", this.state);

    socket.open();
    socket.on("lobby-chat", messages => {
      console.log(
        "Unmodified for POV messages received from socket: ",
        messages
      );
      console.log("LobbyChat Props:", this.props);

      this.setOpponentUsername();
      let povMessages = this.messagesFromUserPOV(messages);
      this.setState({
        ...this.state,
        messageList: povMessages
      });
      console.log("User POV messages: ", povMessages);
    });
    socket.emit("refresh-lobby-chat", this.props.currentLobbyId);
  }

  componentWillUnmount() {
    //socket.close();
  }

  _onMessageWasSent = message => {
    let userMessage = { ...message, author: "me", type: "text" };
    userMessage.username = this.props.currentUser;
    console.log(
      `New message: ${"[User: " +
        userMessage.username +
        ", Socket:" +
        socket.id +
        "]: " +
        userMessage.data.text}`
    );
    let data = { lobbyId: this.props.currentLobbyId, message: userMessage };
    socket.emit("sent-message", data);
  };

  render() {
    return (
      <div className="App">
        <Launcher
          agentProfile={{
            teamName: this.state.opponentUsername
            //imageUrl: "./../ninja.png"
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji={false}
        />
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    currentUser: state.currentUser,
    currentLobbyId: state.currentLobbyId,
    inLobby: state.inLobby
  };
};
let LobbyChat = connect(mapStateToProps)(UnconnectedLobbyChat);

export default LobbyChat;
