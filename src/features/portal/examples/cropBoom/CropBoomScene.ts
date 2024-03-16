import mapJson from "assets/map/crop_boom.json";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { HARVEST_PROC_ANIMATION } from "features/island/plots/lib/plant";
import { SPAWNS } from "features/world/lib/spawn";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";

export class CropBoomScene extends BaseScene {
  sceneId: SceneId = "crop_boom";

  constructor() {
    super({
      name: "crop_boom",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });

    this.load.spritesheet("crop_boom", "world/crop_boom.png", {
      frameWidth: HARVEST_PROC_ANIMATION.size,
      frameHeight: HARVEST_PROC_ANIMATION.size,
    });

    this.load.image("crop_boom_hole", "world/crop_boom_hole.png");

    this.load.image(
      "crop_boom_hole_recovery",
      "world/crop_boom_hole_recovery.png"
    );
  }

  private bombPositions: { x: number; y: number }[] = [];

  async create() {
    this.map = this.make.tilemap({
      key: "main-map",
    });

    super.create();

    // Assuming the layer name is "Boom"
    const layer = this.map.getLayer("Boom");

    if (!layer) {
      return;
    }

    // Get all tiles on the "Boom" layer
    const boomTiles = this.map.filterTiles((tile: any) => tile.layer === layer);

    // Iterate through each tile and get its coordinates
    boomTiles?.forEach((tile) => {
      if (this.map.hasTileAt(tile.x, tile.y, "Boom")) {
        this.bombPositions.push({ x: tile.x, y: tile.y });
      }
    });

    this.map.destroyLayer("Boom");

    if (this.mmoServer) {
      this.mmoServer.state.actions.onAdd(async (action) => {
        if (action.event === "kaboom") {
          this.kaboom(action.x as number, action.y as number, "otherPlayer");
        }
      });
    }
  }

  private moving = false;
  private bombed = false;

  kaboom(x: number, y: number, from: "currentPlayer" | "otherPlayer") {
    if (!this.currentPlayer) {
      return;
    }

    const boom = this.add.sprite(x, y - 4, "crop_boom");
    boom.setDepth(100000);

    const animKey = "crop_boom_anim";

    this.bombed = true;

    if (!this.anims.exists(animKey as string)) {
      this.anims.create({
        key: "crop_boom_anim",
        frames: this.anims.generateFrameNumbers("crop_boom", {
          start: 0,
          end: HARVEST_PROC_ANIMATION.steps - 1,
        }),
        repeat: 0,
        frameRate: 10,
      });
    }

    boom.play("crop_boom_anim", true);

    // Let other players know they kaboomed
    if (this.mmoServer && from === "currentPlayer") {
      this.mmoServer.send(0, {
        action: "kaboom",
        x,
        y,
      });
    }

    boom.on("animationcomplete", async () => {
      if (!this.currentPlayer) {
        return;
      }

      this.currentPlayer.x = SPAWNS().crop_boom.default.x;
      this.currentPlayer.y = SPAWNS().crop_boom.default.y;

      this.bombed = false;
      // Your code to run when the animation is complete
      boom.destroy();
      // interactableModalManager.open("kaboom");

      const boomHole = this.add.sprite(x, y + 8, "crop_boom_hole");

      await new Promise((res) => setTimeout(res, 10000));
      boomHole.destroy();

      const recoveryHole = this.add.sprite(x, y + 8, "crop_boom_hole_recovery");

      await new Promise((res) => setTimeout(res, 10000));
      recoveryHole.destroy();
    });
  }

  updatePlayerOnBoard() {
    if (this.bombed) {
      return;
    }

    if (!this.currentPlayer?.body) {
      return;
    }

    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    currentPlayerBody.setVelocity(0, 0); // Reset velocity

    const isJoystickActive = (this.joystick?.force ?? 0) > 0;

    if (isJoystickActive) {
      // Joystick movement
      const roundedAngle = Phaser.Math.Angle.WrapDegrees(
        Phaser.Math.RoundTo(this.joystick?.angle ?? 0, 90)
      );

      this.movePlayerByDirection(roundedAngle);
    } else if (this.cursorKeys) {
      // Keyboard movement
      const left = this.cursorKeys.left.isDown || this.cursorKeys.a?.isDown;
      const right = this.cursorKeys.right.isDown || this.cursorKeys.d?.isDown;
      const up = this.cursorKeys.up.isDown || this.cursorKeys.w?.isDown;
      const down = this.cursorKeys.down.isDown || this.cursorKeys.s?.isDown;

      if (left) {
        this.movePlayerByDirection(180);
        this.currentPlayer.faceLeft();
      } else if (right) {
        this.movePlayerByDirection(0);
        this.currentPlayer.faceRight();
      }

      if (up) {
        this.movePlayerByDirection(-90);
      } else if (down) {
        this.movePlayerByDirection(90);
      }
    }

    this.sendPositionToServer();
  }

  movePlayerByDirection(angle: number) {
    if (this.moving || !this.currentPlayer) {
      return;
    }

    this.moving = true;
    const gridSize = 16;

    const targetX =
      Math.round(
        (this.currentPlayer.x + 16 * Math.cos(Phaser.Math.DegToRad(angle))) /
          gridSize
      ) *
        gridSize -
      8;
    const targetY =
      Math.round(
        (this.currentPlayer.y + 16 * Math.sin(Phaser.Math.DegToRad(angle))) /
          gridSize
      ) * gridSize;

    this.currentPlayer.walk(); // Play walk animation

    this.tweens.add({
      targets: this.currentPlayer,
      x: targetX,
      y: targetY,
      duration: 500, // Adjust the duration as needed
      ease: "Linear",
      onComplete: () => {
        if (this.currentPlayer) {
          // Play idle animation when movement is complete
          this.currentPlayer.idle();
        }

        this.moving = false;

        const x = Math.floor(targetX / SQUARE_WIDTH);
        const y = targetY / SQUARE_WIDTH;

        const bomb = this.bombPositions.find(
          (pos) => pos.x === x && pos.y === y
        );
        if (bomb) {
          this.kaboom(targetX, targetY, "currentPlayer");
        }
      },
    });
  }

  update() {
    this.updateOtherPlayers();

    if (!this.currentPlayer?.body) {
      return;
    }

    const x = this.currentPlayer?.x ?? 0;
    const y = this.currentPlayer?.y ?? 0;

    const playerX = x / SQUARE_WIDTH;
    const playerY = y / SQUARE_WIDTH;
    const isPlayerOnBoard =
      x >= SQUARE_WIDTH * 10 &&
      x <= SQUARE_WIDTH * 20 &&
      y >= SQUARE_WIDTH * 11 &&
      y <= SQUARE_WIDTH * 25;

    if (isPlayerOnBoard) {
      this.updatePlayerOnBoard();
      return;
    }

    this.updatePlayer();
  }
}
