//TODO DO SOMETHING WITH LOCAL STORAGE
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
    player.setDisplaySize(50, 50);
    player.setSize(50, 50);

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
    let secondsDelta = delta/1000
    score += 5
    scoreText.setText("Score: " + score)

    if ((score / 100) > enemyArray.length && enemyArray.length < 30){
        enemyArray.push(new Enemy(this))
    }

    handleInput(secondsDelta)
    updateEnemies(secondsDelta)
}

function updateEnemies(delta){
    for(i = 0; i < enemyArray.length; i ++){
        enemyArray[i].move(delta)
        if (checkOverlap(enemyArray[i].sprite, player)){
            // console.log("overlap")
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
    //TODO - go to random x location when spawned and make sineModifier different for every asteroid
    //TODO make everything framerate independent
    constructor(phaser){
        this.startY = (Math.random() * - 300);
        this.startX = (Math.random() * 800);
        this.sprite = phaser.add.sprite(this.startX, this.startY, 'rock');
        this.sprite.setSize(50, 50);
        this.sprite.setDisplaySize(50, 50);
        this.yMoveSpeed = Math.random() * 100 + 100;
        this.sineModifier = 300
        // Math.random() * 250 + 100 
        this.sineValue = 0
    }

    move(delta){
        if (this.sprite.y > 625){
            this.sprite.y = this.startY
        }
        this.sprite.y += this.yMoveSpeed * delta

        this.sprite.x += (Math.sin(this.sineValue) * this.sineModifier) * delta
        this.sineValue += .01
    }

    spawn(){

    }
}