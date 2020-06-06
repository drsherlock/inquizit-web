import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
    </Switch>
  );
}
