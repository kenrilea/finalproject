import React, { Component } from "react";
import { connect } from "react-redux";

class About extends Component {

   render = () => {
      return (

         <div className="card-container material-shadow animated-fade-in animated-grow-bounce">
            <div className="card-top-cont">
               <h3 className="card-top-label"> About </h3>
            </div>
            <div className="card-scrollable-cont">

               <p className="left-marge"> Super Chess II was built using the following technologies:  </p>

               <div className="about-img-cont">
                  <div className="about-img-cont-row">
                     <img alt="React Logo" src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" />
                     <img alt="NodeJS Logo" src="http://pluspng.com/img-png/nodejs-logo-png-node-js-development-296.png" />
                     <img alt="HTML5 Logo" src="https://logos-download.com/wp-content/uploads/2017/07/HTML5_logo-700x700.png" />
                     <img alt="Babel Logo" src="http://www.freelogovectors.net/svg03/babellogo.svg" />
                  </div>

                  <div className="about-img-cont-row">
                     <img alt="Redux Logo" src="https://raw.githubusercontent.com/reduxjs/redux/master/logo/logo.png" />
                     <img alt="Socket.io Logo" src="https://cdn.worldvectorlogo.com/logos/socket-io.svg" />
                     <img alt="MongoDB Logo" src="https://i.dlpng.com/static/png/485214_thumb.png" />
                     <img alt="Webpack Logo" src="https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png" />
                  </div>
               </div>

               <p className="left-marge">Don't believe the facts? Just check out our <a href="https://github.com/kenrilea/finalproject">GitHub repo</a> </p>

            </div>
         </div>

      )
   }

}

export default About