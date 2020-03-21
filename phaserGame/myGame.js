var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);

var player, otherPlayer;
var score = 0;
var gameOver = false
var scoreText
var enemyArray;
var shipX, shipY
var cursors
shipX = shipY = 250
movespeed = 200

function preload (){
    this.load.image('sky', 'assets/background.png');
    this.load.image('ship', 'assets/ships/SF01.png');
    this.load.image('enemy', 'assets/enemy.jpg');
    this.load.image('rock', "assets/Asteroids/Mega/asteroidR4.png")
}

function create (){
    this.add.image(400, 300, 'sky');
    this.input.setDefaultCursor('url(assets/ships/SF01.cur), pointer');

    player = this.add.sprite(shipX, shipY, 'ship');
    player.setDisplaySize(40, 40);
    player.setSize(40, 40);

    scoreText = this.add.text(10, 10, 'init', { font: '48px Arial', fill: '#000000' });

    enemyArray = [];

    for (i = 0; i < 1; i ++){
        enemyArray.push(new Enemy(this))
    }

    cursors = this.input.keyboard.addKeys(
        {up:Phaser.Input.Keyboard.KeyCodes.W,
        down:Phaser.Input.Keyboard.KeyCodes.S,
        left:Phaser.Input.Keyboard.KeyCodes.A,
        right:Phaser.Input.Keyboard.KeyCodes.D});
}

function update(time, delta){
    if (!gameOver){
        let secondsDelta = delta/1000
        score += 1
        scoreText.setText("Score: " + score)

        if ((score / 100) > enemyArray.length && enemyArray.length < 15){
            enemyArray.push(new Enemy(this))
        }

        handleInput(secondsDelta)
        updateEnemies(secondsDelta)
    }
    else{
        let highestScore = localStorage.getItem("highestScore")
        let gameOverText
        if (highestScore != null){
            if (highestScore > score){
                gameOverText = `GAME OVER\n Your Score: ${score}\n Your Highest Score: ${highestScore}`
            }
            else{
                gameOverText = `GAME OVER\n Your Score: ${score}\n Your Highest Score: ${score}`
                localStorage.setItem("highestScore", score)
            }
        }
        if (highestScore == null){
            gameOverText = `GAME OVER\n Your Score: ${score}\n Your Highest Score: ${score}`
            localStorage.setItem("highestScore", score)
        }
        let gameOverPopup = this.add.text(200, 300, gameOverText, { fontSize: '32px', fill: '#fff', align:'center'});
        gameOverPopup.setDepth(1);
    }
}

function updateEnemies(delta){
    for(i = 0; i < enemyArray.length; i ++){
        enemyArray[i].move(delta)
        if (checkOverlap(enemyArray[i].sprite, player)){
            this.gameOver = true
        }
    }
}

function handleInput(delta){
    if (cursors.up.isDown && player.y > 0){
        player.y -= movespeed * delta
    }
    if (cursors.down.isDown && player.y < config.height){
        player.y += movespeed * delta
    }
    if (cursors.left.isDown && player.x > 0){
        player.x -= movespeed * delta
    }
    if (cursors.right.isDown && player.x < config.width){
        player.x += movespeed * delta
    }
}

function checkOverlap(spriteA, spriteB){
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)
}

class Enemy{
    constructor(phaser){
        this.sprite = phaser.add.sprite(-100, -100, 'rock');
        this.sprite.setSize(50, 50);
        this.sprite.setDisplaySize(50, 50);
        this.giveRandomSpawnLocation()
        this.yMoveSpeed = Math.random() * 100 + 100;
        this.sineModifier = Math.random() * 500
        this.sineValue = 0
        this.sineValueIncrement = Math.random() * .2
    }

    move(delta){
        if (this.sprite.y > 625){
            this.giveRandomSpawnLocation()
        }
        this.sprite.y += this.yMoveSpeed * delta

        this.sprite.x += (Math.sin(this.sineValue) * this.sineModifier) * delta
        this.sineValue += this.sineValueIncrement
    }

    giveRandomSpawnLocation(){
        this.sprite.x = (Math.random() * 800);
        this.sprite.y = (Math.random() * - 300);
    }
}