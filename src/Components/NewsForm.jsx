import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "./../css/newsForm.css";

// This page is to create news to show in WhatsNew.

class NewsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textarea: "",
      postSuccess: false
    };
  }

  handleSubmit = event => {
    event.preventDefault();

    let data = new FormData();
    data.append("newsText", this.state.textarea);

    fetch("/add-news", {
      method: "POST",
      credentials: "include",
      body: data
    })
      .then(response => {
        return response.text();
      })
      .then(responseBody => {
        let body = JSON.parse(responseBody);

        console.log("News posted?", body);

        if (!body.success) {
          alert("An error occurred. Post not added.");
          return;
        }

        this.setState({
          postSuccess: true
        });
        alert("News posted successfully!");
      });
  };

  handleTextarea = event => {
    this.setState({
      textarea: event.target.value
    });
  };

  getTodaysDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return mm + "/" + dd + "/" + yyyy;
  };

  render = () => {
    if (this.state.postSuccess) {
      return <Redirect to="/" />;
    }
    return (
      <div className="card-container material-shadow animated-grow-bounce animated-fade-in">
        <div className="card-top-cont">
          <h3 className="card-top-label">What's New?</h3>
        </div>
        <hr
          style={{
            display: "block",
            height: "1px",
            border: 0,
            borderTop: "1px solid #ccc",
            margin: "1em 0",
            padding: 0
          }}
        />
        <div className="add-news-date-display">{this.getTodaysDate()}</div>
        <form className="add-news-form" onSubmit={this.handleSubmit}>
          <div className="add-news-textarea-container">
            <textarea
              className="add-news-textarea"
              value={this.state.textarea}
              onChange={this.handleTextarea}
              required
            />
          </div>
          <input
            className="material-button add-news-submit"
            type="submit"
            value="Post"
          />
        </form>
      </div>
    );
  };
}

export default NewsForm;
