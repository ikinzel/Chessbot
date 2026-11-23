import { Chess } from "https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm";
import { getEngineMove } from "./stockfish.js";
import { setClock, switchClock, clockExpired } from "./clock.js"; 

const game = new Chess();

const form = document.getElementById("move-form");
const input = document.getElementById("move-input");
const output = document.getElementById("output");
const movesDisplay = document.getElementById("moves");

const engineOutput = document.getElementById("computer-move"); 
const moveButton = document.getElementById("move-button");


const boardDisplay = document.getElementById("board");


//piece is an object
const pieceSymbols = {
  wk: "♔", wq: "♕", wr: "♖", wb: "♗", wn: "♘", wp: "♙",
  bk: "♚", bq: "♛", br: "♜", bb: "♝", bn: "♞", bp: "♟"
};


function renderBoard() {
  const position = game.board();
  // ^^ an 8x8 array of the current board with null being empty squares (chess.js)
  boardDisplay.replaceChildren();
  // ^^ clears the chess board before populating it

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = position[row][col];
      const square = document.createElement("div");
      square.className = "board-square";

      if ((row + col) % 2 === 1) {
        square.classList.add("dark");
      }

      //draw the symbols onto the squares
      if (piece) {      //aka not null
        square.textContent = pieceSymbols[piece.color + piece.type]; // e.g. "wk"
      }

      const label = document.createElement("span");
    label.className = "square-label";
    label.textContent = "abcdefgh"[col] + (8 - row);
    square.appendChild(label);

      boardDisplay.appendChild(square);
    }
  }
}


document.getElementById("clock-start").addEventListener("click", () => {
  if (!game.isGameOver()) setClock(game.turn());
});

document.getElementById("clock-stop").addEventListener("click", () => {
  setClock(null);
});



function showMove(event) {
  event.preventDefault();
  if (clockExpired()) return; 
  
  const playerMove = input.value.trim();  // trim removes whitespace

  try {
    const checkedMove = game.move(playerMove);
    switchClock(game.isGameOver() ? null : game.turn());

    output.textContent = "Move played: " + checkedMove.san; 
    renderMoveHistory(); //update the move history
    renderBoard(); // update the board
    input.value = ""; // clear the input field after a successful move
    
    if (!game.isGameOver()) {
      askStockfish();
    }

    } 

    catch (error) {
    output.textContent = "Move is not legal.";
  }
}

function renderMoveHistory() {
    const history = game.history(); // returns an array of moves
  
    movesDisplay.textContent = history.join("\n");
  }

form.addEventListener("submit", showMove);


async function askStockfish() {
    moveButton.disabled = true;
    engineOutput.textContent = "Thinking...";
  
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay before API call

      const reply = await getEngineMove(game.fen());
      if (clockExpired()) return;

      const computerMove = game.move(reply.move);
      switchClock(game.isGameOver() ? null : game.turn()); 
      renderMoveHistory(); //update the move history
      renderBoard(); //updates the board
  
      console.log("API response:", reply);
  
      engineOutput.textContent = "Computer's move: " + computerMove.san;
    } catch (error) {
      engineOutput.textContent = "Computer error: " + error.message;
    } finally {
      moveButton.disabled = false;
    }
  }

  renderBoard();

  



