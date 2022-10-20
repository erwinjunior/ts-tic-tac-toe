interface Turn {
    CROSS: string;
    CIRCLE: string;
}

const TURN: Turn = {
    CROSS: 'turn-x',
    CIRCLE: 'turn-o',
};

interface Status {
    PLAYING: string;
    END: string;
    X_WIN: string;
    O_WIN: string;
}

const STATUS: Status = {
    PLAYING: 'playing',
    END: 'end',
    X_WIN: 'X WIN',
    O_WIN: 'O WIN',
};

interface CellClass extends Turn {
    WIN: string;
}

const CELL_CLASS_DOM: CellClass = {
    CROSS: 'cross',
    CIRCLE: 'circle',
    WIN: 'win',
};

interface Game {
    status: string;
    winPosition: Array<number>;
}

const CELL_VALUE: Turn = {
    CROSS: 'X',
    CIRCLE: 'O',
};

// Global Variables

const BUTTON_SHOW: string = 'button--show',
    CLICKED_CELL: string = 'clicked';
let currentTurn: string = TURN.CROSS;
let gameStatus: string = STATUS.PLAYING;
let cellValues = new Array<string>(9).fill('');

const getGameStatus = (cellValues: Array<string>): Game => {
    const winValues: Array<Array<number>> = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const winIndex: number = winValues.findIndex((value: Array<number>): boolean => {
        const first: string = cellValues[value[0]];
        const second: string = cellValues[value[1]];
        const third: string = cellValues[value[2]];
        return first !== '' && first === second && first === third;
    });

    if (winIndex > 0) {
        const winValueIndex: number = winValues[winIndex][0];
        const winValue: string = cellValues[winValueIndex];

        return {
            status: winValue === CELL_VALUE.CIRCLE ? STATUS.O_WIN : STATUS.X_WIN,
            winPosition: winValues[winIndex],
        };
    }

    // check end game
    const isEndGame: boolean =
        cellValues.filter((x: string): boolean => x === '').length === 0;

    return {
        status: isEndGame ? STATUS.END : STATUS.PLAYING,
        winPosition: [],
    };
};

const showReplayButton = (): void => {
    const replayBtn = document.querySelector<HTMLButtonElement>('.button');
    if (!replayBtn) return;
    replayBtn.classList.add(BUTTON_SHOW);
};

const hideReplayButton = (): void => {
    const replayBtn = document.querySelector<HTMLButtonElement>('.button');
    if (!replayBtn) return;
    replayBtn.classList.remove(BUTTON_SHOW);
};

const setCurrentTurn = (turnElement: HTMLHeadingElement) => {
    turnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
    turnElement.classList.add(currentTurn);
};

const resetGame = (): void => {
    const cells: NodeListOf<HTMLLIElement> = document.querySelectorAll('.cell-item');
    if (!cells) return;
    gameStatus = STATUS.PLAYING;
    updateGameStatus(gameStatus);
    currentTurn = TURN.CROSS;
    // reset cells
    cellValues = cellValues.map((cell: string) => (cell = ''));

    // reset turn
    const turn = document.querySelector<HTMLHeadingElement>('.turn');
    if (!turn) return;
    setCurrentTurn(turn);
    // dell class

    cells.forEach((cell: HTMLLIElement) => {
        cell.className = '';
        cell.classList.add('cell-item');
    });

    hideReplayButton();
};

const handleClickResetGame = (): void => {
    const replayBtn = document.querySelector<HTMLButtonElement>('.button');
    if (!replayBtn) return;
    replayBtn.addEventListener('click', resetGame);
};

const updateGameStatus = (status: string): void => {
    const statusElement = document.querySelector<HTMLSpanElement>('.status');
    if (!statusElement) return;
    statusElement.textContent = status;
    gameStatus = status;
    // remove hover effect for all cells
    const cells: NodeListOf<HTMLLIElement> = document.querySelectorAll('.cell-item');
    if (!cells) return;
    cells.forEach((cell) => {
        if (!cell.classList.contains(CLICKED_CELL)) cell.classList.add(CLICKED_CELL);
    });
};

const highlightWinCell = (winPosition: Array<number>): void => {
    winPosition.forEach((index: number): void => {
        const cellWin = document.querySelector<HTMLLIElement>(
            `.cell-item:nth-child(${index + 1})`
        );
        if (cellWin) cellWin.classList.add(CELL_CLASS_DOM.WIN);
    });
};

const toggleTurn = (): void => {
    const turn = document.querySelector<HTMLHeadingElement>('.turn');
    if (!turn) return;
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;
    setCurrentTurn(turn);
};

const handleCellClick = (cell: HTMLLIElement, index: number): void => {
    // check cell is clicked
    const isClicked: boolean =
        cell.classList.contains(CELL_CLASS_DOM.CIRCLE) ||
        cell.classList.contains(CELL_CLASS_DOM.CROSS);

    // check game is not playing
    const isNotPlaying: boolean = getGameStatus(cellValues).status !== STATUS.PLAYING;
    if (isNotPlaying || isClicked) return;

    // add class for cell
    const cellValue =
        currentTurn === TURN.CIRCLE ? CELL_CLASS_DOM.CIRCLE : CELL_CLASS_DOM.CROSS;
    cell.classList.add(cellValue);
    cell.classList.add(CLICKED_CELL);
    cellValues[index] =
        cellValue === CELL_CLASS_DOM.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

    // check game status
    const game: Game = getGameStatus(cellValues);
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

const initGame = (): void => {
    const cells: NodeListOf<HTMLLIElement> = document.querySelectorAll('.cell-item');

    if (!cells) return;
    cells.forEach((cell: HTMLLIElement, index: number) => {
        cell.addEventListener('click', () => {
            handleCellClick(cell, index);
        });
    });
};

// -------------MAIN-------------

initGame();
