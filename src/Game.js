import React, { Component } from 'react';
import './Game.css';

const UNMARKED = 'unmarked';
const MARKED = 'marked';
const CURRENT = 'current';
const POSSIBLE = 'possible';
const POSSIBLE_MARKED = 'possible-marked';

/* Ensures the row and column are on the board */
function validTile(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

/* Ensures that the move is one of the possible moves */
function validMove(board, r, c) {
  return validTile(r, c) && (board[r*8+c] === POSSIBLE || board[r*8+c] === POSSIBLE_MARKED);
}

/* Highlights possible moves */
function setPossibleMoves(board, r, c) {
  const knightPaths = [
    [1, 2], [2, 1], [-1, 2], [-2, 1], [-1, -2], [-2, -1], [1, -2], [2, -1],
  ];

  knightPaths.forEach(pair => {
    let tempr = r + pair[0];
    let tempc = c + pair[1];
    if (validTile(tempr, tempc) && board[tempr * 8 + tempc] === UNMARKED) {
      board[tempr * 8 + tempc] = POSSIBLE;
    }
    if (validTile(tempr, tempc) && board[tempr * 8 + tempc] === MARKED) {
      board[tempr * 8 + tempc] = POSSIBLE_MARKED;
    }
  });
}

/* Checks if all tiles have been marked */
function checkWin(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === UNMARKED || board[i] === POSSIBLE) return false;
  }
  return true;
}

/* Functional tile component
 * Tile types:
 * Unmarked tile, not a possible next move
 * Marked tile, not a possible next move
 * Current tile, the most recent move
 * Unmarked tile, possible next move
 * Marked tile, possible next move
 */
function Tile(props) {
  return (
    <div 
      className={'board-tile tile-'+props.type}
      onClick={props.onClick}
    />
  );
}

/* Board component
 * Renders 64 tiles
 */
class Board extends Component {
  renderTile(r, c) {
    return (
      <Tile 
        row={r}
        col={c}
        onClick={() => this.props.click(r, c)}
        type={this.props.board[r*8+c]}
      />
    );
  }

  renderRow(r) {
    return (
      <div className="board-row">
        {[...Array(8).keys()].map(c => (
          this.renderTile(r, c)
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="board">
        {[...Array(8).keys()].map(r => (
          this.renderRow(r)
        ))}
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
        board: Array(64).fill(POSSIBLE),
      }],
      currentTile: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.undo = this.undo.bind(this);
    this.restart = this.restart.bind(this);
  }

  handleClick(r, c) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const board = current.board.slice();
    if (checkWin(board) || !validMove(board, r, c)) {
      return;
    }
    for (let i = 0; i < board.length; i++) {
      if (board[i] === CURRENT) board[i] = MARKED;
      if (board[i] === POSSIBLE) board[i] = UNMARKED;
      if (board[i] === POSSIBLE_MARKED) board[i] = MARKED;
    }
    board[r * 8 + c] = CURRENT;
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
    if (history.length <= 1) {
      return;
    }

    let r = -1;
    let c = -1;
    for(let i = 0; i < 64; i++) {
      let previousBoard = history[history.length - 2];
      if(previousBoard[i] === CURRENT) {
        c = i % 8;
        r = (i - (i % 8)) / 8;
      }
    }
    this.setState({
      history: history.slice(0, history.length - 1),
      currentTile: {
        row: r,
        col: c,
      },
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
    if (checkWin(current.board)) {
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
            click={this.handleClick}
          />
        </div>
        <div className="game-settings">
          <div className="button" onClick={this.undo}>
            Undo
          </div>
          <div className="button" onClick={this.restart}>
            Restart
          </div>
        </div>
      </div>
    );
  }
}
