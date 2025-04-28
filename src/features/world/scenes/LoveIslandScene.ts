import loveIslandJSON from "assets/map/love_island.json";
import seasonal_tileset from "assets/map/seasonal_tileset.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { translate } from "lib/i18n/translate";
import { interactableModalManager } from "../ui/InteractableModals";

const BUMPKINS: NPCBumpkin[] = [];

export class LoveIslandScene extends BaseScene {
  sceneId: SceneId = "love_island";

  spawn: Coordinates = {
    x: 55,
    y: 157,
  };
  constructor() {
    super({
      name: "love_island",
      map: {
        json: loveIslandJSON,
        imageKey: "seasonal-tileset",
        defaultTilesetConfig: seasonal_tileset,
      },
    });
  }

  preload() {
    super.preload();
    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "love_island",
    });

    super.create();

    this.initialiseNPCs(BUMPKINS);

    const shop = this.add.sprite(240, 140, "shop_icon");

    // On click open shop
    shop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(shop, 75)) {
        interactableModalManager.open("floating_island_shop");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });
  }
}
