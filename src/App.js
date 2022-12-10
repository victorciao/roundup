import React from 'react';
import './App.css';
import { Accounts } from './features/accounts/Accounts';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Starling Bank Round Up App</h1>
        <Accounts />
      </header>
    </div>
  );
}

export default App;
