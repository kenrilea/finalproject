import React, { Component } from 'react'
import WhatsNew from "./WhatsNew.jsx"

import "../css/main.css"


const particlesOptions = {
   particles: {
      number: {
         value: 200,
         denisty: {
            enable: true,
            value_area: 400
         }
      }
   }
};

class App extends Component {
   render = () => {
      return (
         <div>
            {/* Other content? */}
            <WhatsNew />
         </div>
      );
   }
}
export default App
