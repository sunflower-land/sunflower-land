import mapJson from "assets/map/plaza.json";
import auctionJson from "assets/map/auction.json";
import clothesShopJson from "assets/map/clothe_shop.json";
import decorationShopJSON from "assets/map/decorations.json";
import windmillFloorJSON from "assets/map/windmill_floor.json";
import igorHomeJSON from "assets/map/blacksmith_home.json";
import bertHomeJSON from "assets/map/bert_home.json";
import timmyHomeJSON from "assets/map/timmy_home.json";
import bettyHomeJSON from "assets/map/betty_home.json";
import woodlandsJSON from "assets/map/woodlands.json";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";

export abstract class Preloader extends Phaser.Scene {
  preload() {
    console.log("PRELOAD INITIAL");
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);
    this.load.tilemapTiledJSON("clothes-shop", clothesShopJson);
    this.load.tilemapTiledJSON("decorations-shop", decorationShopJSON);
    this.load.tilemapTiledJSON("windmill-floor", windmillFloorJSON);
    this.load.tilemapTiledJSON("igor-home", igorHomeJSON);
    this.load.tilemapTiledJSON("bert-home", bertHomeJSON);
    this.load.tilemapTiledJSON("timmy-home", timmyHomeJSON);
    this.load.tilemapTiledJSON("betty-home", bettyHomeJSON);
    this.load.tilemapTiledJSON("woodlands", woodlandsJSON);

    // Phaser assets must be served from an URL
    this.load.image("tileset", `${CONFIG.PROTECTED_IMAGE_URL}/world/map.png`);
    this.load.image("speech_bubble", "world/speech_bubble.png");
    this.load.image("label", "world/label.png");
    this.load.image("brown_label", "world/brown_label.png");
    this.load.image("hammer", SUNNYSIDE.icons.hammer);
    this.load.image("disc", SUNNYSIDE.icons.disc);
    this.load.image("shadow", "world/shadow.png");
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
    this.load.bitmapFont(
      "Small 5x3",
      "world/small_3x5.png",
      "world/small_3x5.xml"
    );

    this.load.once("complete", () => {
      this.scene.start("plaza");
    });
  }
}
