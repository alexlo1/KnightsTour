import React, { Component } from 'react';
import './Game.css';

/* Ensures the row and column are on the board */
function validTile(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/* Ensures that the move is one of the possible moves */
function validMove(board, r, c) {
  return validTile(r, c) && (board[r*8+c] === 3 || board[r*8+c] === 4);
}

/* Highlights possible moves */
function setPossibleMoves(board, r, c) {
  const knightPaths = [
    [1, 2], [2, 1], [-1, 2], [-2, 1], [-1, -2], [-2, -1], [1, -2], [2, -1],
  ];

  knightPaths.forEach((pair) => {
    let tempr = r + pair[0];
    let tempc = c + pair[1];
    if(validTile(tempr, tempc) && board[tempr * 8 + tempc] === 0) {
      board[tempr * 8 + tempc] = 3;
    }
    if(validTile(tempr, tempc) && board[tempr * 8 + tempc] === 1) {
      board[tempr * 8 + tempc] = 4;
    }
  });
}

/* Checks if all tiles have been marked */
function checkWin(board) {
  for(let i = 0; i < board.length; i++) {
    if(board[i] === 0 || board[i] === 3) return false;
  }
  return true;
}

/* Functional tile component
 * Tile types:
 * 0: Unmarked tile, not a possible next move
 * 1: Marked tile, not a possible next move
 * 2: The most recent move
 * 3: Unmarked tile, possible next move
 * 4: Marked tile, possible next move
 */
function Tile(props) {
  let classList = 'board-tile ';
  switch(props.type) {
    case 0:
      classList += "tile-unmarked ";
      break;
    case 1:
      classList += "tile-marked ";
      break;
    case 2:
      classList += "tile-current ";
      break;
    case 3:
      classList += "tile-possible ";
      break;
    case 4:
      classList += "tile-possible-marked ";
      break;
    default:
  }
  return (
    <div 
      className={classList}
      onClick={props.onClick}
    />
  );
}

/* Board component
 * Renders 64 tiles
 */
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
    return (
      <Tile 
        row={r}
        col={c}
        onClick={() => this.props.onClick(r, c)}
        type={this.props.board[r*8+c]}
      />
    );
  }

  render() {
    return (
      <div className="board">
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

/* Game component
 * Handles game status, history, info
 */
export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        board: Array(64).fill(3),
      }],
      currentTile: null,
    };
  }

  handleClick(r, c) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const board = current.board.slice();
    if(checkWin(board) || !validMove(board, r, c)) {
      return;
    }
    for(let i = 0; i < board.length; i++) {
    if(board[i] === 2) board[i] = 1;
      if(board[i] === 3) board[i] = 0;
      if(board[i] === 4) board[i] = 1;
    }
    board[r * 8 + c] = 2;
    setPossibleMoves(board, r, c);
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

  undo() {
    const history = this.state.history;
    if(history.length <= 1) {
      return;
    }

    let r = -1;
    let c = -1;
    for(let i = 0; i < 64; i++) {
      let previousBoard = history[history.length - 2];
      if(previousBoard[i] === 2) {
        c = i % 8;;
        r = (i - (i % 8)) / 8;
      }
    }
    this.setState({
      history: history.slice(0, history.length - 1),
      currentTile: {
        row: r,
        col: c,
      } || null,
    });
  }

  restart() {
    const history = this.state.history;
    this.setState({
      history: history.slice(0, 1),
      currentTile: null,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
   
    let status = "Now playing: Move " + history.length;
    if(checkWin(current.board)) {
      status = "You won at move " + (history.length - 1) + "!";
    }

    return (
      <div className="game">
        <div className="game-info">
          {status}
        </div>
        <div className="game-board">
          <Board 
            board={current.board}
            onClick={(r, c) => this.handleClick(r, c)}
          />
        </div>
        <div className="game-settings">
          <div className="button" onClick={() => this.undo()}>
            Undo
          </div>
          <div className="button" onClick={() => this.restart()}>
            Restart
          </div>
        </div>
      </div>
    );
  }
}
