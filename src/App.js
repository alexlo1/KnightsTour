import React from 'react';
import logo from './knight-icon.svg';
import './App.css';
import Game from './Game.js';

const App = () => (
  <div className="app">
    <img src={logo} className="app-logo" alt="logo" />
    <h1 className="app-title">Welcome to Mr. Knight's Wild Tour</h1>
    <Game />
  </div>
);

export default App;

