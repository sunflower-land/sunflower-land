import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { SOUNDS } from "assets/sound-effects/soundEffects";
import { createErrorLogger } from "lib/errorLogger";
import { BaseScene } from "./BaseScene";
import { COMMUNITY_ISLANDS } from "../ui/community/CommunityIslands";
import { communityModalManager } from "../ui/CommunityModalManager";
import { communityToastManager } from "../ui/CommunityToastManager";
import { Room } from "colyseus.js";
import { PlazaRoomState } from "../types/Room";
import { MachineInterpreter } from "features/game/lib/gameMachine";

export async function getgit(owner: string, repo: string, path: string) {
  // A function to fetch files from github using the api

  const data = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  )
    .then((d) => d.json())
    .then((d) =>
      fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${d.sha}`)
    )
    .then((d) => d.json())
    .then((d) => JSON.parse(atob(d.content)));

  return data;
}

export const COMMUNITY_TEST_ISLAND = "local";

export abstract class CommunityScene extends Phaser.Scene {
  public get room() {
    return this.registry.get("room") as Room<PlazaRoomState>;
  }

  public get gameService() {
    return this.registry.get("gameService") as MachineInterpreter;
  }
  preload() {
    const errorLogger = createErrorLogger(
      "phaser_preloader_scene",
      Number(this.gameService.state.context.farmId)
    );

    this.load.on(
      Phaser.Loader.Events.FILE_LOAD_ERROR,
      (file: Phaser.Loader.File) => {
        errorLogger(
          `File load error ${JSON.stringify({ name: file.key, url: file.url })}`
        );
      }
    );

    try {
      // Expose API/SDK for usage
      (window as any).BaseScene = BaseScene;
      (window as any).openModal = communityModalManager.open;
      (window as any).closeModal = communityModalManager.close;
      (window as any).createToast = communityToastManager.toast;

      const sceneName = this.registry.get("initialScene");
      let island = COMMUNITY_ISLANDS.find((island) => island.id === sceneName);

      if (CONFIG.NETWORK === "amoy" && sceneName === COMMUNITY_TEST_ISLAND) {
        island = {
          id: "local",
          name: "Test Island",
          url: localStorage.getItem("community-tools-url") as string,
          icon: "",
          project: "",
        };
      }

      this.load.sceneFile("ExternalScene", `${island?.url}/Scene.js`);
      this.load.tilemapTiledJSON(
        island?.id as string,
        `${island?.url}/map.json`
      );

      // Load Sound Effects
      this.load.audio("dirt_footstep", SOUNDS.footsteps.dirt);
      this.load.audio("wood_footstep", SOUNDS.footsteps.wood);
      this.load.audio("sand_footstep", SOUNDS.footsteps.sand);
      this.load.audio("nature_1", SOUNDS.loops.nature_1);
      this.load.audio("door_open", SOUNDS.doors.open);
      this.load.audio("boat", SOUNDS.loops.engine);

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
        "Teeny Tiny Pixls",
        "world/Teeny Tiny Pixls5.png",
        "world/Teeny Tiny Pixls5.xml"
      );
      this.load.bitmapFont("pixelmix", "world/7px.png", "world/7px.xml");

      this.load.once("complete", () => {
        this.scene.start(island?.id);
      });
    } catch (error) {
      errorLogger(error);
    }
  }
}
