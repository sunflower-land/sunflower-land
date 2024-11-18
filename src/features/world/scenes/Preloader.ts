import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { SOUNDS } from "assets/sound-effects/soundEffects";
import { createErrorLogger } from "lib/errorLogger";

export abstract class Preloader extends Phaser.Scene {
  public get id() {
    return this.registry.get("id") as number;
  }

  private preloadAudio() {
    this.load.audio("dirt_footstep", SOUNDS.footsteps.dirt);
    this.load.audio("wood_footstep", SOUNDS.footsteps.wood);
    this.load.audio("sand_footstep", SOUNDS.footsteps.sand);
    this.load.audio("nature_1", SOUNDS.loops.nature_1);
    this.load.audio("boat", SOUNDS.loops.engine);
    this.load.audio("dig", SOUNDS.desert.dig);
    this.load.audio("drill", SOUNDS.desert.drill);
    this.load.audio("reveal", SOUNDS.desert.reveal);
  }

  private preloadTilesets() {
    this.load.image(
      "tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/map-extruded.png`,
    );

    this.load.image(
      "easter-tileset",
      `${CONFIG.PROTECTED_IMAGE_URL}/world/easter-map-extruded.png`,
    );
  }

  private preloadImages() {
    this.load.image("speech_bubble", "world/speech_bubble.png");
    this.load.image("alert", SUNNYSIDE.icons.expression_alerted);
    this.load.image("label", "world/label.png");
    this.load.image("brown_label", "world/brown_label.png");
    this.load.image("hammer", SUNNYSIDE.icons.hammer);
    this.load.image("disc", SUNNYSIDE.icons.disc);
    this.load.image("gift_icon", "world/gift.png");
    this.load.image("shadow", "world/shadow.png");
    this.load.image("skull", SUNNYSIDE.decorations.skull);
    this.load.image("heart", SUNNYSIDE.icons.heart);
    this.load.image("sad", SUNNYSIDE.icons.sad);
    this.load.image("happy", SUNNYSIDE.icons.happy);
  }

  private preloadSprites() {
    this.load.spritesheet("poof", "world/poof.png", {
      frameWidth: 20,
      frameHeight: 19,
    });
    this.load.spritesheet("sparkle", "world/sparkle.png", {
      frameWidth: 20,
      frameHeight: 19,
    });
    this.load.spritesheet("smoke", "world/equip_smoke_2.png", {
      frameWidth: 20,
      frameHeight: 19,
    });
    this.load.spritesheet("silhouette", "world/silhouette.webp", {
      frameWidth: 14,
      frameHeight: 18,
    });
  }

  private preloadFonts() {
    this.load.bitmapFont(
      "Teeny Tiny Pixls",
      "world/Teeny Tiny Pixls5.png",
      "world/Teeny Tiny Pixls5.xml",
    );
    this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");
  }

  preload() {
    const errorLogger = createErrorLogger(
      "phaser_preloader_scene",
      Number(this.id),
    );

    this.load.on(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        errorLogger(
          `File load error ${JSON.stringify({ name: file.key, url: file.url })}`,
        );
      },
    );

    try {
      this.preloadAudio();
      this.preloadTilesets();
      this.preloadImages();
      this.preloadSprites();
      this.preloadFonts();

      this.load.once("complete", () => {
        this.scene.start(this.registry.get("initialScene"));
      });
    } catch (error) {
      errorLogger(error);
    }
  }
}
