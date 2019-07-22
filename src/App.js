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

const initializeReactGA = () => {
  ReactGA.initialize('GTM-PJN2N27');
  ReactGA.pageview('/');
};

const rootReducers = {
  conversionNotat,
  algorithmInstructions
};

const store = createStore(
  combineReducers(rootReducers), 
  compose(applyMiddleware(thunk), 
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));

function App() {
  initializeReactGA();
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
