import mapJson from "assets/map/poker_house.json";
import StairsDown from "./images/stairs_down.png"
import DealerSpriteSheet from "./images/dealer_sheet.png"
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { FanArtNPC, interactableModalManager } from "src/features/world/ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import {

    AudioLocalStorageKeys,
    getCachedAudioSetting,
} from "src/features/game/lib/audio";

export class PokerHouseScene extends BaseScene {
  sceneId: SceneId = "poker_house";

  constructor() {
    super({
      name: "poker_house",
      map: { json: mapJson },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }


  
  preload() {
    super.preload();
    this.load.image("stairs",StairsDown)
    this.load.spritesheet("dealer",DealerSpriteSheet,{frameWidth:16,frameHeight:16});

    // Ambience SFX
    if (!this.sound.get("nature_1")) {
      const nature1 = this.sound.add("nature_1");
      nature1.play({ loop: true, volume: 0.01 });
    }

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "poker_house",
    });

    super.create();

    const stairs = this.add.image(440,47,"stairs")

    const dealer1 = this.add.sprite(120,310,"dealer");
    const dealer2 = this.add.sprite(360,310,"dealer");
    const dealer3 = this.add.sprite(120,230,"dealer");
    const dealer4 = this.add.sprite(360,230,"dealer");
    const dealer5 = this.add.sprite(120,150,"dealer");
    const dealer6 = this.add.sprite(360,150,"dealer");
    const dealer7 = this.add.sprite(120,70,"dealer");
    this.anims.create({
        key:"dealer_anim",
        frames: this.anims.generateFrameNumbers("dealer", { start: 0, end: 8, }), repeat: -1, frameRate: 10,
    });
    dealer1.play("dealer_anim",true)
    dealer1.setInteractive({cursor:"pointer"}).on("pointerdown",() => {
        if (this.checkDistanceToSprite(dealer1, 50)) {
            console.log("test")
            interactableModalManager.open("clubhouse_reward");
          } else {
            this.currentPlayer?.speak(translate("base.iam.far.away"));
          }
    })

    dealer2.play("dealer_anim",true)
    dealer3.play("dealer_anim",true)
    dealer4.play("dealer_anim",true)
    dealer5.play("dealer_anim",true)
    dealer6.play("dealer_anim",true)
    dealer7.play("dealer_anim",true)
    
    this.physics.world.drawDebug = true;
  }
}
