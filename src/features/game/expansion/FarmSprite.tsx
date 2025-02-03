import { useEffect, useRef, useState } from "react";
import { useFarmScene } from "./PhaserProvider";
import { GRID_WIDTH_PX } from "../lib/constants";
import { PIXEL_SCALE } from "../lib/constants";
import { IMAGE_GRID_WIDTH } from "./components/LandBase";
import { useMapPlacement } from "./components/MapPlacement";

interface FarmSpriteProps {
  image: string;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  bottom?: number;
  right?: number;
  flipX?: boolean;
  onClick?: () => void;
  z?: number;
  collide?: boolean;
}

export const FarmSprite: React.FC<FarmSpriteProps> = ({
  image,
  width,
  height,
  left,
  top,
  bottom,
  right,
  flipX,
  onClick,
  z,
  collide = true,
}) => {
  const scene = useFarmScene();
  const mapPlacement = useMapPlacement();

  const { x, y, width: mapWidth, height: mapHeight } = mapPlacement ?? {};

  const ref = useRef<HTMLDivElement>(null);

  const [texture, setTexture] = useState<Phaser.Textures.Texture | undefined>();

  useEffect(() => {
    if (!scene) return;

    if (scene.textures.exists(image)) {
      setTexture(scene.textures.get(image));
    } else if (image.startsWith("data:")) {
      scene.textures.addBase64(image, image);
      scene.textures.once("addtexture", () =>
        setTexture(scene.textures.get(image)),
      );
    } else {
      scene.load.image(image, image);
      scene.load.once(`filecomplete-image-${image}`, () =>
        setTexture(scene.textures.get(image)),
      );
      scene.load.start();
    }
  }, [texture, image]);

  useEffect(() => {
    if (!scene) return;
    if (!texture) return;

    const sprite = new Phaser.GameObjects.Sprite(
      scene,
      (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2 + (x ?? 0) * GRID_WIDTH_PX,
      (IMAGE_GRID_WIDTH * GRID_WIDTH_PX) / 2 - (y ?? 0) * GRID_WIDTH_PX,
      texture,
    );
    sprite.setOrigin(0, 0);
    sprite.setScale(PIXEL_SCALE);

    sprite.setDepth(-(y ?? 0) * 100 + (z ?? 0));

    sprite.setInteractive({ cursor: "pointer" });
    const _onClick = () => {
      console.log("clicked", image);
      ref.current?.click();
    };
    sprite.on("pointerup", _onClick);
    sprite.setData("onClick", _onClick);
    scene.physics.world.enable(sprite);
    (sprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    if (collide) {
      (scene as any).colliders.add(sprite);
    }

    if (left !== undefined) {
      sprite.setX(sprite.x + left);
    } else if (right !== undefined) {
      sprite.setX(
        sprite.x +
          (mapWidth ?? 0) * GRID_WIDTH_PX -
          sprite.width * PIXEL_SCALE -
          right,
      );
    }

    if (top !== undefined) {
      sprite.setY(sprite.y + top);
    } else if (bottom !== undefined) {
      sprite.setY(
        sprite.y +
          (mapHeight ?? 0) * GRID_WIDTH_PX -
          sprite.height * PIXEL_SCALE -
          bottom,
      );
    }

    if (flipX) {
      sprite.setFlipX(true);
    }

    scene.add.existing(sprite);

    return () => {
      console.log("killing_sprite");
      sprite.destroy();
    };
  }, [
    scene,
    x,
    y,
    image,
    width,
    height,
    bottom,
    right,
    flipX,
    left,
    top,
    texture,
    onClick,
    collide,
    z,
  ]);

  return <div className="invisible divsoup" ref={ref} onClick={onClick}></div>;
};
