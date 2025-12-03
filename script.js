
// cht links:
//  https://chatgpt.com/share/6930bec3-495c-8003-ab60-16fbf939b2ff
//  https://chatgpt.com/share/6930bf0e-eda4-8003-8ecb-ead4c53fcf66 
//  Imagry AI use:
// www.ludo.com for sprites and backgroun imgaes 
// chatgpt for some background link

let currentPuzzle = null;
window.gameFrozen = false; //new

/*  PLAYER CLASS */
class Player {
    constructor(x, y, height, width, image) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.image = image;
        this.frozen = false; //new
    }
}

function drawEntity(entity, canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
}

function moveEntity(entity, canvas, dir, speed) {
    if (window.gameFrozen) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(entity.x, entity.y, entity.width, entity.height);

    if (dir === 1) entity.x += speed;       // right
    if (dir === -1) entity.x -= speed;      // left

    drawEntity(entity, canvas);
}

function chaseEntity(chaser, chasey, canvas) {
    if (window.gameFrozen) return; //new

    if ( keyCard == 0 ) {
        if (chaser.x > chasey.x) {
            moveEntity(chaser, canvas, -1, 10);
        }
        else if (chaser.x < chasey.x - 250) {
            moveEntity(chaser, canvas, 1, 10);
        }

        //new
        else {
            closePuzzle("lightsOutCanvas");

            showResultOverlay(
                "You were caught by the wrathful spirit… your soul is now trapped in the Midnight Lodge.",
                false
            );

            window.gameFrozen = true;
        }
    ////
    }
}

function showResultOverlay(message, isWin, isFinal = false) {
    const overlay = document.getElementById("result-overlay");
    const title = document.getElementById("result-title");
    const msg = document.getElementById("result-message");
    const winBtn = document.getElementById("win-close-btn");
    const restartBtn = document.getElementById("restart-btn");

    overlay.classList.remove("win", "lose");
    winBtn.style.display = "none";
    restartBtn.style.display = "none";

    if (isWin) {
        overlay.classList.add("win");
        title.textContent = "YOU ESCAPED!";
        winBtn.style.display = "inline-block";

        if (!isFinal) {
            window.winAutoCloseTimer = setTimeout(() => {
                overlay.classList.remove("show");
            }, 3000);
        }
    } 
    else {
        overlay.classList.add("lose");
        title.textContent = "YOU FAILED…";

        if (isFinal) {
            restartBtn.style.display = "inline-block";
        }
    }

    msg.textContent = message;
    overlay.classList.add("show");

    if (isFinal) {
        window.gameFrozen = true;
    } 
    else {
        window.gameFrozen = false;
    }
}

// Close button (puzzle win only)
document.getElementById("win-close-btn").addEventListener("click", () => {
    document.getElementById("result-overlay").classList.remove("show");
});

// Restart button
document.getElementById("restart-btn").addEventListener("click", () => {
    window.location.reload();
});

//////

/* LIGHTS OUT PUZZLE FUNCTIONS */

function lightsOutDraw(grid) {
    const canvas = document.getElementById("lightsOutCanvas");
    const ctx = canvas.getContext("2d");

    const boxSize = canvas.height / 5 - 10;
    const cell = canvas.height / 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillStyle = grid[i][j] ? "yellow" : "blue";
            ctx.fillRect(i * cell + 5, j * cell + 5, boxSize, boxSize);
        }
    }
}

function lightsOutCheckWin(grid) {
    let offCount = 0;

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (grid[i][j] === 0) offCount++;
        }
    }
    return offCount === 25;
}

function lightsOutSwitch(grid, x, y) {
    const positions = [
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]
    ];

    positions.forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
            grid[nx][ny] = grid[nx][ny] ? 0 : 1;
        }
    });
}

function lightsOutCoord(canvas, event, grid) {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    x = Math.floor(x / (canvas.width / 5));
    y = Math.floor(y / (canvas.height / 5));

    lightsOutSwitch(grid, x, y);
    lightsOutDraw(grid);

    //new/////

    if (lightsOutCheckWin(grid)) {
        keyCard = 1;
        closePuzzle("lightsOutCanvas");

        showResultOverlay(
            "You restored the power grid! The elevator is active. RUN before the spirit reaches you!",
            true
        );
    }
}

