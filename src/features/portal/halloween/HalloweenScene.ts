import mapJson from "assets/map/halloween.json";
import tilesetConfig from "assets/map/halloween-tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, NPCBumpkin, HALLOWEEN_SQUARE_WIDTH } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/halloweenMachine";
import { DarknessPipeline } from "./shaders/DarknessShader";
import { VisibilityPolygon } from "./lib/visibilityPolygon";
import {
  INITIAL_LAMPS_LIGHT_RADIUS,
  MIN_PLAYER_LIGHT_RADIUS,
  LAMPS_CONFIGURATION,
  LAMP_SPAWN_BASE_INTERVAL,
  MAX_LAMPS_IN_MAP,
  LAMP_SPAWN_INCREASE_PERCENTAGE,
} from "./HalloweenConstants";
import { LampContainer } from "./containers/LampContainer";
import { EventObject } from "xstate";
import { SPAWNS } from "features/world/lib/spawn";
import { createLightPolygon } from "./lib/HalloweenUtils";

export const NPCS: NPCBumpkin[] = [
  {
    x: 380,
    y: 400,
    // View NPCModals.tsx for implementation of pop up modal
    npc: "portaller",
  },
];

interface Coordinates {
  x: number;
  y: number;
}

export class HalloweenScene extends BaseScene {
  private mask?: Phaser.Display.Masks.GeometryMask;
  private lightedItems!: Phaser.GameObjects.Container[];
  private polygons!: [number, number][][];
  private polygonShapes!: Phaser.Geom.Polygon[];
  private playerPosition!: Coordinates;
  private lightGraphics?: Phaser.GameObjects.Graphics;
  private visibilityPolygon!: VisibilityPolygon;
  private lampSpawnTime!: number;
  private numLampsInMap!: number;
  private deathDate!: Date | null;
  private carrot_sunflowers: Phaser.Physics.Arcade.Sprite[] = [];
  private lastSpawnTime: number = 0; // Time tracker for enemy spawning
  private updateInterval: number = 120000; // 120 seconds
  private spawnCount: number = 10; // Track the number of enemies spawned in the current minute
  private maxEnemiesPerMinute: number = 50; // Maximum enemies to spawn each minute

  sceneId: SceneId = "halloween";

