import { useEffect } from "react";

type PhaserTextureProps = {
  constructor: ConstructorParameters<typeof Phaser.Textures.Texture>;
};

export const PhaserTexture: React.FC<PhaserTextureProps> = ({
  constructor,
}) => {
  useEffect(() => {
    const newTexture = new Phaser.Textures.Texture(...constructor);
    return () => {
      newTexture.destroy();
    };
  }, constructor);
  return null;
};
