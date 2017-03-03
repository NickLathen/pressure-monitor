import React from 'react';
import { render } from 'react-dom';
import App from './components/App.js';
import store from './reduxStore.js';

const launchApp = function launchApp() {
  render((<App/>), document.getElementById('App'));
};

launchApp();