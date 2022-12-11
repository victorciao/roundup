import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';
import { fetchAccounts } from './features/accounts/accountsSlice';

const container = document.getElementById('root');
const root = createRoot(container);

// fetch accounts ASAP because we need
// to show them when the app loads
store.dispatch(fetchAccounts());

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
