import React from "react";
import { Route, Switch } from "react-router-dom";
import Main from "./main";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
