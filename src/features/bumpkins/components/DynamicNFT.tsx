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
    function loadImage() {}
    const load = async () => {
      const tokenUri = tokenUriBuilder(bumpkinParts);

      // Grab a small file size and enlarge with CSS
      const size = 100;
      const fileName = `${tokenUri}x${size}.png`;
      const url = `https://testnet-images.bumpkins.io/nfts/${fileName}`;
      const img = new Image();
      img.src = url;

      if (img.complete) {
        setImageSrc(url);
      } else {
        img.onload = () => {
          setImageSrc(url);
        };

        img.onerror = async () => {
          console.log("Does not exist!");
          await buildImage({
            fileName: url,
            token: "",
          });
        };
      }
    };

    load();
  }, []);

  console.log({ imageSrc });
  if (!imageSrc) {
    return <img src={silhouette} alt="bumpkin" className="relative w-full" />;
  }

  return <img src={imageSrc} alt="bumpkin" className="relative w-full" />;
};
