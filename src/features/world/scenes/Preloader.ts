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
import marcusHomeJSON from "assets/map/marcus_home.json";
import dawnBreakerJSON from "assets/map/dawn_breaker.json";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { SOUNDS } from "assets/sound-effects/soundEffects";

export abstract class Preloader extends Phaser.Scene {
  preload() {
    this.load.tilemapTiledJSON("main-map", mapJson);
    this.load.tilemapTiledJSON("auction-map", auctionJson);
    this.load.tilemapTiledJSON("dawn-breaker", dawnBreakerJSON);
    this.load.tilemapTiledJSON("clothes-shop", clothesShopJson);
    this.load.tilemapTiledJSON("decorations-shop", decorationShopJSON);
    this.load.tilemapTiledJSON("windmill-floor", windmillFloorJSON);
    this.load.tilemapTiledJSON("igor-home", igorHomeJSON);
    this.load.tilemapTiledJSON("bert-home", bertHomeJSON);
    this.load.tilemapTiledJSON("timmy-home", timmyHomeJSON);
    this.load.tilemapTiledJSON("betty-home", bettyHomeJSON);
    this.load.tilemapTiledJSON("marcus-home", marcusHomeJSON);
    this.load.tilemapTiledJSON("woodlands", woodlandsJSON);

    // Load Sound Effects
    this.load.audio("walk", SOUNDS.footsteps.dirt);
    this.load.audio("fire", SOUNDS.loops.fire);
    this.load.audio("nature_1", SOUNDS.loops.nature_1);
    this.load.audio("nature_2", SOUNDS.loops.nature_2);
    this.load.audio("royal_farms", SOUNDS.songs.royal_farms);

    // Phaser assets must be served from an URL
    this.load.image(
      "tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/map-extruded.png`
    );
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
    this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");

    this.load.once("complete", () => {
      this.scene.start(this.registry.get("initialScene"));
    });
  }
}
