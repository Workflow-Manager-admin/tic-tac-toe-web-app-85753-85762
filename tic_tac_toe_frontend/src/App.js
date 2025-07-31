import React, { useState } from 'react';
import './App.css';

/**
 * Returns the display name for a player.
 * @param {string} player 'X' or 'O'
 */
function playerName(player) {
  return player === 'X' ? 'Player 1 (X)' : 'Player 2 (O)';
}

// PUBLIC_INTERFACE
function App() {
  /**
   * State explanation:
   * - board: array of 9 squares (null | 'X' | 'O')
   * - xIsNext: whose turn, boolean (true: X, false: O)
   * - winner: null | 'X' | 'O' | 'draw'
   */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (board[i] || winner) return; // ignore if already filled or game over
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // Win/draw/message logic
  let status;
  if (winner === 'draw') {
    status = (
      <span className="status-accent">It's a draw!</span>
    );
  } else if (winner) {
    status = (
      <span className="status-primary">
        {playerName(winner)} wins!
      </span>
    );
  } else {
    status = (
      <span>
        Turn: <span className="status-primary">{playerName(xIsNext ? 'X' : 'O')}</span>
      </span>
    );
  }

  return (
    <div className="ttt-app-bg">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
      </header>
      <main className="ttt-main">
        <div className="ttt-board-container">
          <Board squares={board} onClick={handleSquareClick} winningLine={winner && winner !== 'draw' ? winningLine(board) : null} />
        </div>
        <div className="ttt-info">
          <div className="ttt-status" data-testid="status">{status}</div>
          <button className="ttt-restart-btn" onClick={handleRestart}>Restart Game</button>
        </div>
      </main>
      <footer className="ttt-footer">
        <span className="ttt-footer-text">Modern Two-Player Game &copy; 2024</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onClick, winningLine }) {
  return (
    <div className="ttt-board">
      {squares.map((val, idx) => (
        <Square
          value={val}
          key={idx}
          onClick={() => onClick(idx)}
          highlight={winningLine && winningLine.includes(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={"ttt-square" + (highlight ? " ttt-square-highlight" : "")}
      onClick={onClick}
      aria-label={value ? `Square filled with ${value}` : 'Empty square'}
      tabIndex={0}
      disabled={!!value}
      type="button"
    >
      {value}
    </button>
  );
}

/**
 * Calculate winner of current board.
 * Returns 'X', 'O', 'draw', or null if still playing.
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6],          // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // Draw if board full and no winner
  if (squares.every(Boolean)) return 'draw';
  return null;
}

/**
 * Returns winning line indices, else null.
 */
function winningLine(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

export default App;
