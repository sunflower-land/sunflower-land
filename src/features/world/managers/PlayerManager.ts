import Phaser from "phaser";
import { translate } from "lib/i18n/translate";

import { Room } from "colyseus.js";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { FACTION_NAME_COLORS, CONFIG } from "../scenes/BaseScene";
import { FactionName, GameState } from "features/game/types/game";
import { PlazaRoomState, Player } from "../types/Room";
import { playerModalManager } from "../ui/PlayerModals";
import { isTouchDevice } from "../lib/device";
import VirtualJoyStick from "phaser3-rex-plugins/plugins/virtualjoystick";

interface createPlayerOptions {
  isCurrentPlayer: boolean;
  x: number;
  y: number;
  farmId: number;
  username?: string;
  faction?: FactionName;
  clothing: Player["clothing"];
  experience?: number;
}

const ZOOM = window.innerWidth < 500 ? 3 : 4;

export class PlayerManager {
  private scene: Phaser.Scene;
  private server?: Room<PlazaRoomState>;

  private player: BumpkinContainer | undefined;
  private players: Record<string, BumpkinContainer> = {};
  private clothing: Record<string, Player["clothing"]> = {};
  private diggers: Map<string, { x: number; y: number }> = new Map(); // ?? Do we need this?

  private packetSentAt = 0;
  private serverPosition = { x: 0, y: 0 };

  private joystick?: VirtualJoyStick;
  private movementKeys:
    | {
        // Arrow keys
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;

        // WA keys
        w?: Phaser.Input.Keyboard.Key;
        a?: Phaser.Input.Keyboard.Key;

        // ZQ keys
        z?: Phaser.Input.Keyboard.Key;
        q?: Phaser.Input.Keyboard.Key;

        // SD keys
        s?: Phaser.Input.Keyboard.Key;
        d?: Phaser.Input.Keyboard.Key;

        // Space key
        space?: Phaser.Input.Keyboard.Key;
      }
    | undefined;

  constructor(scene: Phaser.Scene, server?: Room<PlazaRoomState>) {
    this.scene = scene;
    this.server = server;
  }

  public get gameState() {
    return this.scene.registry.get("gameState") as GameState;
  }

  // Main functions

  create(player: createPlayerOptions): BumpkinContainer {
    const {
      x,
      y,
      farmId,
      username,
      faction,
      isCurrentPlayer,
      clothing,
      experience = 0,
    } = player;

    const defaultClick = () => {
      const distance = Phaser.Math.Distance.BetweenPoints(
        entity,
        this.player as BumpkinContainer,
      );

      if (distance > 50) {
        entity.speak(translate("base.far.away"));
      } else {
        playerModalManager.open({
          id: farmId,
          clothing,
          experience,
        });
      }
    };

    const entity = new BumpkinContainer({
      scene: this.scene,
      x,
      y,
      clothing,
      faction,
      onClick: defaultClick,
    });

    const color = faction ? FACTION_NAME_COLORS[faction] : "#fff";
    const tag = this.createPlayerTag({
      x: 0,
      y: 0,
      text: username ?? `#${farmId}`,
      color,
    });
    tag.setShadow(1, 1, "#161424", 0, false, true);
    tag.name = "nameTag";
    entity.add(tag);

    if (isCurrentPlayer) {
      this.player = entity;

      (this.player.body as Phaser.Physics.Arcade.Body)
        .setOffset(3, 10)
        .setSize(10, 8)
        .setCollideWorldBounds(true)
        .setAllowRotation(false);

      this.scene.cameras.main.startFollow(this.player);
    } else {
      (entity.body as Phaser.Physics.Arcade.Body)
        .setSize(16, 20)
        .setOffset(0, 0);
    }

    return entity;
  }

  destroy(sessionId: string): void {
    const entity = this.players[sessionId];
    if (entity) {
      entity.disappear();
      delete this.players[sessionId];
    }
  }

