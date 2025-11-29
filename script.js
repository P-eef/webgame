class player {
	constructor( x, y, height, width, image ) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.image = image;
	}
}

function drawEntity( player, canvas ) {
	const context = canvas.getContext( "2d" );
	
	context.fillStyle = player.color;
	//context.fillRect( player.x, player.y, player.width, player.height);
	context.fillRect( player.x, player.y, player.width, player.height );
}

function moveEntity( player, canvas, dir, speed ) {
	const context = canvas.getContext( "2d" );
	context.clearRect( player.x, player.y, player.width, player.height );
	if ( dir == 1 ) {
		player.x = player.x + speed;
	}
	else if ( dir == -1) {
		player.x = player.x - speed;
	}
	drawEntity( player, canvas );
}

function chaseEntity( chaser, chasey, canvas ) {
	if ( chaser.x > chasey.x ) {
		moveEntity( chaser, canvas, -1, 5 );
	}
	else if ( chaser.x < chasey.x ) {
		moveEntity( chaser, canvas, 1, 5);
	}
	

}

let currentFrame = 0;
let totalFrames = 4;
let srcX = 0; let srcY = 0;
let pSrcX = 0;
let eSrcX = 0;
let framesDrawn = 0;
const hallwayImage = new Image();
hallwayImage.src = "assets/hallway2n&3rd.png";

function animate( canvas, image, player, enemy ) {

	const context = canvas.getContext( "2d" );

	context.clearRect( 0, 0, canvas.width, canvas.height );
	requestAnimationFrame( function() {
		animate( canvas, image, player, enemy );
	} );


	currentFrame = currentFrame % totalFrames;

	pSrcX = currentFrame * player.image.width/4;
	eSrcX = currentFrame * enemy.image.width/4;
	
	context.drawImage( hallwayImage, 0, 0, hallwayImage.width, hallwayImage.height );
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

//main
function main() {
	const mainCanvas = document.getElementById( "gameCanvas" );
	const context = mainCanvas.getContext( "2d" );
	//const mainContext = mainCanvas.getContext( "2d");

	const lightsOutCanvas = document.getElementById( "lightsOutCanvas" );
	lightsOutCanvas.style.display = "none";
	const playerSpriteSheet = new Image();
	playerSpriteSheet.src = "assets/player-walking.png";
	const enemySpriteSheet = new Image();
	enemySpriteSheet.src = "assets/ghost-1-attacking.png";
	

	

	


	
	let player1 = new player( 900, 400, 50, 50, playerSpriteSheet  );
	let door = new player( 700, 150, 150, 75, "brown" );
	let enemyplayer = new player ( 0, 300, 60, 50, enemySpriteSheet );

	animate( mainCanvas, playerSpriteSheet, player1, enemyplayer );

	drawEntity( player1, mainCanvas );
	drawEntity( door, mainCanvas );
	drawEntity( enemyplayer, mainCanvas );

	setTimeout(() => {

		setInterval( chaseEntity, 200, enemyplayer, player1, mainCanvas );
	}, 10000 );
	
	

	document.addEventListener( 'keydown', function( event ) {
		if (event.key == " " ) {
			console.log( player1.x, door.x, door.x + door.width );
			if ( player1.x > door.x - 30 && player1.x < door.x + door.width + 30 ) {
				lightsOutCanvas.style.display = "block";
			}
		}
		else if( event.key == "ArrowLeft" ) {
			moveEntity( player1, mainCanvas, -1, 15 );
		}
		else if ( event.key == "ArrowRight" ) {
			moveEntity( player1, mainCanvas,  1, 15 );
		}
	});

	
	
	//moveEntity( player1, mainCanvas, 1, 15 );
	

	//mainContext.fillStyle = "red";
	//mainContext.fillRect( position, 500, 50, 50 );
	
	
}

function startGame() {
	window.addEventListener("DOMContentLoaded", () => {
	    const startButton = document.getElementById("start-btn");
	    const startScreen = document.querySelector(".start-screen");
	    const wrapper = document.getElementById("wrapper");
	    const gameCanvas = document.getElementById("gameCanvas");
	    // START GAME LOGIC
	    startButton.addEventListener("click", () => {
	        // 1. Fade out the start screen
	        startScreen.classList.add("fade-out");
	        // 2. After fade animation, remove start screen & show game
	        setTimeout(() => {
	            startScreen.style.display = "none"; // fully hide start screen
	            wrapper.classList.add("show");      // reveal game wrapper
	            gameCanvas.classList.add("show");   // fade-in canvas
	        }, 1000); // 1 second = // CSS transition time
	    });
	});

	main();
}

startGame();
