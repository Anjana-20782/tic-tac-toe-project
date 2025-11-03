const board = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

const humanScoreEl = document.getElementById("humanScore");
const computerScoreEl = document.getElementById("computerScore");
const drawScoreEl = document.getElementById("drawScore");

let cells = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const computer = "O";
let gameOver = false;

let humanScore = 0;
let computerScore = 0;
let drawScore = 0;

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.addEventListener("click", () => makeMove(index));
    board.appendChild(div);
  });
}

function makeMove(index) {
  if (cells[index] !== "" || gameOver) return;
  cells[index] = human;
  checkWinner();
  createBoard();
  if (!gameOver) setTimeout(computerMove, 500);
}

function computerMove() {
  const empty = cells.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
  if (!empty.length) return;
  const randomIndex = empty[Math.floor(Math.random() * empty.length)];
  cells[randomIndex] = computer;
  checkWinner();
  createBoard();
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let p of winPatterns) {
    const [a,b,c] = p;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      message.textContent = `${cells[a]} wins!`;
      gameOver = true;
      drawWinLine(p);
      if (cells[a] === human) {
        humanScore++;
        humanScoreEl.textContent = humanScore;
      } else {
        computerScore++;
        computerScoreEl.textContent = computerScore;
      }
      return;
    }
  }

  if (!cells.includes("")) {
    message.textContent = "It's a Draw!";
    gameOver = true;
    drawScore++;
    drawScoreEl.textContent = drawScore;
  }
}

function drawWinLine(pattern) {
  const line = document.createElement("div");
  line.classList.add("win-line");
  const map = {
    "0,1,2": "row1", "3,4,5": "row2", "6,7,8": "row3",
    "0,3,6": "col1", "1,4,7": "col2", "2,5,8": "col3",
    "0,4,8": "diag1", "2,4,6": "diag2"
  };
  line.classList.add(map[pattern.join(",")]);
  board.appendChild(line);
}

resetBtn.addEventListener("click", () => {
  cells = ["","","","","","","","",""];
  gameOver = false;
  message.textContent = "";
  createBoard();
  document.querySelectorAll(".win-line").forEach(l => l.remove());
});

createBoard();
