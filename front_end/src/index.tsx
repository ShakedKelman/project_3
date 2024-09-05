import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import { Provider } from 'react-redux';
import { store } from './store/store'; // Adjust the path if necessary
import App from './App';

// Create a root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Make sure you provide the correct type
);

// Render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
