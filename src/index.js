import 'babel-polyfill';
import 'regenerator-runtime/runtime';
import 'es6-shim';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Router from './router';
import { CookiesProvider } from 'react-cookie';

// Create container element
let container = document.createElement('div');
document.body.appendChild(container);
container.className = 'root';

ReactDOM.render(
  <CookiesProvider>
  <BrowserRouter>
    <div>
      <Router />
    </div>
  </BrowserRouter>
  </CookiesProvider>,
  container
);
