import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { IMAGE_GRID_WIDTH } from "./components/LandBase";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";

const PhaserContext = createContext<Phaser.Scene | undefined>(undefined);

export const useFarmScene = () => {
  const scene = useContext(PhaserContext);
  return scene;
};

export const PhaserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scene, setScene] = useState<Phaser.Scene>();

  useLayoutEffect(() => {
    // Create empty Phaser game
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "phaser-game",
      width: IMAGE_GRID_WIDTH * GRID_WIDTH_PX,
      height: IMAGE_GRID_WIDTH * GRID_WIDTH_PX,
      transparent: true,
      pixelArt: true,
      input: {
        keyboard: true,
      },
      loader: {
        crossOrigin: "anonymous",
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: true,
        },
      },

      scene: {
        preload: function (this) {
          this.load.spritesheet(
            "walking",
            "https://api-dev.sunflower-land.com/animate/0_v1_48_243_42_0_0_22_96/walking",
            {
              frameHeight: 64,
              frameWidth: 96,
            },
          );
          this.load.spritesheet(
            "idle",
            "https://api-dev.sunflower-land.com/animate/0_v1_48_243_42_0_0_22_96/idle",
            {
              frameHeight: 64,
              frameWidth: 96,
            },
          );
          this.load.spritesheet(
            "attack",
            "https://api-dev.sunflower-land.com/animate/0_v1_48_243_42_0_0_22_96/attack",
            {
              frameHeight: 64,
              frameWidth: 96,
            },
          );
        },

        create: function (this) {
          this.physics.world.drawDebug = true;

          // Create collision group
          (this as any).colliders = this.add.group();

          this.anims.create({
            key: "walking",
            frames: this.anims.generateFrameNumbers("walking"),
            frameRate: 10,
            repeat: -1,
          });

          this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("idle"),
            frameRate: 10,
            repeat: -1,
          });

          this.anims.create({
            key: "attack",
            frames: this.anims.generateFrameNumbers("attack"),
            frameRate: 20,
            repeat: 0,
          });

          (this as any).player = this.physics.add.sprite(
            (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2,
            (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2 - 100, // Spawn 100px higher
            "idle",
          );
          (this as any).player.setScale(PIXEL_SCALE);
          (this as any).player.setOrigin(0.5, 0.5); // Set origin to center

          // Set collision box to half size
          (this as any).player.body.setSize(12, 8); // Half of frameWidth (96/2) and frameHeight (64/2)
          (this as any).player.body.setOffset(42, 32); // Center the collision box
          (this as any).player.body.collideWorldBounds = true;

          // Add collision between player and colliders group
          this.physics.add.collider(
            (this as any).player,
            (this as any).colliders,
          );

          (this as any).w = this.input.keyboard?.addKey("W");
          (this as any).a = this.input.keyboard?.addKey("A");
          (this as any).s = this.input.keyboard?.addKey("S");
          (this as any).d = this.input.keyboard?.addKey("D");
          (this as any).e = this.input.keyboard?.addKey("E");

          setScene(this);
          this.events.on("shutdown", () => {
            setScene(undefined);
          });
        },

        update: function (this: Phaser.Scene) {
          const scene = this as any;
          const player = scene.player;

          let velocityX = 0;
          let velocityY = 0;
          let isMoving = false;

          const isAttacking =
            player.anims.isPlaying &&
            player.anims.currentAnim?.key === "attack";

          // Handle attack
          if (scene.e?.isDown && !isAttacking) {
            player.play("attack", true);

            // Get nearby interactable objects
            const radius = 12; // Interaction radius in pixels
            const nearby = scene.children.list.filter((sprite: any) => {
              // Skip non-interactive sprites
              if (!sprite.getData("onClick")) return false;

              // Get bounds of both sprites
              const playerBounds = new Phaser.Geom.Rectangle(
                player.x - 6, // Center - half width
                player.y - 12, // Center - half height
                12, // Width
                24, // Height
              );
              const spriteBounds = sprite.getBounds();

              // Find shortest distance between edges of bounds
              const dx = Math.max(
                playerBounds.left - spriteBounds.right,
                spriteBounds.left - playerBounds.right,
                0,
              );
              const dy = Math.max(
                playerBounds.top - spriteBounds.bottom,
                spriteBounds.top - playerBounds.bottom,
                0,
              );
              const distance = Math.sqrt(dx * dx + dy * dy);

              return distance <= radius;
            });

            // Trigger click events on nearby objects
            nearby.forEach((sprite: any) => {
              if (sprite.getData("onClick")) {
                sprite.getData("onClick")();
              }
            });
          }

          // Only allow movement if not attacking
          if (!isAttacking) {
            // Handle horizontal movement
            if (scene.d?.isDown) {
              velocityX += 100;
              player.flipX = false;
              isMoving = true;
            }
            if (scene.a?.isDown) {
              velocityX -= 100;
              player.flipX = velocityX < 0;
              isMoving = true;
            }

            // Handle vertical movement
            if (scene.w?.isDown) {
              velocityY -= 100;
              isMoving = true;
            }
            if (scene.s?.isDown) {
              velocityY += 100;
              isMoving = true;
            }

            // Normalize diagonal movement
            if (velocityX !== 0 && velocityY !== 0) {
              const factor = 1 / Math.sqrt(2);
              velocityX *= factor;
              velocityY *= factor;
            }

            // Play appropriate animation
            if (isMoving) {
              player.play("walking", true);
            } else if (!player.anims.isPlaying) {
              player.play("idle", true);
            }
          }

          const halfway = (GRID_WIDTH_PX * IMAGE_GRID_WIDTH) / 2;
          const depth =
            (player.y - (player.height * PIXEL_SCALE) / 8 - halfway) /
            GRID_WIDTH_PX;

          scene.player.setDepth(depth * 100);

          scene.player.setVelocity(velocityX, velocityY);
        },
      },
    });

    return () => {
      setScene(undefined);
      game.destroy(true);
    };
  }, []);

  return (
    <PhaserContext.Provider value={scene}>
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: IMAGE_GRID_WIDTH * GRID_WIDTH_PX,
          height: IMAGE_GRID_WIDTH * GRID_WIDTH_PX,
        }}
        id="phaser-game"
      />
      <div className="pointer-events-none">{scene && children}</div>
    </PhaserContext.Provider>
  );
};
