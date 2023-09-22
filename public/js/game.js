class Example extends Phaser.Scene {
  playerBullets;
  enemyBullets;
  player;
  lastFired = 0;
  gameWidth = 900;
  gameHeight = 600;
  enemies = [];
  players;

  preload() {
    this.load.image('hero', 'pngs/hero.png');
    this.load.image('enemy', 'pngs/enemy.png');
    this.load.image('bullet', 'pngs/bullet.png');
    this.load.image('background', 'pngs/background.png');
  }

  create() {

    this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.background = this.add.image(450, 300, 'background');
    
    class Bullet extends Phaser.GameObjects.Image {
  
      constructor (scene) {
        super(scene, 0, 0, 'bullet');
        this.speed = Phaser.Math.GetSpeed(200, 1);
        this.setDisplaySize(32,32);
      }
      
      fire (x, y) {
        this.setPosition(x + 32, y);
        this.setActive(true);
        this.setVisible(true);
      }
          
      update (time, delta) {
  
        if (this.x > this.gameWidth) {
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

    this.playerBullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    this.enemyBullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    });
    
    // Initialize Hero Ship
    this.player = this.physics.add.sprite(30,300, 'hero');
    this.player.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.speed = Phaser.Math.GetSpeed(600, 1);

    this.testkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.input.keyboard.on('keydown_X', event => {
      const min = -150;
      const max = 150;
      const drift = Math.floor(Math.random() * (max - min + 1)) + min;
      this.spawnFlyingVee(drift);
    });

    this.spawnFlyingVee();  
  }

  update(time, delta) {

    this.enemies.forEach(element => {
      element.x -= 10;
    });
  
    // Vertical Movement
    switch (true) {
      case this.cursors.up.isDown:                // N
          this.player.y -= this.speed * delta;
          break;
      case this.cursors.down.isDown:              // S
          this.player.y += this.speed * delta;
          break;
      default:
          break;
    }
  
    // Horizontal Movement
    switch (true) {
      case this.cursors.right.isDown:             // E
      this.player.x += this.speed * delta;
      break;
      case this.cursors.left.isDown:              // W
        this.player.x -= this.speed * delta;
        break;
      default:
          break;
    }
  
    // SPACEBAR
    if (this.spacebar.isDown) {
      const bullet = this.playerBullets.get();
      if (bullet) {
          bullet.fire(this.player.x, this.player.y);
          this.enemies.forEach(enemy => {
            this.physics.add.collider(enemy, bullet, (enemyHit, bulletHit) => this.enemyHitCallback(enemyHit, bulletHit));
          });

      }
    }
  
  }

  // Spawn the Enemies
  spawnFlyingVee (drift) {

    let setback = 25;
    let x = 905;
    let y = 300 + drift;
    let currentloop = 1;
    let maxloops = 5;

    const boss = this.physics.add.sprite(x, y, 'enemy');

    boss.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(false);
    this.enemies.push(boss);
    
    let cachebot = this.physics.add.sprite(x + setback, y + setback, 'enemy');
    cachebot.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(false);
    this.enemies.push(cachebot);

    cachebot = this.physics.add.sprite(x + setback, y - setback, 'enemy');
    cachebot.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(false);
    this.enemies.push(cachebot);

    setback += setback;

    while (currentloop < maxloops) {
      cachebot = this.physics.add.sprite(x + setback, y + setback, 'enemy');
      cachebot.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(false);
      this.enemies.push(cachebot);
      cachebot = this.physics.add.sprite(x + setback, y - setback, 'enemy');
      cachebot.setOrigin(0.5, 0.5).setDisplaySize(32,32).setCollideWorldBounds(false);
      this.enemies.push(cachebot);
      let adjust = currentloop + 1;
      setback += setback/adjust;
      currentloop += 1;
    }

  }

  enemyHitCallback (enemyHit, bulletHit) {
    if (bulletHit.active === true && enemyHit.active === true) {
      enemyHit.setActive(false).setVisible(false);
      enemyHit.destroy();
      // bulletHit.setActive(false).setVisible(false);
      // bulletHit.destroy();
      console.log('destroy');
    }
  }

}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 900,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  scene: Example
};

const game = new Phaser.Game(config);
