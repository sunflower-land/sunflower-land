import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
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
            "player",
            "https://api-dev.sunflower-land.com/animate/0_v1_48_243_42_0_0_22_96/walking",
            {
              frameHeight: 64,
              frameWidth: 96,
            },
          );
        },

        create: function (this) {
          this.physics.world.drawDebug = true;

          this.anims.create({
            key: "player",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 10,
            repeat: -1,
          });

          (this as any).player = this.physics.add.sprite(
            (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2,
            (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2,
            "player",
          );
          (this as any).player.setScale(PIXEL_SCALE);

          (this as any).w = this.input.keyboard?.addKey("W");
          (this as any).a = this.input.keyboard?.addKey("A");
          (this as any).s = this.input.keyboard?.addKey("S");
          (this as any).d = this.input.keyboard?.addKey("D");

          setScene(this);
          this.events.on("shutdown", () => {
            setScene(undefined);
          });
        },

        update: function (this: Phaser.Scene) {
          (this as any).player.play("player", true);

          let velocityX = 0;
          let velocityY = 0;

          if ((this as any).d?.isDown) velocityX = 100;
          if ((this as any).a?.isDown) velocityX = -100;
          if ((this as any).w?.isDown) velocityY = -100;
          if ((this as any).s?.isDown) velocityY = 100;

          const halfway = (GRID_WIDTH_PX * IMAGE_GRID_WIDTH) / 2;
          const depth =
            ((this as any).player.y -
              ((this as any).player.height * PIXEL_SCALE) / 4 -
              halfway) /
            GRID_WIDTH_PX;

          console.log(
            halfway,
            Math.floor(depth),
            (this as any).player.y + (this as any).player.height,
          );

          (this as any).player.setDepth(Math.floor(depth));

          (this as any).player.setVelocity(velocityX, velocityY);
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
