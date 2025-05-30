// import { buildNPCSheets } from "features/bumpkins/actions/buildNPCSheets";
// import { getAnimationUrl } from "features/world/lib/animations";

// import {
//   BumpkinParts,
//   interpretTokenUri,
//   tokenUriBuilder,
// } from "lib/utils/tokenUriBuilder";

// export class RacingBumpkin extends Phaser.GameObjects.Container {
//   private sprite: Phaser.GameObjects.Sprite | undefined;
//   public shadow: Phaser.GameObjects.Sprite | undefined;
//   private silhouette: Phaser.GameObjects.Sprite | undefined;
//   private spriteKey: string | undefined;
//   private idleAnimationKey: string | undefined;
//   private walkingAnimationKey: string | undefined;
//   private clothing: BumpkinParts;
//   private tokenUri: string;
//   private ready = false;

//   constructor({
//     scene,
//     x,
//     y,
//     tokenUri,
//   }: {
//     scene: Phaser.Scene;
//     x: number;
//     y: number;
//     tokenUri: string;
//   }) {
//     super(scene, x, y);

//     this.tokenUri = tokenUri;
//     this.clothing = this.getClothing(tokenUri);

//     this.scene = scene;
//     // scene.physics.add.existing(this);

//     this.silhouette = scene.add.sprite(0, 0, "silhouette");
//     this.add(this.silhouette);
//     this.sprite = this.silhouette;

//     this.shadow = this.scene.add
//       .sprite(0.5, 8, "shadow")
//       .setSize(SQUARE_WIDTH, SQUARE_WIDTH);
//     this.add(this.shadow).moveTo(this.shadow, 0);

//     this.loadSprites(scene);
//     this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);
//   }

//   private getClothing(tokenUri: string) {
//     const interpreted = interpretTokenUri(tokenUri);

//     return interpreted.equipped;
//   }

//   private async loadSprites(scene: Phaser.Scene) {
//     console.log("Loading sprites for bumpkin");
//     this.spriteKey = tokenUriBuilder(this.clothing);
//     this.idleAnimationKey = `${this.spriteKey}-bumpkin-idle`;
//     this.walkingAnimationKey = `${this.spriteKey}-bumpkin-walking`;

//     // ✅ Place these logs here
//     console.log("Sprite Key:", this.spriteKey);
//     console.log("Texture exists:", scene.textures.exists(this.spriteKey));

//     await buildNPCSheets({
//       parts: this.clothing,
//     });

//     if (scene.textures.exists(this.spriteKey)) {
//       console.log("Texture already exists, creating sprite immediately");
//       // If we have idle sheet then we can create the idle animation and set the sprite up straight away
//       this.createSprite(scene);
//     } else {
//       console.log("Texture doesn't exist, loading from URL");
//       const url = getAnimationUrl(this.clothing, ["idle", "walking"]);
//       const idleLoader = scene.load.spritesheet(this.spriteKey, url, {
//         frameWidth: 96,
//         frameHeight: 64,
//       });

//       idleLoader.once(`filecomplete-spritesheet-${this.spriteKey}`, () => {
//         if (!scene.textures.exists(this.spriteKey as string) || this.ready) {
//           return;
//         }

//         this.createSprite(scene);
//       });
//     }
//   }

//   public onTextureLoaded() {
//     if (this.ready || !this.scene.textures.exists(this.spriteKey as string))
//       return;

//     this.createSprite(this.scene);
//   }

//   private createSprite(scene: Phaser.Scene) {
//     try {
//       const idle = scene.add
//         .sprite(0, 2, this.spriteKey as string)
//         .setOrigin(0.5);
//       this.add(idle);
//       this.sprite = idle;

//       console.log("Sprite Key:", this.spriteKey);
//       console.log(
//         "Texture exists:",
//         this.scene.textures.exists(this.spriteKey as string),
//       );

//       this.createIdleAnimation(0, 8);
//       this.createWalkingAnimation(9, 16);
//       this.sprite.play(this.idleAnimationKey as string, true);
//       console.log("Playing idle animation after load");

//       this.ready = true;
//       if (this.silhouette?.active) {
//         this.silhouette?.destroy();
//       }
//     } catch (error) {
//       console.error("Error creating sprite:", error);
//       // Keep the silhouette as fallback
//       this.ready = true;
//     }
//   }

//   private createIdleAnimation(start: number, end: number) {
//     if (!this.scene || !this.scene.anims) return;

//     this.scene.anims.create({
//       key: this.idleAnimationKey,
//       frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
//         start,
//         end,
//       }),
//       repeat: -1,
//       frameRate: 10,
//     });
//   }

//   private createWalkingAnimation(start: number, end: number) {
//     if (!this.scene || !this.scene.anims) return;

//     this.scene.anims.create({
//       key: this.walkingAnimationKey,
//       frames: this.scene.anims.generateFrameNumbers(this.spriteKey as string, {
//         start,
//         end,
//       }),
//       repeat: -1,
//       frameRate: 10,
//     });
//   }
// }

export class RacingBumpkin extends Phaser.GameObjects.Container {
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);

    const zoom = window.innerWidth < 500 ? 3 : 4;

    const silhouette = scene.add
      .sprite(0, 0, "silhouette")
      .setOrigin(0.5)
      .setScale(zoom);
    this.add(silhouette);

    // this.setSize(SQUARE_WIDTH, SQUARE_WIDTH * zoom);
    scene.add.existing(this);
  }
}
