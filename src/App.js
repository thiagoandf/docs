import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from "./pages/Home";
import DocumentationRoot from "./pages/Documentation";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/documentation">
          <DocumentationRoot />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
