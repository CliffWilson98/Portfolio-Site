var xVelocity = 2;
var yVelocity = 2;
var canvasContext;
var canvasHeight;
var canvasWidth;
var framerate = 60
var trailOn = true;
var players = [];
var paused = false;
var canvas;

class Player
{
		constructor(x, y, width, height, color)
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

}

function initializeData ()
{
	canvas = document.getElementById("gameCanvas");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	canvasContext = canvas.getContext("2d");
	initializePlayers();
	document.getElementById("Box1").checked = true;
	document.getElementById("trail").checked = true;
}

function initializePlayers(){
	players = []
	players.push(new Player(0, 0, 32, 32, "yellow"));
	players.push(new Player(468, 468, 32, 32, "blue"));
	players.push(new Player(468, 0, 32, 32, "red"));
	players.push(new Player(0, 468, 32, 32, "green"));
}

function drawPlayer (player)
{
	if (player.isVisible == true)
	{
		canvasContext.fillStyle = player.color;
		canvasContext.fillRect(player.x, player.y, player.width, player.height);
	}
}

function drawBackground()
{
	canvasContext.fillStyle = "#008080";
	canvasContext.fillRect(0,0,canvasHeight,canvasWidth);
}

function movePlayer(player)
{
	if (player.x > 468 || player.x < 0)
	{
		player.xVelocity = player.xVelocity * -1;
	}
	if (player.y > 468 || player.y < 0)
	{
		player.yVelocity = player.yVelocity * -1;
	}
	player.x += player.xVelocity;
	player.y += player.yVelocity;
}

function gameLoop()
{
	if (!paused){
		if (trailOn == false)
		{
			drawBackground();
		}
		players.forEach((player) => {
			movePlayer(player);
			drawPlayer(player);
		});
		checkBoxManager();
	}
}

function restart()
{
	drawBackground();
	initializePlayers();
}

function randomPositionSpawn()
{
	drawBackground();
	players.forEach((player) => {
		player.x = Math.random() * 468;
		player.y = Math.random() * 468;
	});
}

function randomizeVelocity()
{
	drawBackground();
	players.forEach((player) => {
		player.xVelocity = Math.random() * 10;
		player.yVelocity = Math.random() * 10;
	});
}

function randomizeVelocitySynced()
{
	drawBackground();
	xVelocity = Math.random() * 10;
	yVelocity = Math.random() * 10;
	players.forEach((player) => {
		player.xVelocity = xVelocity;
		player.yVelocity = yVelocity;
	});
}

function checkBoxManager()
{
	trailOn = document.getElementById("trail").checked;
	players[0].isVisible = document.getElementById("Box1").checked;
	players[1].isVisible = document.getElementById("Box2").checked;
	players[2].isVisible = document.getElementById("Box3").checked;
	players[3].isVisible = document.getElementById("Box4").checked;
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