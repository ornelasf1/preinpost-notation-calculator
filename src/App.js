import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {conversionNotat} from './components/conversion/ConversionReducer';
import './App.css';
import { NotationCalc } from './components/NotationCalc';
import { NotationConv } from './components/conversion/NotationConv';

const rootReducers = {
  conversionNotat,
};

const store = createStore(
  combineReducers(rootReducers), 
  compose(applyMiddleware(thunk), 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <NotationConv></NotationConv>
        <NotationCalc></NotationCalc>
      </Provider>
    </div>
  );
}

export default App;
