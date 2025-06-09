import React, { useState, useEffect } from "react";

const initialBoard = Array(9).fill(null);

const Home = () => {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameHistory, setGameHistory] = useState([]);

  const winner = calculateWinner(board);
  const currentPlayer = xIsNext ? "X" : "O";
  const isDraw = !winner && board.every(Boolean);

  useEffect(() => {
    if (winner) {
      setScores((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));
      setGameHistory((prev) => [...prev, { winner, board: [...board] }]);
    } else if (isDraw) {
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
      setGameHistory((prev) => [
        ...prev,
        { winner: "Draw", board: [...board] },
      ]);
    }
  }, [winner, isDraw]);

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = board.slice();
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setXIsNext(true);
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    setGameHistory([]);
    resetGame();
  };

  const renderCell = (index) => {
    const isWinningCell =
      winner && calculateWinningCells(board).includes(index);
    return (
      <button
        key={index}
        onClick={() => handleClick(index)}
        className={`
          w-20 h-20 border-2 m-1 text-4xl font-bold flex items-center justify-center 
          transition-all duration-200 transform hover:scale-105 rounded-lg
          ${board[index] === "X" ? "text-blue-600" : "text-red-600"}
          ${isWinningCell ? "bg-green-100 border-green-500" : "border-gray-300"}
          ${!board[index] && !winner ? "hover:bg-gray-50 cursor-pointer" : ""}
          shadow-md
        `}
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tic Tac Toe</h1>
          <p className="text-lg text-gray-600">The classic game reinvented</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="grid grid-rows-3 gap-0">
                {[0, 1, 2].map((row) => (
                  <div className="grid grid-cols-3 gap-0" key={row}>
                    {renderCell(row * 3)}
                    {renderCell(row * 3 + 1)}
                    {renderCell(row * 3 + 2)}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-xs bg-white p-4 rounded-lg shadow-md mb-6">
              <div
                className={`text-center text-xl font-semibold py-2 rounded ${
                  winner || isDraw ? "animate-pulse" : ""
                }`}
              >
                {winner ? (
                  <span className="text-green-600">🎉 {winner} wins! 🎉</span>
                ) : isDraw ? (
                  <span className="text-yellow-600">🤝 It's a draw! 🤝</span>
                ) : (
                  <span>
                    Next:{" "}
                    <span
                      className={xIsNext ? "text-blue-600" : "text-red-600"}
                    >
                      {currentPlayer}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                New Game
              </button>
              <button
                onClick={resetScores}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg"
              >
                Reset Scores
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Scoreboard
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600">Player X</div>
                  <div className="text-2xl font-bold">{scores.X}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Draws</div>
                  <div className="text-2xl font-bold">{scores.draws}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-sm text-red-600">Player O</div>
                  <div className="text-2xl font-bold">{scores.O}</div>
                </div>
              </div>
            </div>

            {gameHistory.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Game History
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {gameHistory.map((game, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">Game {idx + 1}:</span>
                      <span
                        className={
                          game.winner === "X"
                            ? "text-blue-600"
                            : game.winner === "O"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }
                      >
                        {game.winner === "Draw" ? "Draw" : `${game.winner} won`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function calculateWinningCells(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return [];
}

export default Home;
