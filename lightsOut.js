/* LIGHTS OUT PUZZLE — FIXED TO WORK WITH UNIVERSAL EXIT  Canvas size = 1200 × 600*/

const lightsCanvas = document.getElementById("lightsOutCanvas");
const lightsCtx = lightsCanvas.getContext("2d");

// 5×5 grid
let grid = [
    [0,1,1,1,0],
    [1,0,1,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,1,0,0]
];

// Grid sizing (fills exactly the canvas)
const COLS = 5;
const ROWS = 5;
const cellWidth = lightsCanvas.width / COLS;   // 1200 ÷ 5 = 240
const cellHeight = lightsCanvas.height / ROWS; // 600 ÷ 5 = 120


/* DRAW PUZZLE GRID */
function lightsOutDraw() {
    lightsCtx.clearRect(0, 0, lightsCanvas.width, lightsCanvas.height);

    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            lightsCtx.fillStyle = grid[x][y] ? "yellow" : "rgb(0,70,160)";
            lightsCtx.fillRect(
                x * cellWidth,
                y * cellHeight,
                cellWidth - 5,
                cellHeight - 5
            );
        }
    }
}


/* TOGGLE TILE + NEIGHBORS */
function toggle(x, y) {
    const neighbors = [
        [0,0], [1,0], [-1,0], [0,1], [0,-1]
    ];

    neighbors.forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) {
            grid[nx][ny] = grid[nx][ny] ? 0 : 1;
        }
    });
}


/* WIN CHECK */
function checkWin() {
    return grid.flat().every(v => v === 0);
}


/*  CLICK HANDLING */
lightsCanvas.addEventListener("mousedown", e => {
    const rect = lightsCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Convert click to grid coords
    const gridX = Math.floor(mx / cellWidth);
    const gridY = Math.floor(my / cellHeight);

    // Toggle tiles
    toggle(gridX, gridY);
    lightsOutDraw();

    // If solved
    /////new//////
   if (checkWin()) {
    keyCard = 1;

    closePuzzle("lightsOutCanvas");

    showResultOverlay(
        "You restored the power grid! The elevator is active. RUN before the spirit reaches you!",
        true
    );
}     //////

});

    // If solved
//     if (checkWin()) {
//         showDialogue("You solved the puzzle, and found an ELEVATOR KEYCARD!");
//         keyCard = 1;
//         setTimeout(() => {
//             closePuzzle("lightsOutCanvas");
//         }, 3000);
//     }
// });



/* OPEN PUZZLE (triggered from script.js via openPuzzle()) */
function openLightsOut() {
    lightsOutDraw();
}