////////

function lightsOutClick(grid, canvas) {
    canvas.addEventListener("mousedown", e => lightsOutCoord(canvas, e, grid));
}

/* PUZZLE OPEN / CLOSE */

let puzzleTimer = null;
let puzzleTimeLeft = 60;

function startPuzzleTimer() {
    puzzleTimeLeft = 60;

    puzzleTimer = setInterval(() => {
        if (puzzleTimeLeft <= 0) {
            closePuzzle("lightsOutCanvas");

            ////new////

            showResultOverlay(
                "You have been caught by a wrathful spirit. You are doomed now to wander the halls of the Midnight Lodge for eternity.",
                false,
                true
            );

            window.gameFrozen = true;
        }

        //////

        puzzleTimeLeft--;
    }, 1000);
}

function openPuzzle(id) {
    if (window.gameFrozen) return; //new///////

    currentPuzzle = id;

    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById(id).style.display = "block";
    document.getElementById("puzzle-exit").style.display = "block";

    if (id === "lightsOutCanvas") {
        showDialogue("You open the door to find an old closet with a broken power grid panel. Turn off all the lights.");
    }

    startPuzzleTimer();
}

function closePuzzle(id) {
    clockSound.pause();
    document.getElementById(id).style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";

    document.getElementById("puzzle-exit").style.display = "none";

    hideDialogue();
    clearInterval(puzzleTimer);
    currentPuzzle = null;
}
///new////
document.getElementById("puzzle-exit").addEventListener("click", () => {
    if (currentPuzzle && !window.gameFrozen) {
        closePuzzle(currentPuzzle);
        ///
    }
});

// MAIN GAME LOGIC 
//animation initializers
let currentFrame = 0;
let totalFrames = 4;
let srcX = 0; 
let srcY = 0;
let pSrcX = 0;
let eSrcX = 0;
let framesDrawn = 0;
const hallwayImage = new Image();
hallwayImage.src = "assets/hallway2n&3rd.png";

function animate(canvas, player, enemy) {
    if (window.gameFrozen) return;
    const context = canvas.getContext("2d");

    //Clear canvas every frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(() => animate(canvas, player, enemy));

      //Sprite animation
    //1.) track frame of spritesheet

    currentFrame = currentFrame % totalFrames;


    //2.) get source coordinate from spritesheet

    pSrcX = currentFrame * player.image.width / 4;
    eSrcX = currentFrame * enemy.image.width / 4;

     //.3) draw hallway background first

    context.drawImage(hallwayImage, 0, 0, hallwayImage.width, hallwayImage.height);

      //4.) draw only the section of the spritesheet that is the current frame for player and enemy

    context.drawImage(
        player.image, pSrcX, srcY, player.image.width/4, player.image.height/4,
        player.x - 20, player.y - 70, player.image.width/4, player.image.height/4
    );

    if ( keyCard == 0 ) {
        context.drawImage(
            enemy.image, eSrcX, srcY, enemy.image.width/4, enemy.image.height/4,
            enemy.x - 20, enemy.y, enemy.image.width/4, enemy.image.height/4
        );
    }

    framesDrawn++;
    if (framesDrawn >= 20) {
        currentFrame++;
        framesDrawn = 0;
    }
}

const clockSound = new Audio("assets/clock.mp3");
clockSound.loop = true;

let keyCard = 0;
const music = new Audio("assets/music.mp3");

