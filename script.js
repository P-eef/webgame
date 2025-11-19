class player {
	constructor( x, y, height, width, color ) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.color = color;
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


//main
function main() {
	const mainCanvas = document.getElementById( "gameCanvas" );
	//const mainContext = mainCanvas.getContext( "2d");

	const lightsOutCanvas = document.getElementById( "lightsOutCanvas" );
	lightsOutCanvas.style.display = "none";


	
	let player1 = new player( 75, 500, 50, 50, "red"  );
	let door = new player( 700, 350, 150, 75, "brown" );

	drawEntity( player1, mainCanvas );
	drawEntity( door, mainCanvas );

	document.addEventListener( 'keydown', function( event ) {
		if (event.key == " " ) {
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