  render(): void {
    const currentTime = Date.now();

    const isPlayerInHiddenColliders = this.scene.physics.overlap(
      {} as Phaser.GameObjects.Group,
      this.player,
    );

    this.server?.state.players.forEach((player, sessionId) => {
      if (sessionId === this.server?.sessionId) return;

      const entity = this.players[sessionId];
      if (!entity?.active) return;

      const isEntityInHiddenColliders = this.scene.physics.overlap(
        {} as Phaser.GameObjects.Group,
        entity,
      );

      const hidden = !isPlayerInHiddenColliders || isEntityInHiddenColliders;
      if (hidden === entity.visible) {
        entity.setVisible(!hidden);
      }

      if (!entity.previousPosition) {
        entity.previousPosition = {
          x: entity.x,
          y: entity.y,
          timestamp: currentTime,
        };
        return;
      }

      // Interpolate entity position
      const delta = (currentTime - entity.previousPosition.timestamp) / 1000;
      const velX = (player.x - entity.previousPosition.x) / delta;
      const velY = (player.y - entity.previousPosition.y) / delta;
      const predictedX = player.x + velX * CONFIG.PREDICTION_TIME;
      const predictedY = player.y + velY * CONFIG.PREDICTION_TIME;

      entity.x = Phaser.Math.Linear(
        entity.x,
        predictedX,
        CONFIG.INTERPOLATION_RATE,
      );
      entity.y = Phaser.Math.Linear(
        entity.y,
        predictedY,
        CONFIG.INTERPOLATION_RATE,
      );
      entity.setDepth(Math.floor(entity.y));

      // Update movement direction
      const distanceToServer = Phaser.Math.Distance.Between(
        entity.x,
        entity.y,
        player.x,
        player.y,
      );

      if (player.x > entity.x) {
        entity.faceRight();
      } else {
        entity.faceLeft();
      }

      if (distanceToServer < 2) {
        entity.idle();
      } else {
        entity.walk();
      }

      // Update previous position
      entity.previousPosition = {
        x: entity.x,
        y: entity.y,
        timestamp: currentTime,
      };
    });
  }

  update(): void {
    if (!this.player?.body) return;

    const angle = this.getMovementAngle();
    this.updatePlayerDirection(angle);
    this.updatePlayerVelocity(angle);
    this.handleAnimations(angle);
    this.sendPositionToServer();

    if (this.server) {
      this.destroyOldPlayers();
      this.createNewPlayers();
      this.updateClothing();
      this.render();
    }
  }

  // Input

  initControls(): void {
    if (isTouchDevice()) {
      const { centerX, centerY, height } = this.scene.cameras.main;

      this.joystick = new VirtualJoyStick(this.scene, {
        x: centerX,
        y: centerY - 35 + height / ZOOM / 2,
        radius: 15,
        base: this.scene.add
          .circle(0, 0, 15, 0x000000, 0.2)
          .setDepth(1000000000),
        thumb: this.scene.add
          .circle(0, 0, 7, 0xffffff, 0.5)
          .setDepth(1000000000),
        forceMin: 2,
      });
    }

    this.movementKeys = this.scene.input.keyboard?.createCursorKeys();

    if (this.movementKeys) {
      this.movementKeys.w = this.scene.input.keyboard?.addKey("W");
      this.movementKeys.a = this.scene.input.keyboard?.addKey("A");
      this.movementKeys.s = this.scene.input.keyboard?.addKey("S");
      this.movementKeys.d = this.scene.input.keyboard?.addKey("D");

      this.scene.input.keyboard?.removeCapture("SPACE");
    }

    this.scene.input.setTopOnly(true);
  }

  // Helpers

  private createPlayerTag(options: {
    x: number;
    y: number;
    text: string;
    color: string;
  }): Phaser.GameObjects.Text {
    const { x, y, text, color } = options;

    const object = this.scene.add.text(x, y + CONFIG.NAME_TAG_OFFSET_PX, text, {
      fontSize: "4px",
      fontFamily: "monospace",
      resolution: 4,
      padding: { x: 2, y: 2 },
      color,
    });
    object.setOrigin(0.5);

    this.scene.physics.add.existing(object);
    (object.body as Phaser.Physics.Arcade.Body).checkCollision.none = true;

    return object;
  }

