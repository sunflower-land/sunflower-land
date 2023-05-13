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
import tilesheet from "./assets/idle-Sheet.png";
import speechBubble from "./assets/speech_bubble.png";
import walking from "./assets/walking.png";
import fontPng from "./assets/pixel.png";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { subber } from "./Phaser";
import { npcModalManager } from "./SceneModals";
import { SpeechBubble } from "./SpeechBubble";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");

export class PhaserScene extends Phaser.Scene {
  room: Room;

  currentPlayer: Phaser.Physics.Arcade.Sprite;
  playerEntities: {
    [sessionId: string]: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  } = {};
  playerMessages: {
    [sessionId: string]: SpeechBubble;
  } = {};

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
    console.log("Preload");
    // load the JSON file
    this.load.tilemapTiledJSON("main-map", mapJson);

    // load the PNG file
    this.load.image("tileset", mapPng);
    this.load.image("speech_bubble", speechBubble);

    this.load.spritesheet("bumpkin", tilesheet, {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.spritesheet("walking", walking, {
      frameWidth: 13,
      frameHeight: 18,
    });

    this.load.setCORS("https://localhost:3000");

    this.load.bitmapFont(
      "pixel",
      fontPng,
      "./src/features/phaser/assets/pixel.xml"
    );
  }

  async create() {
    console.log("Creat");

    // CSSString: 'url(assets/input/cursors/sword.cur), pointer'

    const map = this.make.tilemap({
      key: "main-map",
    });
    const tileset = map.addTilesetImage("Sunnyside V3", "tileset", 16, 16);

    // const border = this.make.tileSprite({
    //   x: 0,
    //   y: 0,
    //   width: 16,
    //   height: 16,

    //   key: "tileset",
    //   frame: 4,
    // });

    // const border = this.add.nineslice(
    //   50,
    //   50, // Position
    //   100,
    //   100, // Width & Height
    //   "speech_bubble", // a key to an already loaded image
    //   3 // the width and height to offset for a corner slice
    //   // 0 // (optional) pixels to offset when computing the safe usage area
    // );
    // const border = this.add.image(0, 0, "tileset");

    // this.physics.add.staticGroup(border);

    // this.add(border);

    const customColliders = this.add.group();

    const objectLayer = map.getObjectLayer("Collision");
    console.log({ objectLayer });
    const coins = map.createFromObjects("Collision", { key: "coin" });
    console.log(coins); // give an array of sprites

    coins.forEach((coin) => {
      console.log({ coin });
      customColliders.add(coin);
      coin.setInteractive(false);
      this.physics.world.enable(coin);
      coin.body.setImmovable(true);
    });
    console.log(coins); // each coin has now a body

    // this.physics.add.collider(player, coins, null, null, this);

    const TOP_LAYERS = [
      "Decorations Layer 1",
      "Decorations Layer 2",
      "Decorations Layer 3",
      "Building Layer 2",
      "Building Layer 3",
    ];
    // let collisionLayer: Phaser.Tilemaps.TilemapLayer;
    map.layers.forEach((layerData, idx) => {
      // console.log({ name: layerData.name, idx });

      const layer = map.createLayer(layerData.name, tileset, 0, 0);

      if (TOP_LAYERS.includes(layerData.name)) {
        console.log("Got it");
        layer?.setDepth(1);
      }
      // if (layerData.name === "Colliders") {
      //   // collisionLayer = layer as Phaser.Tilemaps.TilemapLayer;
      //   console.log({ data: layer?.layer.data });
      //   layer.layer.data.forEach((tileRows) => {
      //     tileRows.forEach((tile) => {
      //       const { index, tileset, x, y, properties } = tile;

      //       if (Object.keys(properties).length === 0) {
      //         return;
      //       }

      //       console.log({ properties, tile });
      //       let tmp = this.physics.add.sprite(tile.x, tile.pixelY, "__DEFAULT");
      //       tmp.setImmovable(true);
      //       tmp.body.setSize(16, 16);
      //       // .setOffset(properties.x, properties.y); //Size/Offset for tree collider
      //       // this.physics.add.collider(this.currentPlayer, tmpSprite);

      //       customColliders.add(tmp);
      //       tile.width = 8;
      //     });
      //   });
      // }
    });

    // map.layers.forEach((layerData, idx) => {
    //   if (layerData.name !== "Plants") {
    //     const layer = map.createLayer(layerData.name, tileset, 0, 0);

    //     layer.layer.data.forEach((tileRows) => {
    //       tileRows.forEach((tile) => {
    //         const { index, tileset, properties } = tile;

    //         console.log({ properties });
    //       });
    //     });
    //   }
    // });

    // const belowLayer = map.createLayer("Grass", tileset, 0, 0);
    // const collisionLayer = map.createLayer("Plants", tileset, 0, 0);
    // const pathLayer = map.createLayer("Pathj", tileset, 0, 0);
    // const treeLayer = map.createLayer("Trees", tileset, 0, 0);

    // collisionLayer.setCollisionByExclusion([-1]);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    const keySPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.input.keyboard?.removeCapture("SPACE");

    this.debugFPS = this.add.text(4, 4, "", { color: "#ff0000" });

    const betty = this.physics.add
      .sprite(10, 10, "bumpkin")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH)
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
        const previous = this.playerMessages[message.sessionId];

        if (previous) {
          previous.destroy();
          delete this.playerEntities[message.sessionId];
        }
        this.playerMessages[message.sessionId] = new SpeechBubble(
          this,
          message.text
        );
        //  this.add
        //   .text(50, 50, message.text, {
        //     font: "8px Arial",
        //     color: "#000000",
        //     backgroundColor: "#ffffff",
        //   })
        //   .setResolution(10);
      }

