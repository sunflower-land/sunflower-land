import mapJSON from "assets/map/retreat.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { interactableModalManager } from "../ui/InteractableModals";
import {
  getCachedMarketPrices,
  setCachedMarketPrices,
} from "../ui/market/lib/marketCache";
import { getMarketPrices } from "features/game/actions/getMarketPrices";
import { translate } from "lib/i18n/translate";

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "goblet",
    x: 295,
    y: 62,
    direction: "right",
  },
  {
    npc: "guria",
    x: 392,
    y: 230,
    direction: "right",
  },
  {
    npc: "grubnuk",
    x: 435,
    y: 220,
    direction: "left",
  },
  {
    npc: "garbo",
    x: 72,
    y: 70,
    direction: "right",
  },
  {
    npc: "gordo",
    x: 574,
    y: 277,
    direction: "left",
  },
];

export class RetreatScene extends BaseScene {
  sceneId: SceneId = "retreat";

  constructor() {
    super({
      name: "retreat",
      map: { json: mapJSON },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.image("wishing_well", `world/goblin_wishing_well.png`);
    this.load.image("balloon", `world/hot_air_balloon.png`);
    this.load.image("bank", `world/goblin_bank.png`);
    this.load.image("exchange", `world/goblin_exchange.png`);
    this.load.spritesheet("blacksmith", `world/goblin_blacksmith.png`, {
      frameWidth: 121,
      frameHeight: 86,
    });
    this.load.spritesheet("greedclaw", `world/greedclaw.webp`, {
      frameWidth: 20,
      frameHeight: 19,
    });
    this.load.spritesheet("grabnab", `world/grabnab.webp`, {
      frameWidth: 20,
      frameHeight: 21,
    });

    this.load.spritesheet("raffle", "world/raffle.webp", {
      frameWidth: 33,
      frameHeight: 28,
    });
    this.load.spritesheet("big_goblin", "world/big_goblin.png", {
      frameWidth: 27,
      frameHeight: 35,
    });
    this.load.image("raffle_disc", "world/raffle_disc.png");
    this.load.image("exchange_disc", "world/exchange_disc.png");
    this.load.image("withdraw_disc", "world/withdraw_disc.png");
    this.load.spritesheet("garbage_collector", "world/garbage_collector.png", {
      frameWidth: 58,
      frameHeight: 49,
    });
    this.load.spritesheet("garbage_smoke", "world/smoke1.png", {
      frameWidth: 10,
      frameHeight: 30,
    });
    this.load.spritesheet("fire", "world/fire_sheet.png", {
      frameWidth: 8,
      frameHeight: 12,
    });
  }

  create() {
    this.map = this.make.tilemap({
      key: "retreat",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const bigGoblin = this.add.sprite(550, 231, "big_goblin");
    this.anims.create({
      key: "big_goblin_animation",
      frames: this.anims.generateFrameNumbers("big_goblin", {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 6,
    });
    bigGoblin.play("big_goblin_animation", true);

    const exchange = this.add.sprite(114, 215, "exchange");
    exchange.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(exchange, 75)) {
        interactableModalManager.open("goblin_market");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const grabnab = this.add.sprite(90, 235, "grabnab");
    this.anims.create({
      key: "grabnab_animation",
      frames: this.anims.generateFrameNumbers("grabnab", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    grabnab.play("grabnab_animation", true);

    this.add.sprite(422, 84, "withdraw_disc").setDepth(1000000000);

    const greedclaw = this.add.sprite(422, 100, "greedclaw");
    this.anims.create({
      key: "greedclaw_animation",
      frames: this.anims.generateFrameNumbers("greedclaw", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    greedclaw.play("greedclaw_animation", true);

    const bank = this.add.sprite(422, 94, "bank");
    bank.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(bank, 75)) {
        interactableModalManager.open("bank");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.add.sprite(532, 51, "raffle_disc").setDepth(1000000000);

    this.add.sprite(147, 200, "exchange_disc").setDepth(1000000000);

    const wishingWell = this.add.sprite(532, 71, "wishing_well");
    wishingWell.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(wishingWell, 75)) {
        interactableModalManager.open("wishingWell");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    this.add.sprite(513, 404, "balloon");

    const blacksmith = this.add.sprite(193, 77, "blacksmith");
    this.anims.create({
      key: "blacksmith_animation",
      frames: this.anims.generateFrameNumbers("blacksmith", {
        start: 0,
        end: 11,
      }),
      repeat: -1,
      frameRate: 10,
    });
    blacksmith.play("blacksmith_animation", true);

    const fire = this.add.sprite(415, 220, "fire");
    this.anims.create({
      key: "fire_anim",
      frames: this.anims.generateFrameNumbers("fire", {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 10,
    });
    fire.play("fire_anim", true);

    const garbageCollector = this.add.sprite(72, 70, "garbage_collector");
    this.anims.create({
      key: "garbage_collector_anim",
      frames: this.anims.generateFrameNumbers("garbage_collector", {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 10,
    });
    garbageCollector.play("garbage_collector_anim", true);
    // ON click
    garbageCollector
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => {
        if (this.checkDistanceToSprite(garbageCollector, 75)) {
          interactableModalManager.open("garbage_collector");
        } else {
          this.currentPlayer?.speak(translate("base.iam.far.away"));
        }
      });

    const smoke = this.add.sprite(72, 46, "garbage_smoke");
    this.anims.create({
      key: "garbage_smoke_anim",
      frames: this.anims.generateFrameNumbers("garbage_smoke", {
        start: 0,
        end: 29,
      }),
      repeat: -1,
      frameRate: 8,
    });
    smoke.play("garbage_smoke_anim", true);

    this.add.sprite(256, 181, "raffle_disc").setDepth(1000000000);

    const raffle = this.add.sprite(256, 205, "raffle").setDepth(1000000000000);
    this.anims.create({
      key: "raffle_animation",
      frames: this.anims.generateFrameNumbers("raffle", {
        start: 0,
        end: 7,
      }),
      repeat: -1,
      frameRate: 4,
    });
    raffle.play("raffle_animation", true);

    raffle.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(raffle, 75)) {
        interactableModalManager.open("raffle");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const twentyFourHours = 1000 * 60 * 60 * 24;
    const marketPrices = getCachedMarketPrices();
    if (!marketPrices || marketPrices.cachedAt < Date.now() - twentyFourHours) {
      getMarketPrices(
        this.gameService.state.context.farmId,
        this.gameService.state.context.transactionId as string,
        this.authService.state.context.user.rawToken as string,
      ).then(setCachedMarketPrices);
    }
  }
}
