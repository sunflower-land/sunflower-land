import { SUNNYSIDE } from "assets/sunnyside";
import { ANIMATION, getAnimationUrl } from "features/world/lib/animations";
import { NPC_WEARABLES } from "lib/npcs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

const SPACING = 1;
const NUM_GOBLINS = 12;

const GAME = {
  HEIGHT: 320,
  WIDTH: NUM_GOBLINS * (20 + SPACING),
};

const MIN_VELOCITY = 80;

export class BumpkinBreaksScene extends Phaser.Scene {
  animations = [
    ANIMATION.run,
    ANIMATION.idle,
    ANIMATION.hammering,
    ANIMATION.death,
  ];
  sprite: Phaser.GameObjects.Sprite | undefined;
  player: Phaser.GameObjects.Container | undefined;
  blocks: Phaser.GameObjects.Group | undefined;
  ball: Phaser.GameObjects.Sprite | undefined;
  scoreText: Phaser.GameObjects.Text | undefined;
  levelText: Phaser.GameObjects.Text | undefined;
  timerText: Phaser.GameObjects.Text | undefined;

  w: Phaser.Input.Keyboard.Key | undefined;
  a: Phaser.Input.Keyboard.Key | undefined;
  s: Phaser.Input.Keyboard.Key | undefined;
  d: Phaser.Input.Keyboard.Key | undefined;
  space: Phaser.Input.Keyboard.Key | undefined;

  blockOffset = 0;
  score = 0;
  level = 1;
  levelupTime = 10000;

  isDead = false;

  constructor() {
    super("bumpkin_breaks");
  }

