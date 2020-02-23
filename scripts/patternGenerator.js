var canvasContext;
var canvasHeight;
var canvasWidth;
var framerate = 60
var trailOn = true;
var boxes = [];
var paused = false;
var canvas;

class Box
{
	constructor(x, y, width, height, color, xVelocity, yVelocity)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.xVelocity = xVelocity;
		this.yVelocity = yVelocity;
		this.isVisible = false;
	}

	draw()
	{
		if (this.isVisible == true)
		{
			canvasContext.fillStyle = this.color;
			canvasContext.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	move()
	{
		if (this.x > 468 || this.x < 0)
		{
			this.xVelocity = this.xVelocity * -1;
		}
		if (this.y > 468 || this.y < 0)
		{
			this.yVelocity = this.yVelocity * -1;
		}
		this.x += this.xVelocity;
		this.y += this.yVelocity;
	}
}

function initializeData ()
{
	canvas = document.getElementById("gameCanvas");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	canvasContext = canvas.getContext("2d");
	initializeBoxes();
	document.getElementById("Box1").checked = true;
	document.getElementById("trail").checked = true;
}

function initializeBoxes(){
	boxes = []
	boxes.push(new Box(0, 0, 32, 32, document.getElementById("box1Color").value, 2, 2));
	boxes.push(new Box(468, 468, 32, 32, document.getElementById("box2Color").value, 2, 2));
	boxes.push(new Box(468, 0, 32, 32, document.getElementById("box3Color").value, 2, 2));
	boxes.push(new Box(0, 468, 32, 32, document.getElementById("box4Color").value, 2, 2));
}

function drawBackground()
{
	canvasContext.fillStyle = document.getElementById("backgroundColor").value;
	canvasContext.fillRect(0,0,canvasHeight,canvasWidth);
}

function gameLoop()
{
	if (!paused){
		if (trailOn == false)
		{
			drawBackground();
		}
		boxes.forEach((box) => {
			box.move();
			box.draw();
		});
		checkBoxManager();
	}
}

function restart()
{
	drawBackground();
	initializeBoxes();
}

function randomPositionSpawn()
{
	drawBackground();
	boxes.forEach((box) => {
		box.x = Math.random() * 468;
		box.y = Math.random() * 468;
	});
}

function randomizeVelocity()
{
	drawBackground();
	boxes.forEach((box) => {
		box.xVelocity = Math.random() * 10;
		box.yVelocity = Math.random() * 10;
	});
}

function randomizeVelocitySynced()
{
	drawBackground();
	xVelocity = Math.random() * 10;
	yVelocity = Math.random() * 10;
	boxes.forEach((box) => {
		box.xVelocity = xVelocity;
		box.yVelocity = yVelocity;
	});
}

function checkBoxManager()
{
	trailOn = document.getElementById("trail").checked;
	boxes[0].isVisible = document.getElementById("Box1").checked;
	boxes[1].isVisible = document.getElementById("Box2").checked;
	boxes[2].isVisible = document.getElementById("Box3").checked;
	boxes[3].isVisible = document.getElementById("Box4").checked;
}

function pauseGame(){
	paused = !paused;
}

function exportCanvas(){
	let img = canvas.toDataURL("png");
	let imageWindow = window.open();
	imageWindow.document.write('<img src="'+img+'"/>');
}

window.onload = function()
{
	initializeData();
	drawBackground();
	setInterval (function () {gameLoop()}, 1000/framerate);
}