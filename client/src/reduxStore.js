import { createStore } from 'redux';

const reducer = function reducer(state = {}, action) {
  const newState = JSON.parse(JSON.stringify(state));
  if (action.type === 'bloodPressureData') {
    delete action['type'];
    newState.bloodPressureData = action;
  }
  return newState;
};

const initialState = {};
const store = createStore(reducer, initialState);

module.exports = store;