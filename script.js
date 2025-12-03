
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
//Function to draw interactable entities as a representative rectangle.
function drawEntity(entity, canvas) {
    //1.) Get context
    const ctx = canvas.getContext("2d");
    //2.) Fill rectangle based on entity values
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
}
//Function that updates the place an interactable entity exists within
function moveEntity(entity, canvas, dir, speed) {
    //1.) Make sure game is active
    if (window.gameFrozen) return;
    const ctx = canvas.getContext("2d");
    //2.) Clear rectangle representation of entity
    ctx.clearRect(entity.x, entity.y, entity.width, entity.height);

    //3.) Update position of entity based on movement direction
    if (dir === 1) entity.x += speed;       // right
    if (dir === -1) entity.x -= speed;      // left

    drawEntity(entity, canvas);
}
//Function that causes an interactable entity to pursue another left or right
function chaseEntity(chaser, chasey, canvas) {
    //1.) Make sure game is active
    if (window.gameFrozen) return; //new
    //2.) Only if player hasn't acquired keyCard (freed the spirit)
    if ( keyCard == 0 ) {
        //3.) Move the chaser depending on which direction the chasey is in
        if (chaser.x > chasey.x) {
            moveEntity(chaser, canvas, -1, 10);
        }
        else if (chaser.x < chasey.x - 250) {
            moveEntity(chaser, canvas, 1, 10);
        }

        //new
        //4.) If the chaser has met the chasey, kill them
        else {
            //4a.) Close puzzle (only happens if it is open)
            closePuzzle("lightsOutCanvas");
            //4b.) Display gameover screen
            showResultOverlay(
                "You were caught by the wrathful spirit… your soul is now trapped in the Midnight Lodge.",
                false
            );

            window.gameFrozen = true;
        }
    ////
    }
}
//Function that displays the end game screen
function showResultOverlay(message, isWin, isFinal = false) {
    //1.) Initialize variables
    const overlay = document.getElementById("result-overlay");
    const title = document.getElementById("result-title");
    const msg = document.getElementById("result-message");
    const winBtn = document.getElementById("win-close-btn");
    const restartBtn = document.getElementById("restart-btn");

    overlay.classList.remove("win", "lose");
    winBtn.style.display = "none";
    restartBtn.style.display = "none";
    //2.) If the player has won the game display the winning overlay
    if (isWin) {
        overlay.classList.add("win");
        title.textContent = "YOU ESCAPED!";
        winBtn.style.display = "inline-block";
        //2a.) Close the overlay if it is for the minigame after a delay
        if (!isFinal) {
            window.winAutoCloseTimer = setTimeout(() => {
                overlay.classList.remove("show");
            }, 3000);
        }
    } 
    //3.) Otherwise, display the losing overlay
    else {
        overlay.classList.add("lose");
        title.textContent = "YOU FAILED…";

        if (isFinal) {
            restartBtn.style.display = "inline-block";
        }
    }

    msg.textContent = message;
    overlay.classList.add("show");
    //4.) Freeze the game if it is completely over.
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
//Draws the Lights Out minigame grid based off the data of a 2D array of 1's and 0's
function lightsOutDraw(grid) {
    //1.) Initialize necessary variables
    const canvas = document.getElementById("lightsOutCanvas");
    const ctx = canvas.getContext("2d");

    const boxSize = canvas.height / 5 - 10;
    const cell = canvas.height / 5;
    //2.) Clear the grid each frame before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //3.) For every entry in the array, draw a yellow square if it is 1 and a blue square if it is 0
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillStyle = grid[i][j] ? "yellow" : "blue";
            ctx.fillRect(i * cell + 5, j * cell + 5, boxSize, boxSize);
        }
    }
}
//Checks if the Lights Out game has been completed
function lightsOutCheckWin(grid) {
    //1.) Initialize counter
    let offCount = 0;
    //2.) Increment counter for every entry that is inactive (0)
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (grid[i][j] === 0) offCount++;
        }
    }
    //3.) Return true if offCount is equal to the total amount of entries
    return offCount === 25;
}
//Function that switches the lights clicked by mouse for Lights Out minigame
function lightsOutSwitch(grid, x, y) {
    //1.) Initialize array of coordinate data
    const positions = [
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]
    ];
    //2.) Switch the value of the clicked on square, as well as adjacent squares above and beside it
    positions.forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < 5 && ny >= 0 && ny < 5) {
            grid[nx][ny] = grid[nx][ny] ? 0 : 1;
        }
    });
}
//Function that finds which rectangle is clicked by a mouse for the Lights Out minigame
function lightsOutCoord(canvas, event, grid) {
    //1.) Initialize variables
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    //2.) Math out the square that was clicked based on raw mouse input and size of each square
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
//Function that starts the timed Lights Out minigame
//1.) Initialize values
let puzzleTimer = null;
let puzzleTimeLeft = 60;

function startPuzzleTimer() {
    puzzleTimeLeft = 60;

    //2.) Set an interval that decrements puzzle timer once every second (for a minute)
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
//Function that opens minigame puzzles
function openPuzzle(id) {
    //1.) Check if game is frozen
    if (window.gameFrozen) return; //new///////
    //2.) Initialize values
    currentPuzzle = id;
    //3.) Hide game canvas
    document.getElementById("gameCanvas").style.display = "none";
    //4.) Display puzzle canvas and exit button
    document.getElementById(id).style.display = "block";
    document.getElementById("puzzle-exit").style.display = "block";
    //5.) Show associated dialogue to the minigame being opened
    if (id === "lightsOutCanvas") {
        showDialogue("You open the door to find an old closet with a broken power grid panel. Turn off all the lights.");
    }

    startPuzzleTimer();
}
//Function that closes minigame puzzles
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
    //5.) Only represent spirits if the player has not yet freed them
    if ( keyCard == 0 ) {
        context.drawImage(
            enemy.image, eSrcX, srcY, enemy.image.width/4, enemy.image.height/4,
            enemy.x - 20, enemy.y, enemy.image.width/4, enemy.image.height/4
        );
    }
    //6.) Keep track of which animation frame we are on
    framesDrawn++;
    if (framesDrawn >= 20) {
        currentFrame++;
        framesDrawn = 0;
    }
}

//Initialize values here
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

    //2.) Animate the gamestate every frame
    animate(gameCanvas, player, enemyplayer);

    // Show instructions under main game canvas
     showDialogue(
    "Behind the red door on the right lies the Lights-Out puzzle... the hotel’s broken power grid. Solve the puzzle to reactivate the elevator. A single chance to escape before the spirits reach you.\n\nInstructions: Use the arrow keys to run, and press SPACE to enter the door. Move fast… they’re closing in."
);


     //3.) Initialize lights out grid before canvas needs opened
    lightsOutDraw(grid);
    lightsOutClick(grid, lightsCanvas);
    //4.) Start game timer. When it ends, the spirit will pursue the player
    setTimeout(() => {
        //enemyplayer.image = newSrite;
        enemyplayer.image = attackingSprite;   
        setInterval(chaseEntity, 200, enemyplayer, player, gameCanvas);
    }, 120000);

    //5.) Check for player input

    document.addEventListener("keydown", function(event) {
        if (window.gameFrozen) return;
        //5a.) Move depending on what key is pressed (left or right)
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
        //5b.) Check interaction if the player presses space
        if (event.key === " ") {

            // Closet door → puzzle
            if (player.x > door.x - 100 && player.x < door.x + door.width + 30) {
                openPuzzle("lightsOutCanvas");
                doorSound.play();
                clockSound.play();
                setTimeout(() => clockSound.pause(), 60000);
            }

            // Elevator escape
            //5ba.) If the player has the key card and tries to use the elevator they will escape
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
    //1.) Init.
    const box = document.getElementById("dialog-box");
    const txt = document.getElementById("dialog-text");
    //2.) Display string within text box under canvases
    txt.textContent = text;
    box.style.display = "block";
    box.classList.add("active");
}

function hideDialogue() {
    //1.) Init.
    const box = document.getElementById("dialog-box");
    //2.) Hide dialogue box and its contents
    box.classList.remove("active");
    box.style.display = "none";
}

document.getElementById("dialog-close").addEventListener("click", hideDialogue);


/* START GAME */
//Function that begins the playing of the main game
function startGame() {
    //1.) Wait for page context to load
    window.addEventListener("DOMContentLoaded", () => {
        //2.) Init.
        const startButton = document.getElementById("start-btn");
        const startScreen = document.querySelector(".start-screen");
        const wrapper = document.getElementById("wrapper");
        const gameCanvas = document.getElementById("gameCanvas");
        //3.) Start game features after the start button is clicked
        startButton.addEventListener("click", () => {
            startScreen.classList.add("fade-out");
            music.play();

            setTimeout(() => {
                startScreen.style.display = "none";
                wrapper.classList.add("show");
                gameCanvas.classList.add("show");
                mainGame();
            }, 1000);
        });
    });
}

startGame();

