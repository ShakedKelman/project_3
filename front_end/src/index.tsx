// src/index.tsx or src/App.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/index.css';  /* This line is invalid in CSS */


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
  <BrowserRouter> {/* Wrap your application in BrowserRouter */}
      <App />
    </BrowserRouter>
  </Provider>
);
