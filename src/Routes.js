import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./Home";
import Room from "./Room";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/room/:roomId">
        <Room />
      </Route>
    </Switch>
  );
}
