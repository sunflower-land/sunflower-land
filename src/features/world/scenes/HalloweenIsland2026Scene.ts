import mapJSON from "assets/map/halloween_island_2026.json";
import type { SceneId } from "../mmoMachine";
import { BaseScene, type NPCBumpkin } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { Label } from "../containers/Label";

const BUMPKINS: NPCBumpkin[] = [
  { npc: "Vampire Jim", x: 250, y: 1410 },
  { npc: "Skelly Joe", x: 400, y: 800 },
];

export class HalloweenIsland2026Scene extends BaseScene {
  sceneId: SceneId = "halloween_island_2026";

  private decorationsHidden = false;
  private decorationsTween?: Phaser.Tweens.Tween;
  private tileHasPixelsCache = new Map<number, boolean>();
  private tilesetContext?: CanvasRenderingContext2D;
  private fadingObjects: Phaser.GameObjects.GameObject[] = [];

  update(): void {
    super.update();
    this.updateDecorationsVisibility();
  }

  private tileHasPixels(tileIndex: number): boolean {
    const cached = this.tileHasPixelsCache.get(tileIndex);
    if (cached !== undefined) return cached;

    if (!this.tilesetContext) {
      const image = this.textures
        .get("halloween_island_2026_tileset")
        .getSourceImage() as HTMLImageElement;

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return true;
      context.drawImage(image, 0, 0);
      this.tilesetContext = context;
    }

    const TILE = 16;
    const MARGIN = 1;
    const SPACING = 2;
    const COLUMNS = 130;

    const id = tileIndex - 1;
    const x = MARGIN + (id % COLUMNS) * (TILE + SPACING);
    const y = MARGIN + Math.floor(id / COLUMNS) * (TILE + SPACING);

    const pixels = this.tilesetContext.getImageData(x, y, TILE, TILE).data;

    let hasPixels = false;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) {
        hasPixels = true;
        break;
      }
    }

    this.tileHasPixelsCache.set(tileIndex, hasPixels);
    return hasPixels;
  }

  private isPlayerNearLayer(
    layer: Phaser.Tilemaps.TilemapLayer,
    distanceInTiles: number,
  ) {
    const player = this.currentPlayer;
    if (!player) return false;

    const tileX = Math.floor(player.x / this.map.tileWidth);
    const tileY = Math.floor(player.y / this.map.tileHeight);

    for (let dx = -distanceInTiles; dx <= distanceInTiles; dx++) {
      for (let dy = -distanceInTiles; dy <= distanceInTiles; dy++) {
        const tile = layer.getTileAt(tileX + dx, tileY + dy);
        if (tile && tile.index > 0 && this.tileHasPixels(tile.index)) {
          return true;
        }
      }
    }

    return false;
  }

  private updateDecorationsVisibility() {
    const layer = this.layers["Decorations Layer 1"];
    if (!layer || !this.currentPlayer) return;

    const shouldHide = this.isPlayerNearLayer(layer, 1);

    if (shouldHide === this.decorationsHidden) return;
    this.decorationsHidden = shouldHide;

    this.decorationsTween?.stop();
    this.decorationsTween = this.tweens.add({
      targets: [layer, ...this.fadingObjects],
      alpha: shouldHide ? 0 : 1,
      duration: 300, // ms
    });
  }

  constructor() {
    super({
      name: "halloween_island_2026",
      map: {
        json: mapJSON,
        imageKey: "halloween_island_2026_tileset",
        defaultTilesetConfig: [
          {
            columns: 130,
            firstgid: 1,
            image: "halloween_island_2026_tileset.png",
            imageheight: 1728,
            imagewidth: 2340,
            margin: 1,
            name: "Sunnyside V3",
            spacing: 2,
            tilecount: 12480,
            tileheight: 16,
            tilewidth: 16,
          },
        ],
      },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet(
      "event_shop",
      `world/halloween_island_2026_assets/shop.png`,
      {
        frameWidth: 80,
        frameHeight: 80,
      },
    );

    this.load.spritesheet(
      "portal_entrance",
      `world/halloween_island_2026_assets/portal_entrance.png`,
      {
        frameWidth: 72,
        frameHeight: 48,
      },
    );

    this.load.spritesheet(
      "board",
      `world/halloween_island_2026_assets/event_info_board.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    this.load.image("board_icon", "world/question_disc.png");

    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({ key: "halloween_island_2026" });
    super.create();

    this.initialiseNPCs(BUMPKINS);

    const portal_entrance = this.add.sprite(445, 265, "portal_entrance");
    this.anims.create({
      key: "portal_entrance_animation",
      frames: this.anims.generateFrameNumbers("portal_entrance", {
        start: 0,
        end: 40,
      }),
      repeat: -1,
      frameRate: 7,
    });
    portal_entrance.play("portal_entrance_animation", true);
    this.physics.world.enable(portal_entrance);
    this.colliders?.add(portal_entrance);
    (portal_entrance.body as Phaser.Physics.Arcade.Body)
      .setSize(72, 48)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    portal_entrance
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(portal_entrance, 100)) {
          interactableModalManager.open("halloween_2026");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const portalLabel = new Label(this, "PLAY");
    this.add.existing(portalLabel);
    portalLabel.setPosition(444, 240);
    portalLabel.setDepth(10000);

    this.fadingObjects = [];
    const directionLabel = new Label(this, "PORTAL INSIDE...");
    this.add.existing(directionLabel);
    directionLabel.setPosition(438, 370);
    directionLabel.setDepth(1000000);
    this.fadingObjects.push(directionLabel);

    const event_shop = this.add.sprite(360, 480, "event_shop");
    this.anims.create({
      key: "event_shop_animation",
      frames: this.anims.generateFrameNumbers("event_shop", {
        start: 0,
        end: 7,
      }),
      repeat: -1,
      frameRate: 7,
    });
    event_shop.play("event_shop_animation", true);
    this.physics.world.enable(event_shop);
    this.colliders?.add(event_shop);
    (event_shop.body as Phaser.Physics.Arcade.Body)
      .setSize(80, 80)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    event_shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(event_shop, 120)) {
        interactableModalManager.open("event_store");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
    const shopLabel = new Label(this, "SHOP");
    this.add.existing(shopLabel);
    shopLabel.setPosition(360, 430);
    shopLabel.setDepth(10000);

    const noticeboard = this.add.sprite(550, 800, "board");
    this.anims.create({
      key: "board",
      frames: this.anims.generateFrameNumbers("board", {
        start: 0,
        end: 7,
      }),
      repeat: -1,
      frameRate: 10,
    });
    noticeboard.play("board", true);
    this.physics.world.enable(noticeboard);
    this.colliders?.add(noticeboard);
    (noticeboard.body as Phaser.Physics.Arcade.Body)
      .setSize(32, 32)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.add.image(550, 770, "board_icon").setDepth(1000000);

    noticeboard.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(noticeboard, 75)) {
        interactableModalManager.open("event_noticeboard");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }
}
