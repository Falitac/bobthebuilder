// @author Konrad Filek
// I do not own

// Event listeners

window.addEventListener('keyup', event => {
	Key.onKeyup(event);
}, false);

window.addEventListener('keydown', event => {
	Key.onKeydown(event);
}, false);

window.addEventListener('mousemove', event => {
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
}, false);

window.addEventListener('mousedown', event => {
	Mouse.clicked = true;
}, false);

window.addEventListener('mouseup', event => {
	Mouse.clicked = false;
}, false);

// Utility classes 

var Key = {
	_pressed: {},

	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},

	onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	},

	onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	},
	code: {
		backspace:	8,
		tab:	9,
		enter:	13,
		shift:	16,
		ctrl:	17,
		alt:	18,
		pause_break:	19,
		capslock:	20,
		escape:	27,
		pageup:	33,
		space:	32,
		pagedown:	34,
		end:	35,
		home:	36,
		left:	37,
		up:	38,
		right:	39,
		down:	40,
		printscreen:	44,
		insert:	45,
		delete:	46,
		num0:	48,
		num1:	49,
		num2:	50,
		num3:	51,
		num4:	52,
		num5:	53,
		num6:	54,
		num7:	55,
		num8:	56,
		num9:	57,
		a:	65,
		b:	66,
		c:	67,
		d:	68,
		e:	69,
		f:	70,
		g:	71,
		h:	72,
		i:	73,
		j:	74,
		k:	75,
		l:	76,
		m:	77,
		n:	78,
		o:	79,
		p:	80,
		q:	81,
		r:	82,
		s:	83,
		t:	84,
		u:	85,
		v:	86,
		w:	87,
		x:	88,
		y:	89,
		z:	90,
		left_window_key:	91,
		right_window_key:	92,
		select_key:	93,
		numpad0:	96,
		numpad1:	97,
		numpad2:	98,
		numpad3:	99,
		numpad4:	100,
		numpad5:	101,
		numpad6:	102,
		numpad7:	103,
		numpad8:	104,
		numpad9:	105,
		multiply:	106,
		add:	107,
		subtract:	109,
		decimal_point:	110,
		divide:	111,
		f1:	112,
		f2:	113,
		f3:	114,
		f4:	115,
		f5:	116,
		f6:	117,
		f7:	118,
		f8:	119,
		f9:	120,
		f10:	121,
		f11:	122,
		f12:	123,
		numlock:	144,
		scrolllock:	145,
		mycomp:	182,
		mycalc:	183,
		semicolon:	186,
		equal:	187,
		comma:	188,
		dash:	189,
		period:	190,
		forward_slash:	191,
		open_bracket:	219,
		backslash:	220,
		close_braket:	221,
		single_quote:	222
	}

};

var Mouse = {
	x: 0,
	y: 0,
	clicked: false
}

class Clock {
	constructor() {
		this.startTime = 0.0;
		this.reset();
	}

	reset() {
		this.startTime = Date.now();
	}

	getElapsedTime() {
		return (Date.now() - this.startTime) / 1000;
	}
}

let canvasElement = null;
let globalContext = null;
let canvasClearColor = '#000';
let frameTime = 0.01;
let displayedFrameTime = frameTime;
let lastFrameTime = 0.0;
let frameUpdateClock = new Clock();

let board = null;
let boardSize = 7;
let tileSize = 40;
let boardPos = {
	x: 0,
	y: 0
};

let images = {
	tile: new Image(),
	bob: new Image(),
	dizzy: new Image()
}

images.tile.src = 'resources/tile.jpg';
images.dizzy.src = 'resources/betoniarka.png';
images.bob.src = 'resources/bob.png';

let bobPos = {
	x: getRandInt(0, boardSize - 1),
	y: getRandInt(0, boardSize - 1)
}

let bobVelocities = [
{
	x: 1,
	y: 0
},
{
	x: 0,
	y: -1
},
{
	x: -1,
	y: 0
},
{
	x: 0,
	y: 1
}
];

let bobActualMove = 0;
let bobClock = new Clock();
let bobMoving = false;
let bobInterval = 0.25;

let aClicked = false;
let spaceClicked = false;

