import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import Routes from "./Routes";

export default function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes />
      </Router>
    </React.StrictMode>
  );
}
