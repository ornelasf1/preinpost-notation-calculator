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
      <div className="App-content">
        <Provider store={store}>
          <h1 id="app-title">Notation Converter</h1>
          <h3 id="app-desc"> 
            An online tool that converts mathematical notations to their alternate notation versions.
            The tool parses the given expression into tokens and places it through an algorithm that 
            utilizes a data structure known as a stack.
            Computers process postfix/prefix notation expressions easier since there's no ambiguity
            of precedence, unlike infix expressions where <b>4 * 3 - 7</b> and <b>4 * (3 - 7)</b> can have different
            results.<br /><br />
            Conversion in between notations can be helpful to eliminate ambiguity for infix expressions.
            For example, it's not immediately obvious how to evaluate the expression, <b>8/2*(2+2)</b>. If we
            convert it to postfix to get <b>8 2 / 2 2 + *</b>, and convert it back to infix, we can see more
            clearly when it results back to <b>(8 / 2) * (2 + 2)</b>.
          </h3>
          <NotationConv></NotationConv>
          <ConversionAlgorithm></ConversionAlgorithm>
        </Provider>
      </div>
      <div className="footer">
        <div>Contact: <a href="mailto:ornelasfdev@gmail.com">ornelasfdev@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

export default App;
