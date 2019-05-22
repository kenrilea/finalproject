import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/whatsNew.css";

class WhatsNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newsList: []
    };
  }

  componentDidMount = () => {
    fetch("/get-news")
      .then(response => {
        return response.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);

        console.log("News: ", body);

        if (!body.success) {
          return;
        }

        this.setState({
          newsList: body.newsList.reverse()
        });
      });
  };

  getFormattedDate = date => {
    date = new Date(date);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return mm + "/" + dd + "/" + yyyy;
  };

  getNewsContent = () => {
    if (this.state.newsList.length === 0) {
      return <div>Cannot retrieve news from server.</div>;
    }

    let content = this.state.newsList.map(post => {
      return (
        <li className="news-element" key={post._id}>
          {this.getFormattedDate(post.date) + ": " + post.text}
        </li>
      );
    });

    return <ul>{content}</ul>;
  };

  render = () => {
    return (
      <div className="card-container-narrow animated-grow-bounce material-shadow vert-scroll">
        <h3 className="card-top-label">What's new?</h3>
        {this.getNewsContent()}
      </div>
    );
  };
}

export default WhatsNew;
