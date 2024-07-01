import React, { useRef, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SelectBox } from "components/ui/SelectBox";
import { CONFIG } from "lib/config";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

interface BumpkinBoxProps {
  bumpkin: { equipped: BumpkinParts; id: number };
  selectedId: number;
  onSelect: (tokenId: number) => void;
}

const INNER_CANVAS_WIDTH = 20;

const URL =
  CONFIG.NETWORK === "mainnet"
    ? "https://images.bumpkins.io/nfts"
    : "https://testnet-images.bumpkins.io/nfts";

export const BumpkinBox = ({
  bumpkin,
  selectedId,
  onSelect,
}: BumpkinBoxProps) => {
  const [isHover, setIsHover] = useState(false);

  const imageUrl = useRef(
    `${URL}/${tokenUriBuilder(bumpkin.equipped)}x100.png`,
  );

  return (
    <div
      key={bumpkin.id}
      className="relative"
      onClick={() => onSelect(bumpkin.id)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className="bg-brown-600 cursor-pointer relative"
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {imageUrl && <img src={imageUrl.current} alt="Bumpkin" />}
      </div>
      {(Number(selectedId) === bumpkin.id || isHover) && (
        <SelectBox innerCanvasWidth={INNER_CANVAS_WIDTH} />
      )}
    </div>
  );
};
