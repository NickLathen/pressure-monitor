import React from 'react';
import { render } from 'react-dom';
import App from './components/App.js';

const launchApp = function launchApp() {
  render((<App/>), document.getElementById('App'));
};

launchApp();