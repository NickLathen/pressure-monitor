import React from 'react';
import store from '../reduxStore.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(this.setState.bind(this, {}));
  }

  render(props) {
    return (
      <p>test</p>
    );
  }
}