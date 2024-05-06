import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { FishermanContainer } from "../containers/FishermanContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "finn",
    x: 94,
    y: 518,
  },
  {
    npc: "finley",
    x: 122,
    y: 390,
    direction: "left",
  },
  {
    npc: "tango",
    x: 416,
    y: 321,
  },
  {
    npc: "goldtooth",
    x: 304,
    y: 255,
  },
  {
    npc: "corale",
    x: 135,
    y: 670,
  },
  {
    x: 338,
    y: 407,
    npc: "miranda",
  },
];

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";

  krakenHunger: InventoryItemName | undefined;
  krakenHungerSprite: Phaser.GameObjects.Sprite | undefined;
  heartSprite: Phaser.GameObjects.Sprite | undefined;

  constructor() {
    super({ name: "beach", map: { json: mapJSON } });
  }

  preload() {
    super.preload();

    this.load.image("heart", SUNNYSIDE.icons.heart);

    this.load.image("wooden_chest", "world/wooden_chest.png");
    this.load.image("locked_disc", "world/locked_disc.png");
    this.load.image("rare_key_disc", "world/rare_key_disc.png");

    this.load.spritesheet("beach_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.spritesheet("beach_bud_2", "world/beach_bud_2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("beach_bud_3", "world/beach_bud_3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("kraken", "world/kraken_sheet.png", {
      frameWidth: 41,
      frameHeight: 48,
    });

    this.load.spritesheet("bird", SUNNYSIDE.animals.bird, {
      frameWidth: 16,
      frameHeight: 17,
    });

    this.load.spritesheet("blinking", SUNNYSIDE.vfx.blinking, {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("fisher", SUNNYSIDE.npcs.fishing_sheet, {
      frameWidth: 58,
      frameHeight: 50,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const fisher = new FishermanContainer({
      x: 322,
      y: 711,
      scene: this,
    });
    fisher.setDepth(100000000);
    this.physics.world.enable(fisher);
    this.colliders?.add(fisher);
    this.triggerColliders?.add(fisher);
    (fisher.body as Phaser.Physics.Arcade.Body)
      .setSize(16, 20)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    const turtle = this.add.sprite(328, 515, "beach_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("beach_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle.play("turtle_bud_anim", true);

    const beachBud2 = this.add.sprite(268, 317, "beach_bud_2");
    // turtle.setScale(-1, 1);
    this.anims.create({
      key: "beach_bud_2_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud2.play("beach_bud_2_anim", true);

    const beachBud3 = this.add.sprite(420, 572, "beach_bud_3");
    this.anims.create({
      key: "beach_bud_3_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud3.play("beach_bud_3_anim", true);

    const blinking = this.add.sprite(319, 36, "blinking");
    this.anims.create({
      key: "blinking_anim",
      frames: this.anims.generateFrameNumbers("blinking", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 5,
    });
    blinking.play("blinking_anim", true);

    const bird = this.add.sprite(318, 460, "bird");
    bird.setDepth(1000000000);
    this.anims.create({
      key: "bird_anim",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 5,
    });
    bird.play("bird_anim", true);

    if (this.gameState.inventory["Rare Key"]) {
      this.add.sprite(320, 580, "rare_key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(320, 580, "locked_disc").setDepth(1000000000);
    }

    const chest = this.add.sprite(320, 600, "wooden_chest");
    chest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(chest, 75)) {
        interactableModalManager.open("rare_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }

  public loadKrakenHunger = (hunger: InventoryItemName) => {
    if (!hunger) {
      this.heartSprite?.destroy();
      this.krakenHungerSprite?.destroy();
    }

    if (this.krakenHunger === hunger) {
      return;
    }

    if (!this.heartSprite) {
      this.heartSprite = this.add.sprite(350, 740, "heart");
    }

    this.krakenHunger = hunger;

    if (this.krakenHungerSprite) {
      this.krakenHungerSprite.destroy();
      this.krakenHungerSprite = undefined;
    }

    const image = ITEM_DETAILS[hunger].image;

    let loader;

    const key = `${hunger}_kraken_hunger`;

    if (this.textures.exists(key)) {
      this.krakenHungerSprite = this.add.sprite(338, 740, key);
      return;
    }

    if (image.startsWith("data:")) {
      this.textures.addBase64(key, image);

      this.textures.once("addtexture", () => {
        // Create the sprite once the texture is loaded
        this.krakenHungerSprite = this.add.sprite(338, 740, key);
      });
    } else {
      loader = this.load.image(key, image);

      loader.once(Phaser.Loader.Events.COMPLETE, () => {
        // This callback will be executed only once when "kraken_hunger" is loaded
        this.krakenHungerSprite = this.add.sprite(338, 740, key);
      });

      this.load.start();
    }
  };
}

// PubSub.ts

type Callback = (...args: any[]) => void;

class BeachPubSub {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  publish(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  unsubscribe(event: string, callback: Callback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export const beachEvents = new BeachPubSub();