      // sprite.addChild(text);

      //       var text = game.add.text(0, 0, "Some text", {font: "16px Arial", fill: "#ffffff"});
      // sprite.addChild(text);
    });

    this.room.state.players.onAdd((player, sessionId) => {
      console.log({ player, sessionId });
      const entity = this.physics.add
        .sprite(player.x, player.y, "bumpkin")
        .setSize(SQUARE_WIDTH, SQUARE_WIDTH);
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
        this.currentPlayer.body.setOffset(3, 8);

        // this.physics.add.collider(this.currentPlayer, collisionLayer);
        this.currentPlayer.setCollideWorldBounds(true);
        this.physics.add.collider(this.currentPlayer, customColliders);

        camera.startFollow(this.currentPlayer, true, 0.05, 0.05);
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

    // this.currentPlayer = this.physics.add
    //   .sprite(200, 200, "bumpkin")
    //   .setSize(SQUARE_WIDTH, SQUARE_WIDTH);
    console.log("Pre play");

    this.anims.create({
      key: "bumpkin-idle",
      frames: this.anims.generateFrameNumbers("bumpkin", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    this.anims.create({
      key: "bumpkin-walking",
      frames: this.anims.generateFrameNumbers("walking", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    console.log("play");

    this.boxGroup = this.physics.add.staticGroup();

    const { game } = this.sys;
    const camera = this.cameras.main;
    console.log(JSON.stringify(game.scale.gameSize));

    camera.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);
    camera.setZoom(4);

    this.physics.world.setBounds(0, 0, 55 * SQUARE_WIDTH, 32 * SQUARE_WIDTH);

    // setInterval(() => {
    //   this.room.send(0, { text: "Yo!" });
    // }, 1000);
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
      this.currentPlayer.setVelocityX(-speed);
      this.currentPlayer.setScale(-1, 1);
      this.currentPlayer.body.width = 10;
      this.currentPlayer.body.height = 8;
      this.currentPlayer.body.setOffset(14, 8);
    } else if (this.inputPayload.right) {
      this.currentPlayer.setVelocityX(speed);
      this.currentPlayer.setScale(1, 1);
      this.currentPlayer.body.setOffset(3, 8);
    } else {
      this.currentPlayer.setVelocityX(0);
    }

    if (this.inputPayload.up) {
      // this.currentPlayer.y -= velocity;
      this.currentPlayer.setVelocityY(-speed);
    } else if (this.inputPayload.down) {
      // this.currentPlayer.y += velocity;
      this.currentPlayer.setVelocityY(speed);
    } else {
      this.currentPlayer.setVelocityY(0);
    }

    if (
      this.inputPayload.down ||
      this.inputPayload.up ||
      this.inputPayload.left ||
      this.inputPayload.right
    ) {
      console.log("Walk it!");
      this.currentPlayer.play("bumpkin-walking", true);
    } else {
      this.currentPlayer.play(`bumpkin-idle`, true);
    }

    this.localRef.x = this.currentPlayer.x;
    this.localRef.y = this.currentPlayer.y;

    this.room.send(0, {
      x: this.currentPlayer.x,
      y: this.currentPlayer.y,
    });

    const message = this.playerMessages[this.room.sessionId];
    if (message) {
      message.bubble.x = this.currentPlayer.x;
      message.bubble.y = this.currentPlayer.y;
    }

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
        entity.play("bumpkin-walking", true);
      } else {
        entity.play(`bumpkin-idle`, true);
      }

      if (serverX > entity.x) {
        entity.setScale(1, 1);
      } else if (serverX < entity.x) {
        entity.setScale(-1, 1);
      }

      entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
      entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);

      const message = this.playerMessages[sessionId];
      if (message) {
        message.x = entity.x;
        message.y = entity.y;
      }
    }
  }
}
