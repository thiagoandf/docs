import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import DocumentationRoot from "./pages/Documentation";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <DocumentationRoot />
        </Route>
      </Switch>
    </Router>
  );
}
