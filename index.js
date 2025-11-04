const board = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");

const humanScoreEl = document.getElementById("humanScore");
const computerScoreEl = document.getElementById("computerScore");
const drawScoreEl = document.getElementById("drawScore");

const human = "X";
const computer = "O";
let cells = JSON.parse(localStorage.getItem("cells")) || ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

//  Load saved scores
let humanScore = parseInt(localStorage.getItem("humanScore")) || 0;
let computerScore = parseInt(localStorage.getItem("computerScore")) || 0;
let drawScore = parseInt(localStorage.getItem("drawScore")) || 0;

humanScoreEl.textContent = humanScore;
computerScoreEl.textContent = computerScore;
drawScoreEl.textContent = drawScore;

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
  saveGameState();
  checkWinner();
  createBoard();
  if (!gameOver) setTimeout(computerMove, 500);
}

function computerMove() {
  if (gameOver) return;

  const empty = cells.map((v, i) => (v === "" ? i : null)).filter(v => v !== null);
  if (!empty.length) return;

  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // 1️ Try to win
  for (let p of winPatterns) {
    const [a,b,c] = p;
    const pattern = [cells[a], cells[b], cells[c]];
    if (pattern.filter(x => x === computer).length === 2 && pattern.includes("")) {
      const idx = p[pattern.indexOf("")];
      cells[idx] = computer;
      saveGameState();
      checkWinner();
      createBoard();
      return;
    }
  }

  // 2️ Block human
  for (let p of winPatterns) {
    const [a,b,c] = p;
    const pattern = [cells[a], cells[b], cells[c]];
    if (pattern.filter(x => x === human).length === 2 && pattern.includes("")) {
      const idx = p[pattern.indexOf("")];
      cells[idx] = computer;
      saveGameState();
      checkWinner();
      createBoard();
      return;
    }
  }

  // 3️ Center if free
  if (cells[4] === "") {
    cells[4] = computer;
    saveGameState();
    checkWinner();
    createBoard();
    return;
  }

  // 4️ Corners
  const corners = [0, 2, 6, 8].filter(i => cells[i] === "");
  if (corners.length) {
    const idx = corners[Math.floor(Math.random() * corners.length)];
    cells[idx] = computer;
    saveGameState();
    checkWinner();
    createBoard();
    return;
  }

  // 5️ Random empty
  const idx = empty[Math.floor(Math.random() * empty.length)];
  cells[idx] = computer;
  saveGameState();
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
        localStorage.setItem("humanScore", humanScore);
      } else {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        localStorage.setItem("computerScore", computerScore);
      }
      saveGameState();
      return;
    }
  }

  if (!cells.includes("")) {
    message.textContent = "It's a Draw!";
    gameOver = true;
    drawScore++;
    drawScoreEl.textContent = drawScore;
    localStorage.setItem("drawScore", drawScore);
    saveGameState();
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
  cells = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  message.textContent = "";
  createBoard();
  document.querySelectorAll(".win-line").forEach(l => l.remove());
  saveGameState();
});

//  Save current game to localStorage
function saveGameState() {
  localStorage.setItem("cells", JSON.stringify(cells));
}

//  Load saved board
createBoard();
