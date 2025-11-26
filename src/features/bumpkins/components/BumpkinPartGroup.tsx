import React from "react";
import classNames from "classnames";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";

import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";

import { BumpkinPart, ITEM_IDS } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import {
  BUMPKIN_ITEM_BUFF_LABELS,
  SPECIAL_ITEM_LABELS,
} from "features/game/types/bumpkinItemBuffs";
import { BUMPKIN_PART_SILHOUETTE } from "features/game/types/bumpkinPartSilhouettes";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  pixelBlueBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";

interface Props {
  bumpkinParts: BumpkinPart[];
  equipped: BumpkinParts;
  selected: string;
  onSelect: (bumpkinPart: BumpkinPart) => void;
  gridStyling?: string;
}

export const BumpkinPartGroup: React.FC<Props> = ({
  bumpkinParts,
  equipped,
  selected,
  onSelect,
  gridStyling,
}) => {
  return (
    <div
      className={
        gridStyling ?? "grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 gap-2"
      }
    >
      {bumpkinParts.map((name) => {
        const bumpkinItem = equipped[name];
        const boostLabel = bumpkinItem
          ? ((BUMPKIN_ITEM_BUFF_LABELS[bumpkinItem] &&
              !SPECIAL_ITEM_LABELS[bumpkinItem]) ??
            "")
          : "";

        const specialItem = bumpkinItem
          ? (SPECIAL_ITEM_LABELS[bumpkinItem] ?? "")
          : "";

        const buffLabel = boostLabel || specialItem;
        return (
          <OuterPanel
            key={name}
            className={classNames(
              "w-full cursor-pointer relative aspect-square hover:img-highlight !p-0 flex items-center justify-center",
              {
                "img-highlight": selected === name || bumpkinItem,
              },
            )}
            onClick={() => onSelect(name)}
          >
            {!!buffLabel && (
              <div
                className={classNames("absolute -right-2 -top-2", {
                  "bg-[#b65389]": specialItem,
                  "bg-[#1e6dd5]": boostLabel,
                })}
                style={
                  specialItem ? pixelVibrantBorderStyle : pixelBlueBorderStyle
                }
              >
                <SquareIcon icon={lightning} width={4} />
              </div>
            )}
            <img
              src={
                bumpkinItem
                  ? new URL(
                      `/src/assets/wearables/${ITEM_IDS[bumpkinItem]}.webp`,
                      import.meta.url,
                    ).href
                  : BUMPKIN_PART_SILHOUETTE[name]
              }
              className="h-10"
              style={{ imageRendering: "pixelated" }}
            />
            {selected === name && (
              <div id="select-box" className="block">
                <img
                  className="absolute pointer-events-none"
                  src={SUNNYSIDE.ui.selectBoxTL}
                  style={{
                    top: `${PIXEL_SCALE * -3}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    width: `${PIXEL_SCALE * 8}px`,
                  }}
                />
                {!buffLabel && (
                  <img
                    className="absolute pointer-events-none"
                    src={SUNNYSIDE.ui.selectBoxTR}
                    style={{
                      top: `${PIXEL_SCALE * -3}px`,
                      right: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                )}
                <img
                  className="absolute pointer-events-none"
                  src={SUNNYSIDE.ui.selectBoxBL}
                  style={{
                    bottom: `${PIXEL_SCALE * -3}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    width: `${PIXEL_SCALE * 8}px`,
                  }}
                />
                <img
                  className="absolute pointer-events-none"
                  src={SUNNYSIDE.ui.selectBoxBR}
                  style={{
                    bottom: `${PIXEL_SCALE * -3}px`,
                    right: `${PIXEL_SCALE * -3}px`,
                    width: `${PIXEL_SCALE * 8}px`,
                  }}
                />
              </div>
            )}
          </OuterPanel>
        );
      })}
    </div>
  );
};
