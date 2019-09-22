import React from 'react';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {conversionNotat} from './components/conversion/ConversionReducer';
import {algorithmInstructions} from './components/ConversionAlgoReducer';
import './App.css';
import NotationConv from './components/conversion/NotationConv';
import ConversionAlgorithm from './components/ConversionAlgorithm';
import ReactGA from 'react-ga';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-144025519-2');
}
ReactGA.pageview(window.location.pathname + window.location.search);

const rootReducers = {
  conversionNotat,
  algorithmInstructions
};

const composeEnhancers = typeof window === 'object' && 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && process.env.NODE_ENV !== 'production'? 
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const store = createStore(
  combineReducers(rootReducers), 
  composeEnhancers(applyMiddleware(thunk)));

function App() {

  return (
    <div className="App">
      <Provider store={store}>
        <h1 id="app-title">Notation Converter</h1>
        <NotationConv></NotationConv>
        <ConversionAlgorithm></ConversionAlgorithm>
      </Provider>
    </div>
  );
}

export default App;
