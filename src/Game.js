import React, { Component } from 'react';
import './Game.css';

function validTile(board, r, c) {
  return true;
}

function Tile(props) {
  let classList = 'board-tile ' + props.color;
  if(props.isCurrentTile) {
    classList += ' current';
  } else if(props.isPossibleTile) {
    classList += ' possible';
  }
  return (
    <div 
      className={classList}
      onClick={props.onClick}
    >
      {props.row}, {props.col}
    </div>
  );
}

class Board extends Component {
  renderRow(r) {
    return (
      <div className="board-row">
        {this.renderTile(r, 0)}
        {this.renderTile(r, 1)}
        {this.renderTile(r, 2)}
        {this.renderTile(r, 3)}
        {this.renderTile(r, 4)}
        {this.renderTile(r, 5)}
        {this.renderTile(r, 6)}
        {this.renderTile(r, 7)}
      </div>
    );
  }
  
  renderTile(r, c) {
    let color;
    if((r + c) % 2 === 0) {
      color = 'white';
    } else {
      color = 'black';
    }
    return (
      <Tile 
        row={r}
        col={c}
        onClick={() => this.props.onClick(r, c)}
        isCurrentTile={this.props.board[r*8+c] === 1}
        isPossibleTile={false}
        color={color}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
      </div>
    );
  }
}

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        board: Array(64).fill(0),
      }],
      currentTile: null,
    };
  }

  validTile(r, c) {
    return true;
  }
  handleClick(r, c) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const board = current.board.slice();
    if(validTile(board, r, c)) {
      board[r * 8 + c] = 1;
      this.setState({
        history: history.concat([{
          board: board,
        }]),
        currentTile: {
          row: r,
          col: c,
        }
      });
    }
  }


  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    
    return (
      <div className="game">
        <div className="game-info">
          /*TODO*/
        </div>
        <div className="game-board">
          <Board 
            board={current.board}
            onClick={(r, c) => this.handleClick(r, c)}
          />
        </div>
        <div className="game-settings">
          /*TODO*/
        </div>
      </div>
    );
  }
}
