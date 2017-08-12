// You can choose your kind of history here (e.g. browserHistory)
// Your routes.js file
import React from "react"
import {BrowserRouter, Route} from "react-router-dom"
import Aurora from "./aurora/Aurora"
import * as ReactDOM from "react-dom"
import Trip from "./trip/Trip"

export default class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Trip}/>
          <Route path="/aurora" component={Aurora}/>
        </div>
      </BrowserRouter>
    );
  }

}
// ========================================


ReactDOM
  .render(
    <App/>,
    document.getElementById('root')
  );

