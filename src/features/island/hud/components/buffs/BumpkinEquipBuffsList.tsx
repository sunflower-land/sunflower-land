import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BUMPKIN_ITEM_BUFF, ITEM_IDS } from "features/game/types/bumpkin";
import { Bumpkin } from "features/game/types/game";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import React from "react";

export const BumpkinEquipBuffsList: React.FC<{ bumpkin: Bumpkin }> = ({
  bumpkin,
}) => {
  const equippedItems = Object.values(bumpkin.equipped);

  const buffs = equippedItems
    .map((equip, i) => {
      if (!BUMPKIN_ITEM_BUFF[equip]) {
        return null;
      }

      return (
        <OuterPanel
          key={`equip-buff-${i}`}
          className="flex flex-nowrap align-items-center h-28"
        >
          <div>
            <img
              src={getImageUrl(ITEM_IDS[equip])}
              className="h-20 float-left ml-5"
            />
          </div>

          <div className="pl-4 pr-10">
            <div className="text-sm">{equip}</div>

            <Label type="info">{BUMPKIN_ITEM_BUFF[equip]}</Label>
          </div>
        </OuterPanel>
      );
    })
    .filter(Boolean);

  const totalBuffs = [...buffs];
  if (totalBuffs.length === 0) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img
          src={SUNNYSIDE.icons.wardrobe}
          alt="No Buffs"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          Bumpkin has no buffed equips!
        </span>
      </div>
    );
  }

  return (
    <div className="h-80 scrollable overflow-y-auto">
      <div className="grid grid-cols-2 gap-1">{totalBuffs}</div>
    </div>
  );
};
