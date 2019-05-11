import React, { Component } from "react";
import { connect } from "react-redux";

import "../css/whatsNew.css"

class WhatsNew extends Component {


   render = () => {
      return (
         <div className="newsContainer">
            <h2>What's new?</h2>
            <ul>
               <li>05/11/19: Version 1.0 begins!</li>
               <li>05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li>05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li>05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li>05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li>05/11/19: Suspendisse quam orci, varius ac erat id, dapibus elementum metus. Donec mollis et est in aliquam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
               <li>05/11/19: Cras quis gravida lorem, nec varius ex. Vivamus non pharetra purus, volutpat malesuada enim. Curabitur rutrum odio id feugiat placerat.</li>
               <li>05/11/19: Version 1.0 begins!</li>
            </ul>
         </div>
      )
   }
}

export default WhatsNew