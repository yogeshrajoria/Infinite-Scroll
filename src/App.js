import React from 'react';
import './App.css';
import List from './components/List';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-brand">Infinite Scroll</div>
        <a href="https://github.com/yogeshrajoria/Infinite-Scroll" target="_blank" rel="noopener noreferrer">
          <img src={process.env.PUBLIC_URL + '/Github_Logo.png'} className="github" alt="github-link"></img>
        </a>
      </header>
        <List />
    </div>
  );
}

export default App;
