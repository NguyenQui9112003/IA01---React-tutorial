import { useState, memo } from 'react';
import './App.css';

const Square = memo(({ value, onSquareClick, highlight }) => {
  return (
    <>
      <button className={`square ${highlight ? 'highlight' : ''}`} onClick={onSquareClick}>{value}</button>
    </>
  );
});

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] }; // Return the winning line
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  const { winner, line } = calculateWinner(squares) || {};

  const handleClick = (i) => {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  };

  const status = winner
    ? 'Winner: ' + winner
    : squares.every(square => square) // Check for draw
    ? 'It\'s a draw!'
    : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const boardSquares = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const highlight = line && line.includes(index); // Check if the square is part of the winning line
      boardSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={highlight}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {boardSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscending, setIsAscending] = useState(true);

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove) => {
    setCurrentMove(nextMove);
  };

  // Sort moves based on the isAscending state
  const sortedMoves = history.map((squares, move) => {
    const description = move > 0 
      ? `Go to move #${move} (row: ${(move - 1) % 3}, col: ${Math.floor((move - 1) / 3)})`
      : 'Go to game start';
      
    return { move, description };
  }).sort((a, b) => isAscending ? a.move - b.move : b.move - a.move);

  const moves = sortedMoves.map(({ move, description }) => {
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{move}</span>
        ) : (
          <button className="historyButton" onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const toggleMe = () => {
    setIsAscending((prev) => !prev);
  };

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" onClick={toggleMe} className="sr-only peer" />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{isAscending ? "Ascending order" : "Descending order"}</span>
          </label>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <Game />
    </>
  );
}

export default App;