  private getMovementAngle(): number | undefined {
    if (this.joystick?.force) {
      return this.joystick.angle;
    }

    if (document.activeElement?.tagName === "INPUT") return undefined;

    const left =
      this.movementKeys?.left?.isDown || this.movementKeys?.a?.isDown;
    const right =
      this.movementKeys?.right?.isDown || this.movementKeys?.d?.isDown;
    const up = this.movementKeys?.up?.isDown || this.movementKeys?.w?.isDown;
    const down =
      this.movementKeys?.down?.isDown || this.movementKeys?.s?.isDown;

    return this.keysToAngle(left, right, up, down);
  }

  private updatePlayerDirection(angle?: number): void {
    if (angle === undefined) return;

    const isFacingLeft = Math.abs(angle) > 90;

    if (isFacingLeft) {
      this.player?.faceLeft();
    } else {
      this.player?.faceRight();
    }
  }

  private updatePlayerVelocity(angle?: number): void {
    const body = this.player?.body as Phaser.Physics.Arcade.Body;

    if (angle === undefined) {
      body.setVelocity(0, 0);
    } else {
      const speed = this.getWalkingSpeed();
      body.setVelocity(
        speed * Math.cos((angle * Math.PI) / 180),
        speed * Math.sin((angle * Math.PI) / 180),
      );
    }
  }

  private handleAnimations(angle?: number | undefined): void {
    const isMoving = angle !== undefined && this.getWalkingSpeed() > 0;

    if (isMoving) {
      this.player?.walk();
      // TODO: Play walking audio
    } else {
      this.player?.idle();
      // TODO: Stop walking audio
    }

    if (this.player) {
      this.player.setDepth(Math.floor(this.player.y));
    }
  }

  private sendPositionToServer(): void {
    if (!this.player || !this.server) return;

    const now = Date.now();
    if (now - this.packetSentAt < 1000 / CONFIG.SEND_PACKET_RATE) return;

    const xDiff = Math.abs(this.player.x - this.serverPosition.x);
    const yDiff = Math.abs(this.player.y - this.serverPosition.y);
    if (xDiff < 1 && yDiff < 1) return;

    this.serverPosition = { x: this.player.x, y: this.player.y };
    this.packetSentAt = now;

    this.server.send("player:move", this.serverPosition);
  }

  private getWalkingSpeed(): number {
    return CONFIG.WALKING_SPEED;
  }

  private keysToAngle(
    left?: boolean,
    right?: boolean,
    up?: boolean,
    down?: boolean,
  ): number | undefined {
    const x = (right ? 1 : 0) + (left ? -1 : 0);
    const y = (down ? 1 : 0) + (up ? -1 : 0);

    if (x === 0 && y === 0) return undefined;

    //return Phaser.Math.Angle.Between(0, 0, x, y);
    return (Math.atan2(y, x) * 180) / Math.PI;
  }

  private destroyOldPlayers(): void {
    Object.keys(this.players).forEach((sessionId) => {
      const player = this.server?.state.players.get(sessionId);

      if (
        !player ||
        player.sceneId !== this.scene.scene.key ||
        !this.players[sessionId]?.active
      ) {
        this.destroy(sessionId);
      }
    });
  }

  private createNewPlayers(): void {
    this.server?.state.players.forEach((player, sessionId) => {
      if (
        sessionId === this.server?.sessionId ||
        player.sceneId !== this.scene.scene.key
      ) {
        return;
      }

      if (!this.players[sessionId]) {
        this.players[sessionId] = this.create({
          x: player.x,
          y: player.y,
          farmId: player.farmId,
          username: player.username,
          faction: player.faction,
          isCurrentPlayer: false,
          clothing: player.clothing,
          experience: player.experience,
        });
      }
    });
  }

  private updateClothing(): void {
    this.server?.state.players.forEach((player, sessionId) => {
      if (
        this.players[sessionId] &&
        player.clothing !== this.clothing[sessionId]
      ) {
        this.players[sessionId].changeClothing(player.clothing);
        this.clothing[sessionId] = player.clothing;
      } else if (
        sessionId === this.server?.sessionId &&
        player.clothing !== this.player?.clothing
      ) {
        this.player?.changeClothing(player.clothing);
        this.clothing[sessionId] = player.clothing;
      }
    });
  }

  calculateDistanceBetweenPlayers(
    player1: BumpkinContainer,
    player2: BumpkinContainer,
  ) {
    return Phaser.Math.Distance.BetweenPoints(player1, player2);
  }
}
