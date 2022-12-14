import React, { useEffect, useState } from "react";

import silhouette from "assets/bumpkins/silhouette.png";

import {
  BumpkinItem,
  BumpkinPart,
  Equipped as BumpkinParts,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { buildImage } from "../actions/buildImage";

interface Props {
  bumpkinParts: Partial<BumpkinParts>;
  showBackground?: boolean;
  showDropShadow?: boolean;
  showTools?: boolean;
  className?: string;
}

function getImageUrl(layerId: number) {
  if (CONFIG.NETWORK === "mainnet") {
    return `https://images.bumpkins.io/layers/${layerId}.png`;
  }

  return `https://testnet-images.bumpkins.io/layers/${layerId}.png`;
}

export const DynamicNFT: React.FC<Props> = ({
  bumpkinParts,
  showBackground,
  showDropShadow = true,
  showTools = true,
  className,
}) => {
  const [imageSrc, setImageSrc] = useState<string>();
  if (!bumpkinParts) {
    return null;
  }

  useEffect(() => {
    const load = async () => {
      const image = await buildImage({
        parts: bumpkinParts,
      });

      setImageSrc(image);
    };

    load();
  }, []);

  console.log({ imageSrc });
  if (!imageSrc) {
    return <img src={silhouette} alt="bumpkin" className="relative w-full" />;
  }

  return <img src={imageSrc} alt="bumpkin" className="relative w-full" />;
};
