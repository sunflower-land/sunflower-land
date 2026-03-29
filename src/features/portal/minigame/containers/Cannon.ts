import { BumpkinContainer } from "../Core/BumpkinContainer";
import { EventBus } from "../lib/EventBus";
import { Scene } from "../Scene";
import { Enemy, Side } from "../Types";
import { Orange } from "./Orange";
import { TimerBar } from "./TimerBar";
import { CANNON_COOLDOWN } from "../Constants";
import { createAnimation, onAnimationComplete } from "../lib/Utils";

interface Props {
  x: number;
  y: number;
  scene: Scene;
  side: Side;
  player?: BumpkinContainer;
  allEnemies: Enemy[];
}

// Radius from cannon center to where the player stands while using it
const PLAYER_ORBIT_RADIUS = 20;

// How many dashes to draw in the aim line
const DASH_COUNT = 17;
const DASH_LENGTH = 6;
const DASH_GAP = 4;

/**
 * Cannon game object. Sits at a fixed position on the map.
 *
 * When the player stands within range and presses E, the cannon enters
 * aiming mode: the sprite rotates based on keyboard inputs, a dashed
 * trajectory line is drawn, and the player is repositioned at the base.
 *
 * @fires   EventBus#activate-cannon-button — every frame while active, with { isActivated, side, position }.
 * @fires   EventBus#cannon-dismount — emitted when the cannon fires.
 * @listens EventBus#cannon-aim-start — triggers startAiming().
 * @listens EventBus#cannon-aim-stop  — triggers stopAiming().
 */
export class Cannon extends Phaser.GameObjects.Container {
  scene: Scene;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;
  private spriteName: string = "";
  private side: Side;
  private allEnemies: Enemy[];
  private aimGraphics: Phaser.GameObjects.Graphics;
  private aimAngle: number = Math.PI / 2;
  private readonly AIM_SPEED: number = 0.025;
  private isActive: boolean = false;
  private isHighlighted: boolean = false;
  private spawn: Phaser.GameObjects.Sprite;
  private textLoading: Phaser.GameObjects.Text;

  // Cooldown variables
  private onCooldown: boolean = false;
  private cooldownTimerBar!: TimerBar;
  private remainingCooldown: number = 0;

  /**
   * Creates a new Cannon instance.
   *
   * @param x          {number}            X position in the world.
   * @param y          {number}            Y position in the world.
   * @param scene      {Scene}             The main Scene.
   * @param side       {Side}              Which side this cannon belongs to.
   * @param player     {BumpkinContainer}  Reference to the player container (optional).
   * @param allEnemies {Enemy[]}           Array of all enemies in the scene.
   */
  constructor({ x, y, scene, side, player, allEnemies }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.side = side;
    this.player = player;
    this.allEnemies = allEnemies;

    // Sprite — initial random pick
    this.sprite = this.scene.add.sprite(0, 0, "tree"); // placeholder, overwritten below
    this.spawn = this.scene.add
      .sprite(0, 0, "spawn")
      .setDepth(10)
      .setVisible(false);
    this.pickRandomSprite();
    this.textLoading = this.scene.add
      .text(0, 0, "Loading...", {
        fontSize: "12px",
        fontFamily: "Basic",
        color: "#FFFFFF",
        resolution: 10,
        shadow: {
          offsetX: 5,
          offsetY: 5,
          color: "#000000",
          blur: 0,
          fill: true,
        },
      })
      .setAlpha(0)
      .setOrigin(0.5);

    // Aim graphics (world-space, not inside the container)
    this.aimGraphics = this.scene.add.graphics();
    this.aimGraphics.setDepth(500);
    this.aimGraphics.setVisible(false);

    // Cooldown timer bar
    this.createTimerBar();

    // Physics on the container body
    scene.physics.add.existing(this);
    const physicsBody = this.body as Phaser.Physics.Arcade.Body;
    if (physicsBody) {
      physicsBody
        .setSize(this.sprite.width, this.sprite.height)
        .setImmovable(true)
        .setCollideWorldBounds(true);
    }

    this.setSize(this.sprite.width, this.sprite.height);

    // Register proximity check + aim update
    this.updates();

    // Listen for aim-mode toggle from Scene
    EventBus.on("cannon-aim-start", (data: { side: Side }) => {
      if (data.side === this.side) this.startAiming();
    });

    EventBus.on("cannon-aim-stop", (data: { side: Side }) => {
      if (data.side === this.side) this.stopAiming();
    });

    this.add([this.sprite, this.textLoading, this.spawn]);
    this.setDepth(10);
    scene.add.existing(this);
  }

