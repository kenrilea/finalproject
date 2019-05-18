import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

let maxStep = 5;

class UnconnectedHowToPlay extends Component {
   constructor(props) {
      super(props);
      this.state = { redirect: "none", newStep: 1 };
   }

   componentDidMount = () => {
      console.log()
   }

   renderStep = () => {
      let step = parseInt(this.props.match.params.step);
      if (step === 1) {
         console.log("here");
         return (
            <div>
               <h2>{"step: " + this.props.match.params.step}</h2>
               <h3>welcome to Joa Online.</h3>
               <p>
                  joa online is a turn based strategy game. Here you will be given a
                  tutorial on how to play!
          </p>
            </div>
         );
      }
      if (step === 2) {
         return (
            <div>
               <h2>{"step: " + this.props.match.params.step}</h2>
               <h3>Creating a new game</h3>
               <p>click on the create a new game</p>
            </div>
         );
      }
   };
   handlerPrev = event => {
      event.stopPropagation();
      let newStep = parseInt(this.props.match.params.step) - 1;
      if (newStep < 1) {
         newStep = 1;
      }
      this.setState({ redirect: true, newStep });
   };
   handlerNext = event => {
      event.stopPropagation();
      let newStep = parseInt(this.props.match.params.step) + 1;
      if (newStep > maxStep) {
         newStep = maxStep;
      }
      this.setState({ redirect: true, newStep });
   };
   handlerKeyPress = event => {
      console.log(event);
   };
   render = () => {
      if (this.state.redirect === true) {
         this.setState({ redirect: false });
         return <Redirect to={"/how-to-play/" + this.state.newStep} />;
      }
      return (
         <div className="card-container animated-grow-bounce animated-fade-in material-shadow">
            <div onKeyPress={this.handlerkeyPress}>
               {this.props.match.params.step}
               <button onClick={this.handlerPrev}>Prev</button>
               <button onClick={this.handlerNext}>Next</button>
            </div>
            <div>{this.renderStep()}</div>
         </div>
      );
   };
}
let HowToPlay = connect()(UnconnectedHowToPlay);
export default HowToPlay;
