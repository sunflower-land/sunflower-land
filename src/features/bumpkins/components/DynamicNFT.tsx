import React, { useEffect, useState } from "react";

import silhouette from "assets/bumpkins/silhouette.png";

import { Equipped as BumpkinParts } from "features/game/types/bumpkin";
import { buildImage } from "../actions/buildImage";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";

interface Props {
  bumpkinParts: Partial<BumpkinParts>;
  showBackground?: boolean;
  showTools?: boolean;
}

export const DynamicNFT: React.FC<Props> = ({
  bumpkinParts,
  showBackground,
  showTools = true,
}) => {
  const [imageSrc, setImageSrc] = useState<string>();
  const [transitioned, setTransitioned] = useState<boolean>();

  const parts = cloneDeep(bumpkinParts);

  useEffect(() => {
    let isSubscribed = true;
    const load = async () => {
      const image = await buildImage({
        parts,
      });

      if (isSubscribed) {
        setImageSrc(image);
      }
    };

    load();

    return () => {
      isSubscribed = false;
    };
  }, []);

  if (!parts) {
    return null;
  }

  if (!showBackground) {
    delete parts.background;
  }

  if (!showTools) {
    delete parts.tool;
  }

  if (!imageSrc) {
    return (
      <div className={"relative w-full animate-pulse"}>
        {showBackground && (
          <div className="h-full w-full absolute bg-slate-800 opacity-50" />
        )}
        <img
          src={silhouette}
          alt="bumpkin"
          className="relative w-full opacity-80"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <img
        src={silhouette}
        alt="bumpkin"
        className="relative w-full opacity-80"
      />
      {showBackground && (
        <div className="h-full w-full absolute left-0 top-0 bg-slate-800 opacity-50" />
      )}
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
          setTimeout(() => setTransitioned(true), 50);
        }}
      />
    </div>
  );
};

export const BumpkinNFT: React.FC<BumpkinParts> = (parts) => {
  return <DynamicNFT bumpkinParts={parts} />;
};

export const MemoizedBumpkin = React.memo(BumpkinNFT);
