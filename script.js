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
			if ( !((player.x < (door.x - 50)) || (player.x > (door.x + door.width + 50)) ) ) {
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

main();