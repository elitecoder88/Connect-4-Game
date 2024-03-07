const WIDTH = 7;
const HEIGHT = 6;
let currentPlayer = 1;
let board = [];
let gameOver = false;

// Create game board
function createBoard() {
    const gameBoard = document.getElementById('game-board');
    for (let row = 0; row < HEIGHT; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        for (let col = 0; col < WIDTH; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = row;
            cellDiv.dataset.col = col;
            cellDiv.addEventListener('click', () => dropPiece(col));
            rowDiv.appendChild(cellDiv);
        }
        gameBoard.appendChild(rowDiv);
    }
    // Initialize board array
    board = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    updateTurnIndicator();
    
    // Add mouseover and mouseout event listeners for column highlighting
    for (let col = 0; col < WIDTH; col++) {
        const topCell = document.querySelector(`[data-row="0"][data-col="${col}"]`);
        topCell.addEventListener('mouseover', () => highlightColumn(col));
        topCell.addEventListener('mouseout', () => removeColumnHighlight(col));
    }
}

// Drop a piece into the specified column
function dropPiece(col) {
    if (gameOver) return;

    const rowIndex = getLowestEmptyRow(col);
    if (rowIndex !== -1) {
        const cell = document.querySelector(`[data-row="${rowIndex}"][data-col="${col}"]`);
        const playerClass = currentPlayer === 1 ? 'player-1' : 'player-2';
        cell.classList.add(playerClass);
        board[rowIndex][col] = currentPlayer;
        if (checkWin(rowIndex, col)) {
            gameOver = true;
            alert(`Player ${currentPlayer} wins!`);
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateTurnIndicator();
        }
    }
}

// Get the lowest empty row in a column
function getLowestEmptyRow(col) {
    for (let row = HEIGHT - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            return row;
        }
    }
    return -1; // Column is full
}

// Check if the current player has won
function checkWin(row, col) {
    const directions = [
        [-1, 0], // vertical
        [0, 1], // horizontal
        [1, 1], // diagonal /
        [1, -1] // diagonal \
    ];
    for (const [dx, dy] of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            if (newRow < 0 || newRow >= HEIGHT || newCol < 0 || newCol >= WIDTH) break;
            if (board[newRow][newCol] === currentPlayer) count++;
            else break;
        }
        for (let i = 1; i < 4; i++) {
            const newRow = row - dx * i;
            const newCol = col - dy * i;
            if (newRow < 0 || newRow >= HEIGHT || newCol < 0 || newCol >= WIDTH) break;
            if (board[newRow][newCol] === currentPlayer) count++;
            else break;
        }
        if (count >= 4) return true;
    }
    return false;
}

// Update the turn indicator text
function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turn-indicator');
    turnIndicator.textContent = `Player ${currentPlayer}'s Turn`;
}

// Reset the game
function resetGame() {
    gameOver = false;
    const gameBoard = document.getElementById('game-board');
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
    createBoard();
    currentPlayer = 1;
    updateTurnIndicator(); // Reset turn indicator to player 1's turn
}

// Highlight the column when hovering
function highlightColumn(col) {
    const cells = document.querySelectorAll(`[data-col="${col}"]`);
    cells.forEach(cell => cell.classList.add('highlight'));
}

// Remove column highlight when mouse leaves
function removeColumnHighlight(col) {
    const cells = document.querySelectorAll(`[data-col="${col}"]`);
    cells.forEach(cell => cell.classList.remove('highlight'));
}

// Initialize game
createBoard();

