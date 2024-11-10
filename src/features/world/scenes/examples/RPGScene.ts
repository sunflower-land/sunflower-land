import { NPC_WEARABLES } from "lib/npcs";
import { ANIMATION, getAnimationUrl } from "../../lib/animations";
import { getKeys } from "features/game/types/decorations";
import { BaseScene } from "../BaseScene";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "features/world/mmoMachine";

/**
 * Using this file is as easy as 1, 2, 3!
 * 1. Load SpriteSheet
 * 2. Create Animation
 * 3. Play Animation
 */
export class ExampleRPGScene extends Phaser.Scene {
  sceneId: SceneId = "examples_rpg";
  sprite: Phaser.GameObjects.Sprite | undefined;

  w: Phaser.Input.Keyboard.Key | undefined;
  a: Phaser.Input.Keyboard.Key | undefined;
  s: Phaser.Input.Keyboard.Key | undefined;
  d: Phaser.Input.Keyboard.Key | undefined;
  space: Phaser.Input.Keyboard.Key | undefined;
  shift: Phaser.Input.Keyboard.Key | undefined;
  q: Phaser.Input.Keyboard.Key | undefined;
  e: Phaser.Input.Keyboard.Key | undefined;
  r: Phaser.Input.Keyboard.Key | undefined;
  f: Phaser.Input.Keyboard.Key | undefined;
  z: Phaser.Input.Keyboard.Key | undefined;
  x: Phaser.Input.Keyboard.Key | undefined;
  c: Phaser.Input.Keyboard.Key | undefined;
  v: Phaser.Input.Keyboard.Key | undefined;
  b: Phaser.Input.Keyboard.Key | undefined;
  one: Phaser.Input.Keyboard.Key | undefined;
  two: Phaser.Input.Keyboard.Key | undefined;

  constructor() {
    super("examples_rpg");
  }

  preload() {
    const bumpkin: BumpkinParts = NPC_WEARABLES["raven"];

    /**
     * 1. Load SpriteSheets
     * Use the helper function getAnimationUrl to generate to the correct URL
     */
    getKeys(ANIMATION).forEach((animationName) => {
      const url = getAnimationUrl(bumpkin, [animationName]);
      this.load.spritesheet(animationName, url, {
        frameWidth: 96,
        frameHeight: 64,
      });
    });
  }

  create() {
    this.cameras.main.setBackgroundColor("#555555");
    this.initialiseCamera();

    this.w = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.a = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.s = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.d = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.space = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.shift = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    );
    this.q = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.e = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.r = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.f = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.z = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.x = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.c = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.v = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    this.b = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.one = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

    this.add.text(
      window.innerWidth / 2 - 50,
      window.innerHeight / 2 - 100,
      `W,A,S,D: Move\nSpace: Jump\nShift: Run\nQ: Carry\nE: Attack\nR: Roll\nF: Fish\nZ: Mine\nX: Dig\nC: Water\nV: Axe\nB: Drill\n1: Death\n2: Hurt`,
    );

    /**
     * 2. Create Animations
     * Phaser can figure out how many frames are required
     */
    getKeys(ANIMATION).forEach((animationName, i) => {
      this.anims.create({
        key: animationName,
        frames: this.anims.generateFrameNumbers(animationName),
        frameRate: 10,
      });
    });

    this.sprite = this.add.sprite(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "player",
    );
  }

  walk() {
    const player = this.sprite!;

    if (!player.anims.isPlaying || player.anims.currentAnim?.key === "idle") {
      player.play("walking", true);
    }
  }

  update(t: number, dt: number) {
    const player = this.sprite!;
    const speed = 50;
    let running = 1;

    /**
     * 3. Play Animation at X & Y
     */
    if (this.space?.isDown) {
      player.play("jump", true);
    } else if (this.shift?.isDown) {
      running = 2;
      player.play("run", true);
    } else if (this.q?.isDown) {
      player.play("carry", true);
    } else if (this.e?.isDown) {
      player.play("attack", true);
    } else if (this.r?.isDown) {
      player.play("roll", true);
    } else if (this.f?.isDown) {
      player.play("casting", true);
    } else if (this.z?.isDown) {
      player.play("mining", true);
    } else if (this.x?.isDown) {
      player.play("dig", true);
    } else if (this.c?.isDown) {
      player.play("watering", true);
    } else if (this.v?.isDown) {
      player.play("axe", true);
    } else if (this.b?.isDown) {
      player.play("drilling", true);
    } else if (this.one?.isDown) {
      player.play("death", true);
    } else if (this.two?.isDown) {
      player.play("hurt", true);
    }

    if (this.w?.isDown) {
      player.y -= speed * running * (dt / 1000);
      this.walk();
    }
    if (this.s?.isDown) {
      player.y += speed * running * (dt / 1000);
      this.walk();
    }
    if (this.a?.isDown) {
      player.flipX = true;
      player.x -= speed * running * (dt / 1000);
      this.walk();
    }
    if (this.d?.isDown) {
      player.flipX = false;
      player.x += speed * running * (dt / 1000);
      this.walk();
    }

    if (!player.anims.isPlaying) player.play("idle", true);
  }

  /**
   * Information below this line is only used for the demo. Not required to use animations :)
   */
  zoom = 3;
  map = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  initialiseCamera = BaseScene.prototype.initialiseCamera;
}