  constructor() {
    super({
      name: "halloween",
      map: {
        json: mapJson,
        imageKey: "halloween-tileset",
        defaultTilesetConfig: tilesetConfig,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
    this.setDefaultStates();
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  preload() {
    super.preload();

    this.load.spritesheet("lamp", "world/lamp.png", {
      frameWidth: 14,
      frameHeight: 20,
    });

    this.load.spritesheet("carrot_sunflower", "world/carrot_sunflower.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("carrot_sunflower1", "world/carrot_sunflower1.png", {
      frameWidth: 15,
      frameHeight: 18,
    });

    this.load.spritesheet("poof", "world/poof.png", {
      frameWidth: 15,
      frameHeight: 18,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "halloween",
    });

    super.create();

    this.initShaders();

    this.physics.world.drawDebug = false;

    // Important to first save the player and then the lamps
    this.currentPlayer && (this.lightedItems[0] = this.currentPlayer);
    this.createMask();
    this.createWalls();
    this.createAllLamps();

    this.initialiseNPCs(NPCS);

    // reload scene when player hit retry
    const onRetry = (event: EventObject) => {
      if (event.type === "RETRY") {
        this.isCameraFading = true;
        this.cameras.main.fadeOut(500);
        this.reset();
        this.cameras.main.on(
          "camerafadeoutcomplete",
          () => {
            this.cameras.main.fadeIn(500);
            this.isCameraFading = false;
          },
          this,
        );
      }
    };
    this.portalService?.onEvent(onRetry);

    // Prevent zoom
    window.addEventListener(
      "wheel",
      function (e) {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
    window.addEventListener("keydown", function (e) {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=")
      ) {
        e.preventDefault();
      }
    });
    document.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      },
      { passive: false },
    );
    document.addEventListener("gesturestart", function (e) {
      e.preventDefault();
    });
  }

  update() {
    if (!this.currentPlayer) return;

    if (this.portalService?.state.context.lamps === -1) {
      this.endGame();
    } else {
      this.adjustShaders();

      const { x: currentX = 0, y: currentY = 0 } = this.currentPlayer ?? {};

      if (
        this.playerPosition.x !== currentX ||
        this.playerPosition.y !== currentY
      ) {
        this.renderAllLights();
        this.playerPosition = { x: currentX, y: currentY };
      }

      this.enemy_1();
      this.faceDirectionEnemy_1();

      this.loadBumpkinAnimations();

      this.setLampSpawnTime();

      this.portalService?.send("GAIN_POINTS");

      this.isGameReady && this.portalService?.send("START");
    }

    this.currentPlayer.updateLightRadius();

    super.update();
  }

// Enemy_1 (Carrot Sunflower)
enemy_1() {
  const currentTime = this.time.now;

  // Reset spawn count after a minute
  if (currentTime - this.lastSpawnTime > this.updateInterval) {
      console.log(`Enemy count has been reset. Total enemies spawned: ${this.spawnCount}`);
      this.spawnCount = 0;
      this.lastSpawnTime = currentTime;
  }

  // Spawn enemies up to the maximum limit
  while (this.spawnCount < this.maxEnemiesPerMinute) {
      const randomX = Phaser.Math.Between(0, this.map.widthInPixels - HALLOWEEN_SQUARE_WIDTH);
      const randomY = Phaser.Math.Between(0, this.map.heightInPixels - HALLOWEEN_SQUARE_WIDTH);
      const carrot_sunflower = this.createEnemy_1(randomX, randomY);

      if (this.currentPlayer) {
          this.physics.add.collider(carrot_sunflower, this.currentPlayer, () => this.handleCollision(carrot_sunflower));
      }
      this.spawnCount++;
  }
}

createEnemy_1(x: number, y: number) {
  const carrot_sunflower = this.physics.add.sprite(x, y, "carrot_sunflower")
      .setSize(HALLOWEEN_SQUARE_WIDTH, HALLOWEEN_SQUARE_WIDTH)
      .setVelocity(Phaser.Math.Between(10, 20), Phaser.Math.Between(10, 20))
      .setCollideWorldBounds(true)
      .setBounce(1, 1);
  
  this.carrot_sunflowers.push(carrot_sunflower);
  this.AnimationEnemy_1();
  console.log(`Spawned Carrot Sunflower #${this.spawnCount + 1}:`, { x, y });
  return carrot_sunflower;
}

AnimationEnemy_1() {
  ["carrot_sunflower", "carrot_sunflower1"].forEach(key => {
      if (!this.anims.exists(`${key}_anim`)) {
          this.anims.create({
              key: `${key}_anim`,
              frames: this.anims.generateFrameNumbers(key, { start: 0, end: 8 }),
              repeat: -1,
              frameRate: 10,
          });
      }
  });
}

// Handle collision with carrot_sunflower
handleCollision(carrot_sunflower: Phaser.Physics.Arcade.Sprite) {
  const { x, y } = carrot_sunflower;
  const poof = this.add.sprite(x, y, "poof").play("poof_anim", true);
  
  if (!this.anims.exists("poof_anim")) {
      this.anims.create({
          key: "poof_anim",
          frames: this.anims.generateFrameNumbers("poof", { start: 0, end: 7 }),
          repeat: 0,
          frameRate: 10,
      });
  }

  poof.play("poof_anim", true);

  poof.on("animationcomplete", () => poof.destroy());
  carrot_sunflower.destroy();
  this.carrot_sunflowers = this.carrot_sunflowers.filter(sprite => sprite !== carrot_sunflower);
  this.currentPlayer && this.handleDimEffect();
}

handleDimEffect() {
  const darknessPipeline = this.cameras.main.getPostPipeline("DarknessPipeline") as DarknessPipeline;
  darknessPipeline.lightRadius[0] = 0; // Dim the light immediately
}

// Animation Direction of Enemy_1
faceDirectionEnemy_1() {
  this.carrot_sunflowers.forEach(carrot_sunflower => {
      if (carrot_sunflower.body) {
          const animKey = carrot_sunflower.body.velocity.x > 0 ? "carrot_sunflower1_anim" : "carrot_sunflower_anim";
          carrot_sunflower.play(animKey, true);
      }
  });
}

  private setDefaultStates() {
    this.lightedItems = Array(MAX_LAMPS_IN_MAP + 1).fill(null);
    this.polygons = [];
    this.polygonShapes = [];
    this.playerPosition = { x: 0, y: 0 };
    this.visibilityPolygon = new VisibilityPolygon();
    this.lampSpawnTime = LAMP_SPAWN_BASE_INTERVAL;
    this.numLampsInMap = LAMPS_CONFIGURATION.length;
    this.deathDate = null;
  }

  private reset() {
    this.currentPlayer?.setPosition(
      SPAWNS()[this.sceneId].default.x,
      SPAWNS()[this.sceneId].default.y,
    );
    this.resetAllLamps();
    this.lightedItems = Array(MAX_LAMPS_IN_MAP + 1).fill(null);
    this.currentPlayer && (this.lightedItems[0] = this.currentPlayer);
    this.createAllLamps();
    this.lampSpawnTime = LAMP_SPAWN_BASE_INTERVAL;
    this.deathDate = null;
  }

  private initShaders() {
    if (!this.currentPlayer) return;

    (
      this.renderer as Phaser.Renderer.WebGL.WebGLRenderer
    ).pipelines?.addPostPipeline("DarkModePipeline", DarknessPipeline);
    this.cameras.main.setPostPipeline(DarknessPipeline);

    const darknessPipeline = this.cameras.main.getPostPipeline(
      "DarknessPipeline",
    ) as DarknessPipeline;

    // Set initial values in the shader
    // First position: current player
    const playerLightRadius = [MIN_PLAYER_LIGHT_RADIUS];
    const lampsLightRadius = new Array(MAX_LAMPS_IN_MAP).fill(
      INITIAL_LAMPS_LIGHT_RADIUS,
    );
    darknessPipeline.lightRadius = [...playerLightRadius, ...lampsLightRadius];
  }

  private loadBumpkinAnimations() {
    if (!this.currentPlayer) return;

    const lamps = this.portalService?.state?.context?.lamps;

    const itemBumpkinX = this.currentPlayer.directionFacing === "left" ? -1 : 1;

    const animation = this.isMoving
      ? lamps
        ? "carry"
        : "walk"
      : lamps
        ? "carryIdle"
        : "idle";

    this.currentPlayer.lamp?.setX(itemBumpkinX);
    this.currentPlayer[animation]();
    this.currentPlayer.lampVisibility(!!lamps);
  }

  private setLampSpawnTime() {
    const score = Math.floor(this.portalService?.state.context.score || 0);
    if (score >= this.lampSpawnTime) {
      const increase = Math.floor(
        LAMP_SPAWN_BASE_INTERVAL *
          (1 +
            LAMP_SPAWN_INCREASE_PERCENTAGE *
              Math.floor(score / LAMP_SPAWN_BASE_INTERVAL)),
      );
      this.lampSpawnTime += increase;

      this.numLampsInMap = this.lightedItems.filter((item, i) => {
        if (i === 0) return false;
        return item !== null && item?.x !== -9999 && item?.y !== -9999;
      }).length;

      if (this.numLampsInMap < MAX_LAMPS_IN_MAP) {
        // console.log("Goal: ", this.lampSpawnTime, "Increase: ", increase);
        // console.log("Lamps in the map", this.numLampsInMap);
        this.createLamp();
      }
    }
  }

  private getNormalizedCoords(x: number, y: number) {
    const xPos =
      ((x - this.cameras.main.worldView.x) / this.cameras.main.width) *
      this.cameras.main.zoom;
    const yPos =
      ((y - this.cameras.main.worldView.y) / this.cameras.main.height) *
      this.cameras.main.zoom;

    return [xPos, yPos];
  }

  private adjustShaders = () => {
    const darknessPipeline = this.cameras.main.getPostPipeline(
      "DarknessPipeline",
    ) as DarknessPipeline;

    this.lightedItems.forEach((light, i) => {
      const coordinates = light
        ? { x: light.x, y: light.y }
        : { x: -9999, y: -9999 };
      const [x, y] = this.getNormalizedCoords(coordinates.x, coordinates.y);
      darknessPipeline.lightSources[i] = { x: x, y: y };
    });
  };

  private resetAllLamps() {
    this.lightedItems.forEach((item, i) => {
      if (i > 0) {
        (item as LampContainer)?.destroyLamp();
      }
    });
  }

  private createLamp() {
    let x: number, y: number, isInsidePolygon;
    do {
      x = Phaser.Math.Between(0, this.map.width * this.map.tileWidth);
      y = Phaser.Math.Between(0, this.map.width * this.map.tileWidth);
      isInsidePolygon = this.polygonShapes.some((shape) =>
        Phaser.Geom.Polygon.Contains(shape, x, y),
      );
    } while (isInsidePolygon);

    const index = this.lightedItems.findIndex(
      (item) => item === null || (item?.x === -9999 && item?.y === -9999),
    );

    const lamp = new LampContainer({
      x: x,
      y: y,
      id: index,
      scene: this as BaseScene,
      player: this.currentPlayer,
      visibilityPolygon: this.visibilityPolygon,
      polygonWalls: this.polygons,
    });

    this.lightedItems[index] = lamp;

    // console.log("x: ", x, "y: ", y);
    // console.log(this.lightedItems);
  }

  private createAllLamps() {
    if (!this.currentPlayer) return;

    const lamps = LAMPS_CONFIGURATION.map(
      (lamp, i) =>
        new LampContainer({
          x: lamp.x,
          y: lamp.y,
          id: i,
          scene: this as BaseScene,
          player: this.currentPlayer,
          visibilityPolygon: this.visibilityPolygon,
          polygonWalls: this.polygons,
        }),
    );

    const position = 1;
    if (lamps.length + position <= this.lightedItems.length) {
      this.lightedItems.splice(position, lamps.length, ...lamps);
    }
  }

  private createWalls() {
    if (!this.currentPlayer) return;

    // Create walls with polygon points collision
    const collisions = mapJson.layers.find(
      (layer) => layer.name === "Collision",
    )?.objects;

    collisions?.forEach((collision) => {
      if (collision?.polygon) {
        const polygon: [number, number][] = [];
        const polygonPoints: Phaser.Geom.Point[] = [];
        collision.polygon.forEach((position) => {
          polygon.push([collision.x + position.x, collision.y + position.y]);
          polygonPoints.push(
            new Phaser.Geom.Point(
              collision.x + position.x,
              collision.y + position.y,
            ),
          );
        });
        this.polygons.push(polygon);
        this.polygonShapes.push(new Phaser.Geom.Polygon(polygonPoints));
      }
    });

    // walls around game perimeter
    this.polygons.push([
      [-1, -1],
      [this.map.width * this.map.tileWidth + 1, -1],
      [
        this.map.width * this.map.tileWidth + 1,
        this.map.height * this.map.tileHeight + 1,
      ],
      [-1, this.map.height * this.map.tileHeight + 1],
    ]);
  }

  private createMask() {
    const background = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000,
    );
    background.setDepth(0);

    this.lightGraphics = this.add.graphics();

    this.mask = this.lightGraphics.createGeometryMask();

    // Set up the Z layers to draw in correct order
    this.map.layers.forEach((layerData) => {
      const layer = this.map.createLayer(
        layerData.name,
        [this.map.getTileset("Sunnyside V3") as Phaser.Tilemaps.Tileset],
        0,
        0,
      );
      if (layerData.name === "Ground") {
        layer?.setMask(this.mask as Phaser.Display.Masks.GeometryMask);
      }

      this.layers[layerData.name] = layer as Phaser.Tilemaps.TilemapLayer;
    });
  }

  private renderAllLights() {
    if (!this.lightGraphics) return;

    this.lightGraphics.clear();
    this.lightedItems.forEach((item) => {
      if (!this.currentPlayer) return;
      if (!item) return;

      const normalizedX =
        ((item.x - this.cameras.main.worldView.x) / this.cameras.main.width) *
        this.cameras.main.zoom;
      const normalizedY =
        ((item.y - this.cameras.main.worldView.y) / this.cameras.main.height) *
        this.cameras.main.zoom;

      // Position deleted x: -9999 and y: -9999
      if (
        item.x !== -9999 &&
        item.y !== -9999 &&
        normalizedX >= -0.5 &&
        normalizedX <= 1.5 &&
        normalizedY >= -0.5 &&
        normalizedY <= 1.5
      ) {
        this.renderLight(item);
      }
    });
  }

  private renderLight(item: Phaser.GameObjects.Container) {
    if (!this.lightGraphics) return;

    const visibility =
      item instanceof LampContainer
        ? item.polygonLight
        : createLightPolygon(
            item.x,
            item.y,
            this.visibilityPolygon,
            this.polygons,
          );

    // begin a drawing path
    this.lightGraphics.beginPath();

    if (visibility) {
      // move the graphic pen to first vertex of light polygon
      this.lightGraphics.moveTo(visibility[0][0], visibility[0][1]);

      // loop through all light polygon vertices
      for (let i = 1; i <= visibility.length; i++) {
        // draw a line to i-th light polygon vertex
        this.lightGraphics.lineTo(
          visibility[i % visibility.length][0],
          visibility[i % visibility.length][1],
        );
      }
    }

    // close, stroke and fill light polygon
    this.lightGraphics.closePath();
    this.lightGraphics.fillPath();
    this.lightGraphics.strokePath();
  }

  private endGame() {
    this.isCameraFading = true;
    this.currentPlayer?.dead();
    if (!this.deathDate) {
      this.deathDate = new Date(new Date().getTime() + 1200);
    } else if (new Date().getTime() >= this.deathDate.getTime()) {
      this.portalService?.send("GAME_OVER");
    }
  }
}
