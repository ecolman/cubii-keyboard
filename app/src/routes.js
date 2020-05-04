import React from 'react';
import { Switch, Redirect, Route } from "react-router";

import { ROUTES } from "Constants";
import Bluetooth from "Pages/Home/Bluetooth";
import Settings from "Pages/Home/Settings";

function Routes() {
  return (
    <Switch>
      <Route exact path={ROUTES.BLUETOOTH} component={Bluetooth}></Route>
      <Route exact path={ROUTES.SETTINGS} component={Settings}></Route>
      <Redirect exact from="/" to={ROUTES.BLUETOOTH} />
    </Switch>  
  )
}

export default Routes
