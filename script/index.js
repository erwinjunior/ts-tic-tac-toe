"use strict";
const TURN = {
    CROSS: 'turn-x',
    CIRCLE: 'turn-o',
};
const STATUS = {
    PLAYING: 'playing',
    END: 'end',
    X_WIN: 'X WIN',
    O_WIN: 'O WIN',
};
const CELL_CLASS_DOM = {
    CROSS: 'cross',
    CIRCLE: 'circle',
    WIN: 'win',
};
const CELL_VALUE = {
    CROSS: 'X',
    CIRCLE: 'O',
};
// Global Variables
const BUTTON_SHOW = 'button--show', CLICKED_CELL = 'clicked';
let currentTurn = TURN.CROSS;
let gameStatus = STATUS.PLAYING;
let cellValues = new Array(9).fill('');
const getGameStatus = (cellValues) => {
    const winValues = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    const winIndex = winValues.findIndex((value) => {
        const first = cellValues[value[0]];
        const second = cellValues[value[1]];
        const third = cellValues[value[2]];
        return first !== '' && first === second && first === third;
    });
    if (winIndex > 0) {
        const winValueIndex = winValues[winIndex][0];
        const winValue = cellValues[winValueIndex];
        return {
            status: winValue === CELL_VALUE.CIRCLE ? STATUS.O_WIN : STATUS.X_WIN,
            winPosition: winValues[winIndex],
        };
    }
    // check end game
    const isEndGame = cellValues.filter((x) => x === '').length === 0;
    return {
        status: isEndGame ? STATUS.END : STATUS.PLAYING,
        winPosition: [],
    };
};
const showReplayButton = () => {
    const replayBtn = document.querySelector('.button');
    if (!replayBtn)
        return;
    replayBtn.classList.add(BUTTON_SHOW);
};
const hideReplayButton = () => {
    const replayBtn = document.querySelector('.button');
    if (!replayBtn)
        return;
    replayBtn.classList.remove(BUTTON_SHOW);
};
const setCurrentTurn = (turnElement) => {
    turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    turnElement.classList.add(currentTurn);
};
const resetGame = () => {
    const cells = document.querySelectorAll('.cell-item');
    if (!cells)
        return;
    gameStatus = STATUS.PLAYING;
    updateGameStatus(gameStatus);
    currentTurn = TURN.CROSS;
    // reset cells
    cellValues = cellValues.map((cell) => (cell = ''));
    // reset turn
    const turn = document.querySelector('.turn');
    if (!turn)
        return;
    setCurrentTurn(turn);
    // dell class
    cells.forEach((cell) => {
        cell.className = '';
        cell.classList.add('cell-item');
    });
    hideReplayButton();
};
const handleClickResetGame = () => {
    const replayBtn = document.querySelector('.button');
    if (!replayBtn)
        return;
    replayBtn.addEventListener('click', resetGame);
};
const updateGameStatus = (status) => {
    const statusElement = document.querySelector('.status');
    if (!statusElement)
        return;
    statusElement.textContent = status;
    gameStatus = status;
    // remove hover effect for all cells
    const cells = document.querySelectorAll('.cell-item');
    if (!cells)
        return;
    cells.forEach((cell) => {
        if (!cell.classList.contains(CLICKED_CELL))
            cell.classList.add(CLICKED_CELL);
    });
};
const highlightWinCell = (winPosition) => {
    winPosition.forEach((index) => {
        const cellWin = document.querySelector(`.cell-item:nth-child(${index + 1})`);
        if (cellWin)
            cellWin.classList.add(CELL_CLASS_DOM.WIN);
    });
};
const toggleTurn = () => {
    const turn = document.querySelector('.turn');
    if (!turn)
        return;
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    setCurrentTurn(turn);
};
const handleCellClick = (cell, index) => {
    // check cell is clicked
    const isClicked = cell.classList.contains(CELL_CLASS_DOM.CIRCLE) ||
        cell.classList.contains(CELL_CLASS_DOM.CROSS);
    // check game is not playing
    const isNotPlaying = getGameStatus(cellValues).status !== STATUS.PLAYING;
    if (isNotPlaying || isClicked)
        return;
    // add class for cell
    const cellValue = currentTurn === TURN.CIRCLE ? CELL_CLASS_DOM.CIRCLE : CELL_CLASS_DOM.CROSS;
    cell.classList.add(cellValue);
    cell.classList.add(CLICKED_CELL);
    cellValues[index] =
        cellValue === CELL_CLASS_DOM.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
    // check game status
    const game = getGameStatus(cellValues);
    switch (game.status) {
        case STATUS.O_WIN:
        case STATUS.X_WIN:
            // highlight win cell on UI
            highlightWinCell(game.winPosition);
            // show replay button
            showReplayButton();
            // update game status
            updateGameStatus(game.status);
            // reset game
            handleClickResetGame();
            break;
        case STATUS.END:
            // show replay button
            showReplayButton();
            // update game status
            updateGameStatus(game.status);
            // reset game
            handleClickResetGame();
            break;
        default:
            break;
    }
    toggleTurn();
};
const initGame = () => {
    const cells = document.querySelectorAll('.cell-item');
    if (!cells)
        return;
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            handleCellClick(cell, index);
        });
    });
};
// -------------MAIN-------------
initGame();
