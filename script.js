


let currentPuzzle = null;

/*  PLAYER CLASS */
class Player {
    constructor(x, y, height, width, image) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.image = image;
    }
}

function drawEntity(entity, canvas) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
}

function moveEntity(entity, canvas, dir, speed) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(entity.x, entity.y, entity.width, entity.height);

    if (dir === 1) entity.x += speed;       // right
    if (dir === -1) entity.x -= speed;      // left

    drawEntity(entity, canvas);
}

function chaseEntity( chaser, chasey, canvas ) {
    if ( chaser.x > chasey.x ) {
        moveEntity( chaser, canvas, -1, 10 );
    }
    else if ( chaser.x < chasey.x - 250 ) {
        moveEntity( chaser, canvas, 1, 10);
    }
    else {
        showDialogue( "You have been caught by a wrathful spirit. You are doomed now to wander the halls of the Midnight Lodge for eternity." );
    }
}

/* LIGHTS OUT PUZZLE FUNCTIONS*/

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
}

function lightsOutClick(grid, canvas) {
    canvas.addEventListener("mousedown", e => lightsOutCoord(canvas, e, grid));
}

/*PUZZLE OPEN / CLOSE*/

let puzzleTimer = null;
let puzzleTimeLeft = 60;

function startPuzzleTimer() {
    puzzleTimeLeft = 60;

    puzzleTimer = setInterval(() => {
        if (puzzleTimeLeft <= 0) {
            closePuzzle("lightsOutCanvas");
        }
        puzzleTimeLeft--;
    }, 1000);
}

function openPuzzle(id) {
    currentPuzzle = id;

    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById(id).style.display = "block";

    // SHOW EXIT BUTTON
    document.getElementById("puzzle-exit").style.display = "block";

    // SHOW DIALOGUE
    if (id === "lightsOutCanvas") {
        showDialogue("You open the door to find an old closet with some machine panel on a wallsafe labeled 'employees only'. INSTRUCTIONS....... click panels to switch them. Turn off all the lights.");
    }

    startPuzzleTimer();
}


function closePuzzle(id) {
    clockSound.pause();
    document.getElementById(id).style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";

    // HIDE EXIT BUTTON
    document.getElementById("puzzle-exit").style.display = "none";

    hideDialogue();  
    clearInterval(puzzleTimer);
    currentPuzzle = null;
}

document.getElementById("puzzle-exit").addEventListener("click", () => {
    if (currentPuzzle) {
        closePuzzle(currentPuzzle);
    }
});


/* MAIN GAME LOGIC */

//animation initializers
let currentFrame = 0;
let totalFrames = 4;
let srcX = 0; let srcY = 0;
let pSrcX = 0;
let eSrcX = 0;
let framesDrawn = 0;
const hallwayImage = new Image();
hallwayImage.src = "assets/hallway2n&3rd.png";

function animate( canvas, player, enemy ) {

    const context = canvas.getContext( "2d" );
    
    //Clear canvas every frame
    context.clearRect( 0, 0, canvas.width, canvas.height );
    requestAnimationFrame( function() {
        animate( canvas, player, enemy );    
    } );

    //Sprite animation
    //1.) track frame of spritesheet
    currentFrame = currentFrame % totalFrames;

    //2.) get source coordinate from spritesheet
    pSrcX = currentFrame * player.image.width/4;
    eSrcX = currentFrame * enemy.image.width/4;
    
    //.3) draw hallway background first
    context.drawImage( hallwayImage, 0, 0, hallwayImage.width, hallwayImage.height );

    //4.) draw only the section of the spritesheet that is the current frame for player and enemy
    context.drawImage( player.image, pSrcX, srcY, player.image.width/4, player.image.height/4,
                        player.x-20, player.y-70, player.image.width/4, player.image.height/4  );

    context.drawImage( enemy.image, eSrcX, srcY, enemy.image.width/4, enemy.image.height/4, 
                        enemy.x-20, enemy.y, enemy.image.width/4, enemy.image.height/4 );
    framesDrawn++;
    if( framesDrawn >= 20 ) {
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
    const newSprite = new Image();
    newSprite.src = "assets/ghost-1-attacking.png";
    const walkSprite = new Image();
    walkSprite.src = "assets/player-walking.png";
    
    
    
    const elevatorSound = new Audio("assets/elevator.mp3");
    const doorSound = new Audio("assets/door.mp3");

    

    footstepSound = new Audio("assets/footsteps.mp3");
    footstepSound.loop = true;

    let player = new Player( 900, 400, 50, 50, playerSpriteSheet  );
    let door = new Player( 900, 150, 150, 75, "brown" );
    let enemyplayer = new Player ( 0, 300, 60, 50, enemySpriteSheet );

    let grid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0]
    ];

    //drawEntity(player, gameCanvas);
    //drawEntity(door, gameCanvas);

    //2.) Make sure to update the player on the gamestate first
    animate( gameCanvas, player, enemyplayer );

    
    //3.) Initialize lights out grid before canvas needs opened
    lightsOutDraw(grid);
    lightsOutClick(grid, lightsCanvas);


    setTimeout(() => {
                enemyplayer.image = newSprite;

                setInterval( chaseEntity, 200, enemyplayer, player, gameCanvas );
            }, 120000 );
    
    

    //4.) Check for player input
    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") {
            player.image = walkSprite;
            moveEntity(player, gameCanvas, -1, 5);
            if( player.x <= 0 ) {
                player.x = 0;
            }
            footstepSound.play();
        }
        if (event.key === "ArrowRight") {
            player.image = walkSprite;
            moveEntity(player, gameCanvas, 1, 5);
            if( player.x >= gameCanvas.width - player.width) {
                player.x = gameCanvas.width - player.width;
            }
            footstepSound.play();
        }

        // SPACE = interact
        if (event.key === " ") {
            //If the player is at the closet door
            if (player.x > door.x - 100 && player.x < door.x + door.width + 30) {
                openPuzzle("lightsOutCanvas");
                doorSound.play();
                clockSound.play();
                setTimeout(() => {
                    clockSound.pause();
                }, 60000 );
            }
            //If the player is at the elevator doors
            if ( (player.x > 50 && player.x < 300) && keyCard == 1) {
                elevatorSound.play();
                setTimeout(() => {
                    elevatorSound.pause();
                }, 10000 );
                music.pause();
                showDialogue( "The keycard activates, allowing you out of this nightmare." );

            }

        }
    });
    document.addEventListener("keyup", function(event) {
        if( event.key === "ArrowLeft" || event.key === "ArrowRight" ) {
            player.image = playerSpriteSheet;
            footstepSound.pause();
        }
    });

    document.querySelectorAll(".close-puzzle").forEach(btn => {
        btn.addEventListener("click", () => closePuzzle("lightsOutCanvas"));
    });
}


/*  UNIVERSAL DIALOGUE BOX */
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
        //1.) Initialize variables
        
        const startButton = document.getElementById("start-btn");
        const startScreen = document.querySelector(".start-screen");
        const wrapper = document.getElementById("wrapper");
        const gameCanvas = document.getElementById("gameCanvas");

        //2.) Check when start button is pressed
        startButton.addEventListener("click", () => {
            startScreen.classList.add("fade-out");
            music.play();

            //3.) Wait for animation to play for game to start
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



