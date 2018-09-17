import React, { Component } from 'react';
import logo from './knight-icon.svg';
import './App.css';
import Game from './Game.js';

export default class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="logo" />
          <h1 className="app-title">Welcome to Mr. Knight's Wild Tour</h1>
        </header>
        <div className="app-main">
          <Game />
        </div>
      </div>
    );
  }
}
