import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/whatsNew.css"

class WhatsNew extends Component {


   render = () => {
      return (
         <div className="news-container">
            <h3 className="news-label">What's new?</h3>
            <ul>
               <li className="news-element">05/11/19: Version 1.0 begins! Stay tuned for future updates</li>
               <li className="news-element">05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li className="news-element">05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li className="news-element">05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li className="news-element">05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li className="news-element">05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li className="news-element">05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li className="news-element">05/11/19: Version 1.0 begins!</li>
            </ul>
         </div>
      )
   }
}

export default WhatsNew