  /**
   * Creates the timer bar graphic to display the cooldown visually.
   */
  private createTimerBar() {
    this.cooldownTimerBar = new TimerBar({
      x: 0,
      y: 15,
      scene: this.scene,
      width: 16.5,
      maxTime: CANNON_COOLDOWN,
    });
    this.add(this.cooldownTimerBar);
  }

  /**
   * Returns the current aim angle in radians.
   * 0 = right, PI/2 = down, PI = left, -PI/2 = up.
   *
   * @returns {number} Aim angle in radians.
   */
  public get currentAngle(): number {
    return this.aimAngle;
  }

  /**
   * Activates keyboard-aim mode for this cannon.
   * Should be called only when the player is within proximity range
   * and has pressed the interaction key.
   */
  public startAiming(): void {
    this.isActive = true;
    this.aimAngle = -Math.PI / 2;
    this.aimGraphics.setVisible(true);
  }

  /**
   * Deactivates keyboard-aim mode for this cannon.
   * Hides aim graphics and resets cannon rotation.
   */
  public stopAiming(): void {
    this.isActive = false;
    this.aimGraphics.setVisible(false);
    this.sprite.setAngle(0);
  }

  /**
   * Registers a per-frame update loop for this cannon using scene.addToUpdate.
   *
   * Evaluates proximity to the player, handles active aiming,
   * and updates the cooldown timer if necessary.
   *
   * @fires EventBus#activate-cannon-button — emitted with activation state.
   */
  private updates(): void {
    this.scene.addToUpdate("cannon-" + this.side, () => {
      if (this.onCooldown) {
        this.remainingCooldown -= this.scene.game.loop.delta;

        if (this.remainingCooldown <= 0) {
          this.onCooldown = false;
          this.cooldownTimerBar.setVisible(false);
          this.textLoading.setAlpha(0);
          this.spawnAnimation();
        } else {
          this.cooldownTimerBar.setTime(this.remainingCooldown);
        }
      }

      const distance = Phaser.Math.Distance.BetweenPoints(
        this.player as BumpkinContainer,
        this,
      );
      const limit = 40;

      const inRange = distance <= limit && !this.onCooldown;
      const shouldHighlight = inRange && !this.isActive;

      if (shouldHighlight && !this.isHighlighted) {
        this.isHighlighted = true;
        this.sprite.preFX?.addGlow(0xffffff, 2, 0, false, 0.1, 10);
      } else if (!shouldHighlight && this.isHighlighted) {
        this.isHighlighted = false;
        this.sprite.preFX?.clear();
      }

      if (distance > limit || this.onCooldown) {
        EventBus.emit("activate-cannon-button", {
          isActivated: false,
          side: this.side,
        });
      } else {
        EventBus.emit("activate-cannon-button", {
          isActivated: true,
          side: this.side,
          position: { x: this.x, y: this.y },
        });
      }

      if (!this.isActive) return;

      this.updateAim();
    });
  }

  /**
   * Rotates the cannon sprite and repositions the player based on
   * keyboard inputs (A/D or Left/Right arrows). Evaluates firing
   * via the spacebar.
   *
   * Called every frame while isActive is true.
   *
   * @fires EventBus#cannon-dismount — emitted when the cannon is successfully fired.
   */
  private updateAim(): void {
    const keys = this.scene.cursorKeys;
    if (!keys) return;

    const leftDown = keys.left.isDown || keys.a?.isDown;
    const rightDown = keys.right.isDown || keys.d?.isDown;

    if (leftDown) {
      this.aimAngle -= this.AIM_SPEED;
    } else if (rightDown) {
      this.aimAngle += this.AIM_SPEED;
    }

    if (Phaser.Input.Keyboard.JustDown(this.scene.cursorKeys!.space)) {
      if (this.onCooldown) return;

      this.scene.sound.add("cannon", { volume: 0.3 }).play();

      const chance = Math.random();
      if (chance < 0.5) {
        new Orange({
          x: this.x + Math.cos(this.aimAngle) * (this.sprite.height / 2),
          y: this.y + Math.sin(this.aimAngle) * (this.sprite.height / 2),
          scene: this.scene,
          angle: this.aimAngle,
          enemies: this.allEnemies,
        });
      }

      this.spawnAnimation(false);

      this.aimAngle = -Math.PI / 2;
      this.onCooldown = true;
      this.remainingCooldown = CANNON_COOLDOWN;
      this.cooldownTimerBar.setTime(this.remainingCooldown);
      this.textLoading.setAlpha(1);

      EventBus.emit("cannon-dismount", { side: this.side });
    }

    const spriteDegrees = Phaser.Math.RadToDeg(this.aimAngle) + 90;
    this.sprite.setAngle(spriteDegrees);
    this.repositionPlayer();
    this.drawAimLine();
  }

