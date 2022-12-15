import React, { useEffect, useState } from "react";

import silhouette from "assets/bumpkins/silhouette.png";

import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { buildImage } from "../actions/buildImage";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";

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
  const [transitioned, setTransitioned] = useState<boolean>();

  const parts = cloneDeep(bumpkinParts);

  useEffect(() => {
    const load = async () => {
      const image = await buildImage({
        parts,
      });

      setImageSrc(image);
    };

    load();
  }, []);

  if (!parts) {
    return null;
  }

  console.log({ showBackground });
  if (!showBackground) {
    delete parts.background;
  }

  if (!showTools) {
    delete parts.tool;
  }

  if (!imageSrc) {
    return <img src={silhouette} alt="bumpkin" className="relative w-full" />;
  }

  return (
    <div className="relative w-full">
      <img src={silhouette} alt="bumpkin" className="relative w-full" />

      <img
        src={imageSrc}
        alt="fader"
        className={classNames("absolute top-0 left-0 w-full opacity-0", {
          "opacity-100": transitioned,
        })}
        style={{
          transition: "opacity 0.2s ease-in-out",
        }}
        onLoad={() => {
          setTransitioned(true);
        }}
      />
    </div>
  );
};
