import React, { Component } from 'react'
import WhatsNew from "./WhatsNew.jsx"

import "../css/main.css"


class HomePage extends Component {
   render = () => {
      return (
         <div>
            {/* Other content? */}
            <WhatsNew />
         </div>
      );
   }
}
export default HomePage