function mainGame() {

    //1.) Initialize a bunch of important variables
    //Main game initializers
    const gameCanvas = document.getElementById("gameCanvas");
    const lightsCanvas = document.getElementById("lightsOutCanvas");

    lightsCanvas.style.display = "none";

    const playerSpriteSheet = new Image();
    playerSpriteSheet.src = "assets/player-pressing.png";

    const enemySpriteSheet = new Image();
    enemySpriteSheet.src = "assets/ghost-1-sleeping.png";

    const attackingSprite = new Image();
    attackingSprite.src = "assets/ghost-1-attacking.png";

    const walkSprite = new Image();
    walkSprite.src = "assets/player-walking.png";

    const elevatorSound = new Audio("assets/elevator.mp3");
    const doorSound = new Audio("assets/door.mp3");

    footstepSound = new Audio("assets/footsteps.mp3");
    footstepSound.loop = true;

    let player = new Player(900, 400, 50, 50, playerSpriteSheet);
    let door = new Player(900, 150, 150, 75, "brown");
    let enemyplayer = new Player(0, 300, 60, 50, enemySpriteSheet);

    let grid = [
        [0,0,0,0,0],
        [0,0,1,0,0],
        [0,1,1,1,0],
        [0,0,1,0,0],
        [0,0,0,0,0]
    ];

     //drawEntity(player, gameCanvas);
    //drawEntity(door, gameCanvas);

    //2.) Make sure to update the player on the gamestate first

    animate(gameCanvas, player, enemyplayer);

    // Show instructions under main game canvas
     showDialogue(
    "Behind the red door on the right lies the Lights-Out puzzle... the hotel’s broken power grid. Solve the puzzle to reactivate the elevator. A single chance to escape before the spirits reach you.\n\nInstructions: Use the arrow keys to run, and press SPACE to enter the door. Move fast… they’re closing in."
);


     //3.) Initialize lights out grid before canvas needs opened
    lightsOutDraw(grid);
    lightsOutClick(grid, lightsCanvas);

    setTimeout(() => {
        //enemyplayer.image = newSrite;
        enemyplayer.image = attackingSprite;   
        setInterval(chaseEntity, 200, enemyplayer, player, gameCanvas);
    }, 120000);

        //4.) Check for player input

    document.addEventListener("keydown", function(event) {
        if (window.gameFrozen) return;

        if (event.key === "ArrowLeft") {
            player.image = walkSprite;
            moveEntity(player, gameCanvas, -1, 5);
            if (player.x <= 0) player.x = 0;
            footstepSound.play();
        }

        if (event.key === "ArrowRight") {
            player.image = walkSprite;
            moveEntity(player, gameCanvas, 1, 5);
            if (player.x >= gameCanvas.width - player.width) {
                player.x = gameCanvas.width - player.width;
            }
            footstepSound.play();
        }

         // SPACE = interact

               if (event.key === " ") {

            // Closet door → puzzle
            if (player.x > door.x - 100 && player.x < door.x + door.width + 30) {
                openPuzzle("lightsOutCanvas");
                doorSound.play();
                clockSound.play();
                setTimeout(() => clockSound.pause(), 60000);
            }

            // Elevator escape
            if ((player.x > 50 && player.x < 300) && keyCard === 1) {

                elevatorSound.play();
                setTimeout(() => elevatorSound.pause(), 10000);
                music.pause();

                showResultOverlay(
                    "The keycard activates… the elevator opens. You escape!",
                    true,
                    true
                );

                window.gameFrozen = true;

                const overlay = document.getElementById("result-overlay");
                const winBtn = document.getElementById("win-close-btn");
                const restartBtn = document.getElementById("restart-btn");

                overlay.classList.add("show", "win");
                winBtn.style.display = "none";
                restartBtn.style.display = "inline-block";

                clearTimeout(window.winAutoCloseTimer);
            }
        } // END spacebar
    }); // END keydown
}


/* Universal DIALOGUE BOX */
function showDialogue(text) {
    const box = document.getElementById("dialog-box");
    const txt = document.getElementById("dialog-text");

    txt.textContent = text;
    box.style.display = "block";
    box.classList.add("active");
}

function hideDialogue() {
    const box = document.getElementById("dialog-box");
    box.classList.remove("active");
    box.style.display = "none";
}

document.getElementById("dialog-close").addEventListener("click", hideDialogue);


/* START GAME */
function startGame() {
    window.addEventListener("DOMContentLoaded", () => {
        const startButton = document.getElementById("start-btn");
        const startScreen = document.querySelector(".start-screen");
        const wrapper = document.getElementById("wrapper");
        const gameCanvas = document.getElementById("gameCanvas");

        startButton.addEventListener("click", () => {
            startScreen.classList.add("fade-out");
            music.play();

            setTimeout(() => {
                startScreen.style.display = "none";
                wrapper.classList.add("show");
                gameCanvas.classList.add("show");
                mainGame();
            }, 1000);

            //4.) Start ghostly pursuit after a delay, now that game has started

        });
    });
}

startGame();

