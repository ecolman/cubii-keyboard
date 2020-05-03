import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store, { history } from "Redux/store";

ReactDOM.render(
  <Suspense fallback="loading">
    <App store={store} history={history}></App>
  </Suspense>,
  document.getElementById("root")
);