  preload(): void {
    const bumpkin: BumpkinParts = NPC_WEARABLES["raven"];
    const hoard: BumpkinParts = {
      body: "Goblin Potion",
      hat: "Goblin Helmet",
      pants: "Angler Waders",
    };

    // Player
    this.animations.forEach((animation) => {
      const url = getAnimationUrl(bumpkin, animation);
      this.load.spritesheet(animation, url, {
        frameWidth: 96,
        frameHeight: 64,
      });
    });

    // Goblin Hoard
    this.load.spritesheet("hoard_walking", getAnimationUrl(hoard, "walking"), {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("hoard_death", getAnimationUrl(hoard, "death"), {
      frameWidth: 96,
      frameHeight: 64,
    });

    // Ball
    this.load.image("ball", "world/beach_ball.webp");

    // Cooldown
    this.load.image("cooldown", SUNNYSIDE.ui.emptyBar);
  }

  createCamera(): void {
    this.cameras.main.setBackgroundColor("#555555");
    this.cameras.main.centerOnY(GAME.HEIGHT / 2);
    this.cameras.main.centerOnX(GAME.WIDTH / 2);
  }

  createInput(): void {
    this.a = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.d = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.space = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  createAnimations(): void {
    this.animations.forEach((animation) => {
      this.anims.create({
        key: animation,
        frames: this.anims.generateFrameNumbers(animation),
        frameRate: 10,
      });
    });

    this.anims.create({
      key: "hoard_walking",
      frames: this.anims.generateFrameNames("hoard_walking"),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hoard_death",
      frames: this.anims.generateFrameNames("hoard_death"),
      frameRate: 10,
    });
  }

  createSprites(): void {
    // Background
    this.add.rectangle(
      GAME.WIDTH / 2,
      GAME.HEIGHT / 2,
      GAME.WIDTH,
      GAME.HEIGHT,
      0x550000,
    );

    this.sprite = this.add.sprite(0, 0, "player");
    this.physics.world.enable(this.sprite);
    const spriteBody = this.sprite.body as Phaser.Physics.Arcade.Body;
    spriteBody.setSize(18, 17).setOffset(39, 22).setImmovable(true);

    const cooldownbar = this.add
      .sprite(GAME.WIDTH / 2, GAME.HEIGHT, "cooldown")
      .setOrigin(0, 0);

    this.player = this.add.container(
      GAME.WIDTH / 2,
      GAME.HEIGHT - sprite.height / 2,
    );
    this.player.add(sprite);
    this.player.add(cooldownbar);

    // Ball
    this.ball = this.add.sprite(GAME.WIDTH / 2, GAME.HEIGHT / 2, "ball");
    this.physics.world.enable(this.ball);
    const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;

    ballBody
      .setImmovable(true)
      .setVelocityY(-MIN_VELOCITY * 2)
      .setVelocityX(MIN_VELOCITY * 2)
      .setMaxVelocityX(400)
      .setMaxVelocityY(400)
      .setDrag(0.7, 0.7)
      .setDamping(true)
      .setAllowDrag(false);

    // Enemies
    const initBlocks: number[][] = new Array(6).fill(
      new Array(NUM_GOBLINS).fill(null),
    );
    this.blocks = this.add.group();

    initBlocks.forEach((row, y) => {
      row.forEach((_, x) => {
        const rect = this.add.sprite(x * 21 + 10, y * 21 - 10, "hoard_walking");
        rect.play("hoard_walking");
        rect.body;
        rect.setDepth(1);

        this.physics.world.enable(rect);
        this.blocks?.add(rect);
        (rect.body as Phaser.Physics.Arcade.Body)
          .setSize(18, 17)
          .setOffset(39, 22)
          .setImmovable(true);
      });
    });
  }

  createText(): void {
    this.scoreText = this.add.text(0, 0, `Score: ${this.score}`);
    this.scoreText.setDepth(2);

    this.levelText = this.add.text(
      0,
      this.scoreText.height,
      `Level: ${this.level}`,
    );
    this.levelText.setDepth(2);

    this.timerText = this.add.text(
      0,
      this.scoreText.height + this.levelText.height,
      `Level Up in: ${Math.round(this.levelupTime / 1000)}s`,
    );
  }

  create(): void {
    this.physics.world.drawDebug = false;

    this.createCamera();
    this.createInput();
    this.createAnimations();
    this.createSprites();
    this.createText();
  }

  run() {
    if (!this.sprite) return;

    if (
      this.sprite.anims.isPlaying ||
      this.sprite.anims.currentAnim?.key === "idle"
    ) {
      this.sprite.play("run", true);
    }
  }

  updatePlayer(t: number, dt: number) {
    if (!this.sprite) return;

    const speed = 100;
    /**
     * 3. Play Animation at X & Y
     */
    if (this.space?.isDown) {
      this.sprite.play("hammering", true);
    }

    const isHammering =
      this.sprite.anims.isPlaying &&
      this.sprite.anims.currentAnim?.key === "hammering";

    // if (isHammering) return;

    if (this.a?.isDown) {
      this.sprite.flipX = true;
      if (this.sprite.x < 0) return;

      this.sprite.x -= speed * (dt / 1000);
      if (!isHammering) this.run();
    }
    if (this.d?.isDown) {
      this.sprite.flipX = false;
      if (this.sprite.x > GAME.WIDTH) return;

      this.sprite.x += speed * (dt / 1000);
      if (!isHammering) this.run();
    }

    if (!this.sprite.anims.isPlaying) this.sprite.play("idle", true);
  }

  updateEnemies(t: number, dt: number) {
    const speed = 5 * (1 + 0.5 * this.level);
    this.blocks?.incY(speed * (dt / 1000));
    this.blockOffset += speed * (dt / 1000);

    if (this.blockOffset >= 19 + SPACING) {
      new Array(NUM_GOBLINS).fill(null).forEach((_, i) => {
        const rect = this.add.sprite(i * 21 + 10, -10, "hoard_walking");
        rect.play("hoard_walking");
        rect.setDepth(1);

        this.physics.world.enable(rect);
        this.blocks?.add(rect);
        (rect.body as Phaser.Physics.Arcade.Body)
          .setSize(18, 17)
          .setOffset(39, 22)
          .setImmovable(true);

        this.blockOffset = 0;
      });
    }
  }

  updateBall(t: number, dt: number) {
    if (!this.ball) return;
    const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;

    if (this.ball.x <= 0) {
      ballBody.setVelocityX(Math.abs(ballBody.velocity.x));
    }

    if (this.ball.x >= GAME.WIDTH) {
      ballBody.setVelocityX(-Math.abs(ballBody.velocity.x));
    }

    if (this.ball.y <= 0) {
      ballBody.setVelocityY(Math.abs(ballBody.velocity.y));
    }

    if (this.ball.y >= GAME.HEIGHT) {
      ballBody.setVelocityY(-Math.abs(ballBody.velocity.y));
    }

    if (
      Math.abs(ballBody.velocity.x) <= MIN_VELOCITY ||
      Math.abs(ballBody.velocity.y) <= MIN_VELOCITY
    ) {
      ballBody.setAllowDrag(false);
    }
  }

  enemyDied(rect: Phaser.GameObjects.Sprite) {
    const rectSprite = rect as Phaser.GameObjects.Sprite;
    rectSprite.play("hoard_death");
    rectSprite.setDepth(0);
    this.blocks?.remove(rectSprite);
    // TODO is there a phaser way to do this?
    window.setTimeout(() => rect.destroy(), 5000);
  }

  playerDied() {
    this.sprite?.play("death");
  }

  checkCollision() {
    if (!this.blocks || !this.ball || !this.sprite) return;

    const ballBody = this.ball.body as Phaser.Physics.Arcade.Body;

    if (ballBody.touching.up)
      ballBody.setVelocityY(Math.abs(ballBody.velocity.y));
    if (ballBody.touching.down)
      ballBody.setVelocityY(-Math.abs(ballBody.velocity.y));
    if (ballBody.touching.left)
      ballBody.setVelocityX(Math.abs(ballBody.velocity.x));
    if (ballBody.touching.right)
      ballBody.setVelocityX(-Math.abs(ballBody.velocity.x));

    this.physics.collide(this.blocks, this.ball, (rect) => {
      this.score++;
      this.enemyDied(rect as Phaser.GameObjects.Sprite);
    });

    const isHammering =
      this.sprite.anims.isPlaying &&
      this.sprite.anims.currentAnim?.key === "hammering";

    this.physics.collide(this.sprite, this.ball, () => {
      ballBody.setAngularVelocity(
        (ballBody.angularVelocity += this.sprite?.flipX ? 90 : -90),
      );
      if (isHammering) {
        ballBody.setVelocityX(ballBody.velocity.x * 1.5);
        ballBody.setVelocityY(ballBody.velocity.y * 1.5);
        ballBody.setAllowDrag(true);
      } else {
        ballBody.setVelocityX(ballBody.velocity.x * 1.1);
        ballBody.setVelocityY(ballBody.velocity.y * 1.1);
        ballBody.setAllowDrag(true);
      }
    });

    this.physics.collide(this.blocks, this.sprite, (enemy, sprite) => {
      if (isHammering) {
        this.score++;
        this.enemyDied(enemy as Phaser.GameObjects.Sprite);
      } else {
        this.isDead = true;
        this.playerDied();
      }
    });

    this.blocks.getChildren().forEach((rect) => {
      if ((rect as Phaser.GameObjects.Sprite).y > GAME.HEIGHT) {
        this.score--;
        this.blocks?.remove(rect);
        rect.destroy();
      }
    });
  }

  updateText(t: number, dt: number) {
    this.scoreText?.setText(`Score: ${this.score}`);
    this.scoreText?.setDepth(2);

    this.levelText?.setText(`Level: ${this.level}`);
    this.levelText?.setDepth(2);

    this.timerText?.setText(
      `Level Up in: ${Math.round(this.levelupTime / 1000)}s`,
    );
    this.timerText?.setDepth(2);
  }

  update(t: number, dt: number) {
    this.cameras.main.setZoom(window.innerHeight / GAME.HEIGHT);
    this.levelupTime -= dt;

    if (this.levelupTime <= 0) {
      this.level++;
      this.levelupTime = 10000;
    }

    this.updateEnemies(t, dt);

    if (!this.isDead) {
      this.updatePlayer(t, dt);
      this.updateBall(t, dt);
      this.updateText(t, dt);
      this.checkCollision();
    }
  }
}
