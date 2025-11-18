function lightsOutDraw( lightsOutGrid ) {
	const canvas = document.getElementById( "lightsOutCanvas" );
	const context = canvas.getContext( "2d" );

	const boxLen = ( canvas.height / 5 ) - 10;
	const gridSize = canvas.height / 5;

	
	for (let i = 0; i < 5; i++ ) {
		for (let j = 0; j < 5; j++ ) {
			if ( lightsOutGrid[i][j] == 0 ) {
				context.fillStyle = "blue";
			}
			else if ( lightsOutGrid[i][j] == 1 ) {
				context.fillStyle = "yellow";
			}
			context.fillRect( i * gridSize + 5, j * gridSize + 5, boxLen, boxLen );
		}
	}
}
function lightsOutCheckWin( lightsOutGrid ) {
	let offCount = 0;
	

	for (let i = 0; i < 5; i++ ) {
		for(let j = 0; j < 5; j++ ) {
			if ( lightsOutGrid[i][j] == 0 ) {
				offCount++;
			}
		}
	}

	if ( offcount == 25 ) {
		return true;
	}
	else { return false; }

	

}
function lightsOutSwitch( lightsOutGrid, x, y ) {
	for (let i = -1; i < 2; i++ ) {
		for(let j = -1; j < 2; j++ ) {
			if ( (i == -1 && j == -1) || (i == 1 && j == 1) || (i == -1 && j == 1) || (i == 1 && j == -1 ) ){
				continue;
			}
			if ( x + i == -1 || x + i == 5 ) {
				continue;
			}
			if ( lightsOutGrid[x + i][y + j] == 0 ) {
				lightsOutGrid[x + i][y + j] = 1;
			}
			else if ( lightsOutGrid[x + i][y + j] == 1 ) {
				lightsOutGrid[x + i][y + j] = 0;
			}
		}
	}
}
//function gathered from geeksforgeeks: 
//	https://www.geeksforgeeks.org/javascript/how-to-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function lightsOutCoord( canvas, event, lightsOutGrid ) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	let i = -1;
	let j = -1;

	if ( x < 160 ) { i = 0; }
	else if ( 160 < x && x < 320 ) { i = 1;  }
	else if ( 320 < x && x < 480 ) { i = 2; }
	else if ( 480 < x && x < 640 ) { i = 3; }
	else if ( 640 < x && x < 800 ) { i = 4; }

	if ( y < 160 ) { j = 0; }
	else if ( 160 < y && y < 320 ) { j = 1; }
	else if ( 320 < y && y < 480 ) { j = 2; }
	else if ( 480 < y && y < 640 ) { j = 3; }
	else if ( 640 < y && y < 800 ) { j = 4; }

	
	let array = [ i, j ];
	console.log( "lightsOutCoord " + array );

	lightsOutSwitch( lightsOutGrid, i, j );
	lightsOutDraw( lightsOutGrid );
}

function lightsOutClick( lightsOutGrid, canvas ) {
	let canvasElem = document.getElementById( "lightsOutCanvas" );
	let returnArray = [ -1, -1 ];
	canvasElem.addEventListener("mousedown", function (e) {
            lightsOutCoord(canvasElem, e, lightsOutGrid );
    	});
}

function main() {
	
	const canvas = document.getElementById( "lightsOutCanvas" );
	let lightsOutGrid = [
		[ 0, 0, 0, 0, 0 ],
		[ 0, 0, 1, 0, 0 ],
		[ 0, 1, 1, 1, 0 ],
		[ 0, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0 ]
	]


	lightsOutDraw( lightsOutGrid );
	lightsOutClick( lightsOutGrid, canvas );

	if ( lightsOutCheckWin ) {
		console.log("WINNER");
		return 0;
	}

	
}
main();