var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 850,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } 
};

var game = new Phaser.Game(config);
var player;
var bullets;
var lastFired = 0;
var enemies = [];

function preload() {
  this.load.image('hero', 'pngs/hero.png');
  this.load.image('enemy', 'pngs/enemy.png');
  this.load.image('bullet', 'pngs/bullet.png');
}

function create() {
  
  class Bullet extends Phaser.GameObjects.Image {

    constructor (scene) {
      super(scene, 0, 0, 'bullet');
      this.speed = Phaser.Math.GetSpeed(600, 1);
    }
    
    fire (x, y) {
      this.setPosition(x + 32, y);
      this.setActive(true);
      this.setVisible(true);
    }
        
    update (time, delta) {

      if (this.x > 850) {
        this.setActive(false);
        this.setVisible(false);
      } else {
        this.x += this.speed * delta;
        this.angle += 15;
        // console.log(`Bullet Coords: [ ${this.x},${this.y} ]`);
      }
    }

  }

  this.socket = io();

  this.bullets = this.add.group({
      classType: Bullet,
      maxSize: 8,
      runChildUpdate: true
  });
  
  // Initialize Hero Ship
  this.ship = this.add.sprite(30,300, 'hero');
  this.cursors = this.input.keyboard.createCursorKeys();
  this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.speed = Phaser.Math.GetSpeed(300, 1);

  // Spawn the Enemies
  let spawnFlyingVee = () => {

    let setback = 25;
    let x = 850;
    let y = 300;
    let currentloop = 1;
    let maxloops = 5;

    const boss = this.add.sprite(x, y, 'enemy');
    // boss.enableBody = true;
    // boss.setSize = 16;
    // boss.checkWorldBounds = true;
    enemies.push(boss);
    
    let cachebot = this.add.sprite(x + setback, y + setback, 'enemy');
    enemies.push(cachebot);

    cachebot = this.add.sprite(x + setback, y - setback, 'enemy');
    enemies.push(cachebot);

    setback += setback;

    while (currentloop < maxloops) {
      enemies.push(this.add.sprite(x + setback, y + setback, 'enemy'));
      enemies.push(this.add.sprite(x + setback, y - setback, 'enemy'));
      let adjust = currentloop + 1;
      setback += setback/adjust;
      currentloop += 1;
    }

  }
  spawnFlyingVee();

}

function update(time, delta) {

  enemies.forEach(element => {
    element.x -= 10;
  });

  // Vertical Movement
  switch (true) {
    case this.cursors.up.isDown:                // N
        this.ship.y -= this.speed * delta;
        break;
    case this.cursors.down.isDown:              // S
        this.ship.y += this.speed * delta;
        break;
    default:
        break;
  }

  // Horizontal Movement
  switch (true) {
    case this.cursors.right.isDown:             // E
    this.ship.x += this.speed * delta;
    break;
    case this.cursors.left.isDown:              // W
      this.ship.x -= this.speed * delta;
      break;
    default:
        break;
  }

  // SPACEBAR
  if (this.spacebar.isDown) {
    const bullet = this.bullets.get();
    if (bullet) {
        bullet.fire(this.ship.x, this.ship.y);
        this.lastFired = time + 50;
    }
  }

}



