import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from "react-redux";
import store from "./reducers/store";
import "./App.css";

import AppRoot from "./AppRoot";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Provider store={store}>
      <AppRoot />
      <ToastContainer />
    </Provider>
  );
}

export default App;
