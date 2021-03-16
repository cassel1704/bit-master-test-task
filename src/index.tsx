import React from "react";
import ReactDOM from "react-dom";
import { configureAxiosMockAdapter } from "./api/mock";
import Application from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

const init = () => {
  configureAxiosMockAdapter();

  ReactDOM.render(
    <React.StrictMode>
      <Application store={store} />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
