/**
 * ---------------------------
 * Phaser + Colyseus - Part 4.
 * ---------------------------
 * - Connecting with the room
 * - Sending inputs at the user's framerate
 * - Update other player's positions WITH interpolation (for other players)
 * - Client-predicted input for local (current) player
 * - Fixed tickrate on both client and server
 */

import Phaser from "phaser";
import { Room, Client } from "colyseus.js";

import mapPng from "./assets/embedded.png";
import mapJson from "./assets/world_plaza.json";
import speechBubble from "./assets/speech_bubble.png";
// import tilesheet from "./assets/idle-Sheet.png";
// import walking from "./assets/walking.png";
import shadow from "assets/npcs/shadow.png";
import silhouette from "assets/npcs/silhouette.webp";
import fontPng from "./assets/pixel.png";
import { INITIAL_BUMPKIN, SQUARE_WIDTH } from "features/game/lib/constants";
import { subber } from "./Phaser";
import { npcModalManager } from "./SceneModals";
import { Player } from "./Player";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");

export class PhaserScene extends Phaser.Scene {
  room: Room;

  currentPlayer: Player;
  playerEntities: {
    [sessionId: string]: Player;
  } = {};
  // playerMessages: {
  //   [sessionId: string]: SpeechBubble;
  // } = {};

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  boxGroup;

  debugFPS: Phaser.GameObjects.Text;

  localRef: Phaser.GameObjects.Rectangle;
  remoteRef: Phaser.GameObjects.Rectangle;

  cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  inputPayload = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: undefined,
  };

  elapsedTime = 0;
  fixedTimeStep = 1000 / 60;

  currentTick = 0;

  constructor() {
    super("game");
  }

  preload() {
    // load the JSON file
    this.load.tilemapTiledJSON("main-map", mapJson);

    // load the PNG file
    this.load.image("tileset", mapPng);
    this.load.image("speech_bubble", speechBubble);
    this.load.image("shadow", shadow);
    this.load.spritesheet("silhouette", silhouette, {
      frameWidth: 14,
      frameHeight: 18,
    });

    // this.load.spritesheet("bumpkin", tilesheet, {
    //   frameWidth: 14,
    //   frameHeight: 18,
    // });
    // this.load.spritesheet("walking", walking, {
    //   frameWidth: 13,
    //   frameHeight: 18,
    // });

    this.load.bitmapFont(
      "pixel",
      fontPng,
      "./src/features/phaser/assets/pixel.xml"
    );
  }

  async create() {
    // CSSString: 'url(assets/input/cursors/sword.cur), pointer'

    const map = this.make.tilemap({
      key: "main-map",
    });
    const tileset = map.addTilesetImage("Sunnyside V3", "tileset", 16, 16);

    const customColliders = this.add.group();

    const objectLayer = map.getObjectLayer("Collision");
    const collisionPolygons = map.createFromObjects("Collision", {
      key: "coin",
    });

    collisionPolygons.forEach((polygon) => {
      customColliders.add(polygon);
      polygon.setInteractive(false);
      this.physics.world.enable(polygon);
      polygon.body.setImmovable(true);
    });

    // this.physics.add.collider(player, coins, null, null, this);

    this.physics.world.drawDebug = false;

    const TOP_LAYERS = [
      "Decorations Layer 1",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Building Layer 2",
      "Building Layer 3",
    ];

    map.layers.forEach((layerData, idx) => {
      const layer = map.createLayer(layerData.name, tileset, 0, 0);

      if (TOP_LAYERS.includes(layerData.name)) {
        console.log("Got it");
        layer?.setDepth(1);
      }
    });

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    const keySPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.input.keyboard?.removeCapture("SPACE");

    this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000" });

    const betty = new Player(this, 400, 400, {
      ...INITIAL_BUMPKIN,
      id: 44444,
      equipped: {
        ...INITIAL_BUMPKIN.equipped,
        hair: "Rancher Hair",
      },
    })
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        console.log("Bumpkin clicked");
        npcModalManager.open("betty");
      });

    this.physics.world.enable(betty);

    // connect with the room
    await this.connect();

    subber.subscribe((text: string) => {
      this.room.send(0, { text });
    });

    this.room.state.messages.onAdd((message) => {
      console.log({ message: message, sId: message.sessionId });

      if (message.sessionId && String(message.sessionId).length > 4) {
        this.playerEntities[message.sessionId].speak(message.text);
      }
    });

    this.room.state.players.onAdd((player, sessionId) => {
      console.log({ player, sessionId });

      const entity = new Player(this, player.x, player.y, INITIAL_BUMPKIN);
      this.playerEntities[sessionId] = entity;

      // is current player
      if (sessionId === this.room.sessionId) {
        this.currentPlayer = entity;

        this.localRef = this.add.rectangle(0, 0, entity.width, entity.height);
        // this.localRef.setStrokeStyle(1, 0x00ff00);

        this.remoteRef = this.add.rectangle(0, 0, entity.width, entity.height);
        // this.remoteRef.setStrokeStyle(1, 0xff0000);

        player.onChange(() => {
          this.remoteRef.x = player.x;
          this.remoteRef.y = player.y;
        });

        this.currentPlayer.body.width = 10;
        this.currentPlayer.body.height = 8;
        this.currentPlayer.body.setOffset(3, 10);

        // this.physics.add.collider(this.currentPlayer, collisionLayer);
        this.currentPlayer.body.setCollideWorldBounds(true);
        console.log({ player: this.currentPlayer });
        this.physics.add.collider(this.currentPlayer, customColliders);

        camera.startFollow(this.currentPlayer, true, 0.08, 0.08);
      } else {
        // listening for server updates
        player.onChange(() => {
          console.log({ player });
          //
          // we're going to LERP the positions during the render loop.
          //
          entity.setData("serverX", player.x);
          entity.setData("serverY", player.y);
        });
      }
    });

    // remove local reference when entity is removed from the server
    this.room.state.players.onRemove((player, sessionId) => {
      const entity = this.playerEntities[sessionId];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[sessionId];
      }
    });

    const { width, height } = this.scale;

    console.log({ width, height });

    console.log("play");

    this.boxGroup = this.physics.add.staticGroup();

    const { game } = this.sys;
    const camera = this.cameras.main;
    console.log(JSON.stringify(game.scale.gameSize));

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
  }

  async connect() {
    // add connection status text
    const connectionStatusText = this.add
      .text(0, 0, "Trying to connect with the server...")
      .setStyle({ color: "#ff0000" })
      .setPadding(4);

    const client = new Client(BACKEND_URL);

    try {
      this.room = await client.joinOrCreate("part4_room", {});

      // connection successful!
      connectionStatusText.destroy();
    } catch (e) {
      // couldn't connect
      connectionStatusText.text = "Could not connect with the server.";
    }
  }

  update(time: number, delta: number): void {
    // skip loop if not connected yet.
    // if (!this.currentPlayer) {
    //   return;
    // }

    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.fixedTick(time, this.fixedTimeStep);
    }

    this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
  }

  fixedTick(time: number, delta: number) {
    this.currentTick++;

    // const currentPlayerRemote = this.room.state.players.get(this.room.sessionId);
    // const ticksBehind = this.currentTick - currentPlayerRemote.tick;
    // console.log({ ticksBehind });
    const speed = 70;

    const velocity = 1;
    this.inputPayload.left = this.cursorKeys.left.isDown;
    this.inputPayload.right = this.cursorKeys.right.isDown;
    this.inputPayload.up = this.cursorKeys.up.isDown;
    this.inputPayload.down = this.cursorKeys.down.isDown;
    this.inputPayload.tick = this.currentTick;

    if (this.inputPayload.left) {
      this.currentPlayer.body.setVelocityX(-speed);
      this.currentPlayer.sprite.setScale(-1, 1);
      this.currentPlayer.body.width = 10;
      this.currentPlayer.body.height = 10;
      this.currentPlayer.body.setOffset(2, 10);
    } else if (this.inputPayload.right) {
      this.currentPlayer.body.setVelocityX(speed);
      this.currentPlayer.sprite.setScale(1, 1);
      this.currentPlayer.body.setOffset(3, 10);
    } else {
      this.currentPlayer.body.setVelocityX(0);
    }

    if (this.inputPayload.up) {
      // this.currentPlayer.y -= velocity;
      this.currentPlayer.body.setVelocityY(-speed);
    } else if (this.inputPayload.down) {
      // this.currentPlayer.y += velocity;
      this.currentPlayer.body.setVelocityY(speed);
    } else {
      this.currentPlayer.body.setVelocityY(0);
    }

    if (
      this.inputPayload.down ||
      this.inputPayload.up ||
      this.inputPayload.left ||
      this.inputPayload.right
    ) {
      console.log("Walk it!");
      this.currentPlayer.walk();
    } else {
      this.currentPlayer.stop();
    }

    this.localRef.x = this.currentPlayer.x;
    this.localRef.y = this.currentPlayer.y;

    this.room.send(0, {
      x: this.currentPlayer.x,
      y: this.currentPlayer.y,
    });

    for (const sessionId in this.playerEntities) {
      // interpolate all player entities
      // (except the current player)
      if (sessionId === this.room.sessionId) {
        continue;
      }

      const entity = this.playerEntities[sessionId];
      const { serverX, serverY } = entity.data.values;

      if (
        serverX.toFixed(1) !== entity.x.toFixed(1) ||
        serverY.toFixed(1) !== entity.y.toFixed(1)
      ) {
        entity.walk();
      } else {
        entity.stop();
      }

      if (serverX > entity.x) {
        entity.setScale(1, 1);
      } else if (serverX < entity.x) {
        entity.setScale(-1, 1);
      }

      entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
    }
  }
}