function init() {
	canvasElement = document.querySelector('#canvas');
	globalContext = canvasElement.getContext('2d');
	resizeCanvas();

	tileSize = Math.floor(canvas.height / boardSize);

	board = [...Array(boardSize)].map(element => [...Array(boardSize)].fill(0));
	boardPos = {
		x: Math.floor(canvas.width / 2 - tileSize * boardSize / 2),
		y: 0
	};

	/*while(!images.bob.complete && !images.tile.complete && !images.bob.complete) {
		console.log("images are not ready yet");
	}*/


	frameUpdateClock.reset();
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function clearCanvas() {
	globalContext.fillStyle = canvasClearColor;
	globalContext.fillRect(0, 0, canvas.width, canvas.height);
}

function displayFrameTime() {
	globalContext.font = '30px Arial';
	globalContext.fillStyle = '#fff';
	globalContext.fillText(`Frame time: ${roundToNPlace(frameTime, 2)}` , 50, 50);
}

function roundToNPlace(number, place) {
	let placeFactor = Math.pow(10, place);
	return Math.round((number + Number.EPSILON) * placeFactor) / placeFactor;
}

function getRandInt(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

function getCoord(p, start) {
	return start + p * tileSize;
}

function getReverseCoord(p, start) {
	return Math.floor((p - start) / tileSize);
}

function coordWithinBoard(x, y) {
	return 0 <= x && x < boardSize && 0 <= y && y < boardSize;
}

function resetBoard() {
	board = [...Array(boardSize)].map(element => [...Array(boardSize)].fill(0));
	bobPos.x = Math.floor(boardSize / 2);
	bobPos.y = Math.floor(boardSize / 2);
	bobMoving = false;
	bobActualMove = 0;
}

function displayTiles() {
	for(let y = 0; y < boardSize; y++) {
		for(let x = 0; x < boardSize; x++) {
			let destX = getCoord(x, boardPos.x);
			let destY = getCoord(y, boardPos.y);
			globalContext.drawImage(images.tile, destX, destY, tileSize, tileSize);
		}
	}
}

function displayObstacles(xCoord, yCoord) {
	for(let y = 0; y < boardSize; y++) {
		for(let x = 0; x < boardSize; x++) {
			if(board[y][x] === 1) {
				let destX = getCoord(x, boardPos.x) + getRandInt(-1, 1);
				let destY = getCoord(y, boardPos.y) + getRandInt(-2, 2);
				globalContext.drawImage(images.dizzy, destX, destY, tileSize, tileSize);
			}
		}
	}
}

function displayBob(xCoord, yCoord) {
	globalContext.drawImage(
		images.bob,
		getCoord(bobPos.x, boardPos.x),
		getCoord(bobPos.y, boardPos.y),
		tileSize,
		tileSize
	);

	if(coordWithinBoard(xCoord, yCoord)) {
		globalContext.strokeRect(
			getCoord(xCoord, boardPos.x),
			getCoord(yCoord, boardPos.y),
			tileSize,
			tileSize
		);
	}
}

function displayInfo() {
	let fontSize = 24;
	let interLine = 7;
	let horizontalGap = fontSize + interLine;
	let bobText = '[Spacja] - Papiez w ';
	
	globalContext.font = `${fontSize}px Rubik`;

	if(bobMoving) {
		globalContext.fillStyle = 'green';
		bobText += 'ruchu';
	} else {
		globalContext.fillStyle = 'orange';
		bobText += 'spoczynku';
	}

	globalContext.fillText(bobText, 20, 50 + horizontalGap * 0);
	
	globalContext.fillStyle = 'orange';
	let adviseText = [
		'[A] - ustaw przeszkodę',
		'[S] - ustaw Boba',
		'[R] - reset planszy'
	];
	for(let i = 0; i < adviseText.length; i++) {
		globalContext.fillText(adviseText[i], 20, 50 + horizontalGap * (i + 1));
	}
}

function display(xCoord, yCoord) {
	displayTiles();
	displayObstacles(xCoord, yCoord);
	displayBob(xCoord, yCoord);
	displayInfo();
}

function logic(xCoord, yCoord) {
	// set obstacles
	if(Key.isDown(Key.code.a) || Mouse.clicked) {
		/*if(!aClicked)*/ {
			if(coordWithinBoard(xCoord, yCoord)) {
				if(board[yCoord][xCoord] !== undefined) {
					if(!(xCoord == bobPos.x && yCoord == bobPos.y)) {
						board[yCoord][xCoord] = 1;
					}
				}
			}
		}
		aClicked = true;
	} else {
		aClicked = false;
	}

	// set Bob
	if(Key.isDown(Key.code.s)) { 
		if(coordWithinBoard(xCoord, yCoord)) {
			if(board[yCoord][xCoord] === 0) {
				bobPos.x = xCoord;
				bobPos.y = yCoord;
			}
		}
	}

	// set Bob movement
	if(Key.isDown(Key.code.space)) {
		if(!spaceClicked) {
			bobMoving = !bobMoving;
			bobClock.reset();
		}
		spaceClicked = true;
	} else {
		spaceClicked = false;
	}

	// board reset
	if(Key.isDown(Key.code.r)) {
		resetBoard();
	}

	// kinda messy boilerplate
	if(Key.isDown(Key.code.n)) {
		let size = 4;
		let drawingFormula = (x, y) => {
			return x === xCoord || x === yCoord;
		};


		for(let x = -size; x <= size; x++) {
			for(let y = - size; y <= size; y++) {
				let xDrawing = x + xCoord;
				let yDrawing = y + yCoord;
				if(coordWithinBoard(xDrawing, yDrawing)) {
					if(board[yDrawing][xDrawing] !== undefined) {
						if(!(xDrawing === bobPos.x && yDrawing === bobPos.y)) {
							if(drawingFormula) {
								board[yDrawing][xDrawing] = 1;
							}
						}
					}
				}
			}
		}
	}

	// bob movement
	if(bobMoving) {
		if(bobClock.getElapsedTime() > bobInterval) {
			let newPos = {
				x: bobPos.x,
				y: bobPos.y
			};
			let tries = 4;
			newPos.x += bobVelocities[bobActualMove].x;
			newPos.y += bobVelocities[bobActualMove].y;
			if(coordWithinBoard(newPos.x, newPos.y) && board[newPos.y][newPos.x] === 0) {
				board[bobPos.y][bobPos.x] = 1;
				bobPos.x = newPos.x;
				bobPos.y = newPos.y;
				bobClock.reset();
			} else {
				bobActualMove += 1
				if(bobActualMove === bobVelocities.length) {
					bobActualMove = 0;
					bobMoving = false;
				}
			}
		}
	}
}

function mainLoop(time) {
	// Frame timing
	frameTime = time - lastFrameTime;
	lastFrameTime = time;

	// Debug draw stuff
	clearCanvas();
	if(frameUpdateClock.getElapsedTime() > 1.0) {
		displayedFrameTime = frameTime;
		frameUpdateClock.reset();
	}

	// set coords
	let xCoord = getReverseCoord(Mouse.x, boardPos.x);
	let yCoord = getReverseCoord(Mouse.y, boardPos.y);

	logic(xCoord, yCoord);

	display(xCoord, yCoord);

	requestAnimationFrame(mainLoop);
}

init();
mainLoop();