  private spawnAnimation(showSprite = true): void {
    this.pickRandomSprite();
    this.sprite.setVisible(showSprite);
    this.spawn.setVisible(true);
    createAnimation(this.scene, this.spawn, "spawn", "action", 0, 5, 10, 0);
    onAnimationComplete(this.spawn, "spawn_action_anim", () => {
      this.spawn.setVisible(false);
    });
  }

  /**
   * Picks a random sprite texture from the available list,
   * applies it to this.sprite, and adjusts this.spawn scale to match.
   * If the chosen sprite is "jester" (a spritesheet), its looping animation
   * is created and played. All other sprites are static images.
   */
  private pickRandomSprite(): void {
    const sprites = ["tree", "rock_1", "rock_2", "flower", "bush", "empty", "bounty", "plant", "jester"];
    this.spriteName = sprites[Math.floor(Math.random() * sprites.length)];
    this.sprite.setTexture(this.spriteName);

    if (this.spriteName === "jester") {
      createAnimation(this.scene, this.sprite, this.spriteName, "idle", 0, 11, 10, -1);
    } else {
      this.sprite.anims.stop();
    }

    const spawnScale = Math.max(this.sprite.width, this.sprite.height) / 24;
    this.spawn.setScale(spawnScale);
  }

  /**
   * Repositions the player sprite at the base of the cannon,
   * opposite to the current aim direction, and flips the player
   * sprite to face inward.
   */
  private repositionPlayer(): void {
    if (!this.player) return;

    const baseAngle = this.aimAngle + Math.PI;
    const offsetX = Math.cos(baseAngle) * PLAYER_ORBIT_RADIUS;
    const offsetY = Math.sin(baseAngle) * PLAYER_ORBIT_RADIUS;

    this.player.setPosition(this.x + offsetX, this.y + offsetY);

    if (Math.cos(this.aimAngle) >= 0) {
      this.player.faceRight();
    } else {
      this.player.faceLeft();
    }
  }

  /**
   * Draws a dashed trajectory line from the barrel tip in the aim direction.
   * Automatically handles fading out longer dashes.
   */
  private drawAimLine(): void {
    this.aimGraphics.clear();

    const barrelTipX =
      this.x + Math.cos(this.aimAngle) * (this.sprite.height / 2 + 4);
    const barrelTipY =
      this.y + Math.sin(this.aimAngle) * (this.sprite.height / 2 + 4);

    const step = DASH_LENGTH + DASH_GAP;

    this.aimGraphics.lineStyle(1.5, 0xffffff, 0.85);

    for (let i = 0; i < DASH_COUNT; i++) {
      const startDist = i * step;
      const endDist = startDist + DASH_LENGTH;

      const alpha = 1 - (i / DASH_COUNT) * 0.7;
      this.aimGraphics.lineStyle(1.5, 0xffffff, alpha);

      const x1 = barrelTipX + Math.cos(this.aimAngle) * startDist;
      const y1 = barrelTipY + Math.sin(this.aimAngle) * startDist;
      const x2 = barrelTipX + Math.cos(this.aimAngle) * endDist;
      const y2 = barrelTipY + Math.sin(this.aimAngle) * endDist;

      this.aimGraphics.beginPath();
      this.aimGraphics.moveTo(x1, y1);
      this.aimGraphics.lineTo(x2, y2);
      this.aimGraphics.strokePath();
    }

    this.aimGraphics.fillStyle(0xffffff, 0.9);
    this.aimGraphics.fillCircle(barrelTipX, barrelTipY, 1.5);
  }
}
