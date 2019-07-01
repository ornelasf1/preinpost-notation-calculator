import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {conversionNotat} from './components/conversion/ConversionReducer';
import {algorithmInstructions} from './components/ConversionAlgoReducer';
import './App.css';
import NotationConv from './components/conversion/NotationConv';
import ConversionAlgorithm from './components/ConversionAlgorithm';

const rootReducers = {
  conversionNotat,
  algorithmInstructions
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
        <ConversionAlgorithm></ConversionAlgorithm>
      </Provider>
    </div>
  );
}

export default App;
