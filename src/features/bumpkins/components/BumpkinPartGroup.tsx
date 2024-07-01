import React from "react";
import classNames from "classnames";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";

import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import lightning from "assets/icons/lightning.png";

import { BumpkinPart, ITEM_IDS } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { BUMPKIN_PART_SILHOUETTE } from "features/game/types/bumpkinPartSilhouettes";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelBlueBorderStyle } from "features/game/lib/style";
import { getImageUrl } from "lib/utils/getImageURLS";

interface Props {
  bumpkinParts: BumpkinPart[];
  equipped: BumpkinParts;
  selected: string;
  onSelect: (bumpkinPart: BumpkinPart) => void;
}

export const BumpkinPartGroup: React.FC<Props> = ({
  bumpkinParts,
  equipped,
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {bumpkinParts.map((name) => {
        const bumpkinItem = equipped[name];
        const buffLabel = bumpkinItem
          ? BUMPKIN_ITEM_BUFF_LABELS[bumpkinItem] ?? ""
          : "";

        return (
          <OuterPanel
            key={name}
            className={classNames(
              "w-full cursor-pointer relative aspect-square hover:img-highlight !p-0",
              {
                "img-highlight": selected === name || bumpkinItem,
              },
            )}
            onClick={() => onSelect(name)}
          >
            {!!buffLabel && (
              <div
                className="absolute -right-2 -top-2 bg-[#1e6dd5]"
                style={{ ...pixelBlueBorderStyle }}
              >
                <SquareIcon icon={lightning} width={4} />
              </div>
            )}
            <img
              src={
                bumpkinItem
                  ? getImageUrl(ITEM_IDS[bumpkinItem])
                  : BUMPKIN_PART_SILHOUETTE[name]
              }
              className="w-full"
              style={{ imageRendering: "pixelated" }}
            />
            {selected === name && (
              <div id="select-box" className="block">
                <img
                  className="absolute pointer-events-none"
                  src={selectBoxTL}
                  style={{
                    top: `${PIXEL_SCALE * -3}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    width: `${PIXEL_SCALE * 8}px`,
                  }}
                />
                {!buffLabel && (
                  <img
                    className="absolute pointer-events-none"
                    src={selectBoxTR}
                    style={{
                      top: `${PIXEL_SCALE * -3}px`,
                      right: `${PIXEL_SCALE * -3}px`,
                      width: `${PIXEL_SCALE * 8}px`,
                    }}
                  />
                )}
                <img
                  className="absolute pointer-events-none"
                  src={selectBoxBL}
                  style={{
                    bottom: `${PIXEL_SCALE * -3}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    width: `${PIXEL_SCALE * 8}px`,
                  }}
                />
                <img
                  className="absolute pointer-events-none"
                  src={selectBoxBR}
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
