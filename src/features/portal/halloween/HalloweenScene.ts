import mapJson from "assets/map/halloween.json";
import tilesetConfig from "assets/map/halloween-tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, NPCBumpkin } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/halloweenMachine";
import { DarknessPipeline } from "./shaders/DarknessShader";
import { VisibilityPolygon } from "./lib/visibilityPolygon";
import {
  INITIAL_LAMPS_LIGHT_RADIUS,
  MIN_PLAYER_LIGHT_RADIUS,
  TOTAL_LAMPS,
  LAMPS_CONFIGURATION,
} from "./HalloweenConstants";
import { LampContainer } from "./containers/LampContainer";

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
  private playerPosition!: Coordinates;
  private lightGraphics?: Phaser.GameObjects.Graphics;
  private visibilityPolygon!: VisibilityPolygon;

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
  }

  async create() {
    this.map = this.make.tilemap({
      key: "halloween",
    });

    super.create();

    this.initializeShaders();

    // Important to first save the player and then the lamps
    this.currentPlayer && this.lightedItems.push(this.currentPlayer);
    this.createMask();
    this.createLamps();
    this.createWalls();

    this.initialiseNPCs(NPCS);
  }

  update() {
    if (!this.currentPlayer) return;

    this.updateShaders();

    const { x: currentX = 0, y: currentY = 0 } = this.currentPlayer ?? {};

    if (
      this.playerPosition.x !== currentX ||
      this.playerPosition.y !== currentY
    ) {
      this.renderAllLights();
      this.playerPosition = { x: currentX, y: currentY };
    }

    this.loadBumpkinAnimations();

    this.portalService?.send("GAIN_POINTS");

    this.isGameReady && this.portalService?.send("START");

    super.update();
  }

  private setDefaultStates() {
    this.lightedItems = [];
    this.polygons = [];
    this.playerPosition = { x: 0, y: 0 };
    this.visibilityPolygon = new VisibilityPolygon();
  }

  private initializeShaders() {
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
    const lampsLightRadius = new Array(TOTAL_LAMPS).fill(
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

  private getNormalizedCoords(x: number, y: number) {
    const xPos =
      ((x - this.cameras.main.worldView.x) / this.cameras.main.width) *
      this.cameras.main.zoom;
    const yPos =
      ((y - this.cameras.main.worldView.y) / this.cameras.main.height) *
      this.cameras.main.zoom;

    return [xPos, yPos];
  }

  private updateShaders = () => {
    const darknessPipeline = this.cameras.main.getPostPipeline(
      "DarknessPipeline",
    ) as DarknessPipeline;

    this.lightedItems.forEach((light, i) => {
      const [x, y] = this.getNormalizedCoords(light.x, light.y);
      darknessPipeline.lightSources[i] = { x: x, y: y };
    });
  };

  private createLamps() {
    if (!this.currentPlayer) return;

    const lamps = LAMPS_CONFIGURATION.map(
      (lamp) =>
        new LampContainer({
          x: lamp.x,
          y: lamp.y,
          scene: this,
          player: this.currentPlayer,
          portalService: this.portalService,
        }),
    );

    this.lightedItems = [...this.lightedItems, ...lamps];
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
        collision.polygon.forEach((position) => {
          polygon.push([collision.x + position.x, collision.y + position.y]);
        });
        this.polygons.push(polygon);
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
      layer?.setMask(this.mask as Phaser.Display.Masks.GeometryMask);

      this.layers[layerData.name] = layer as Phaser.Tilemaps.TilemapLayer;
    });
  }

  private renderAllLights() {
    if (!this.lightGraphics) return;

    this.lightGraphics.clear();
    this.lightedItems.forEach((item) => {
      // Position deleted x: -9999 and y: -9999
      if (item.x !== -9999 && item.y !== -9999) {
        this.renderLight(item);
      }
    });
  }

  private renderLight(item: Phaser.GameObjects.Container) {
    if (!this.lightGraphics) return;

    const visibility = this.createLightPolygon(item.x, item.y);

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

      // Make the walls visible
      for (let i = 0; i < this.polygons.length - 1; i++) {
        this.lightGraphics?.moveTo(
          this.polygons[i][0][0],
          this.polygons[i][0][1],
        );
        for (let j = 1; j < this.polygons[i].length; j++) {
          this.lightGraphics?.lineTo(
            this.polygons[i][j][0],
            this.polygons[i][j][1],
          );
        }
      }
    }

    // close, stroke and fill light polygon
    this.lightGraphics.closePath();
    this.lightGraphics.fillPath();
    this.lightGraphics.strokePath();
  }

  createLightPolygon(x: number, y: number) {
    let segments = this.visibilityPolygon.convertToSegments(this.polygons);
    segments = this.visibilityPolygon.breakIntersections(segments);
    const position = [x, y];
    if (
      this.visibilityPolygon.inPolygon(
        position,
        this.polygons[this.polygons.length - 1],
      )
    ) {
      return this.visibilityPolygon.compute(position, segments);
    }
    return null;
  }
}
