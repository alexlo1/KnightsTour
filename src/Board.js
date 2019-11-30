import React from 'react';
import './Game.css';

/* Functional tile component
 * Tile types:
 * Unmarked tile, not a possible next move
 * Marked tile, not a possible next move
 * Current tile, the most recent move
 * Unmarked tile, possible next move
 * Marked tile, possible next move
 */
const Tile = ({ type, row, col, onClick }) => (
  <div
    className={'board-tile tile-' + type + ' ' + ((row+col) % 2 === 0 ? 'white' : 'black')}
    onClick={onClick}
  />
);

/* Board component
 * Renders 64 tiles
 */
const Board = ({ board, click }) => {
  const renderTile = (r, c) => (
    <Tile
      key={r+','+c}
      row={r}
      col={c}
      onClick={() => click(r, c)}
      type={board[r*8+c]}
    />
  );

  const renderRow = (r) => (
    <div className="board-row" key={r}>
      {[...Array(8).keys()].map(c => (
        renderTile(r, c)
      ))}
    </div>
  );

  return (
    <div className="board">
      {[...Array(8).keys()].map(r => (
        renderRow(r)
      ))}
    </div>
  );
}

export default Board;
