import chest from "assets/icons/chest.png";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getEntries } from "features/game/types/craftables";
import { Collectibles } from "features/game/types/game";
import { OPEN_SEA_ITEMS } from "metadata/metadata";
import React from "react";

export const CollectionBuffsList: React.FC<{ collectibles: Collectibles }> = ({
  collectibles,
}) => {
  const searchItem = (itemName: any) => {
    try {
      const item = getEntries(OPEN_SEA_ITEMS).find(
        (entry) => entry && entry[0] && entry[0] === itemName
      );

      if (!item) {
        return false;
      }

      item[1].name = itemName;

      return item[1];
    } catch (_) {
      return false;
    }
  };

  const items = Object.keys(collectibles).map((collectionName) =>
    searchItem(collectionName)
  );

  const buffs = items
    .map((item, i) => {
      if (!item) {
        return null;
      }

      return (
        <OuterPanel
          key={`equip-buff-${i}`}
          className="flex flex-nowrap align-items-center h-28"
        >
          <div
            style={{
              backgroundImage: `url('${item.image_url}')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              height: "100%",
              width: "150px",
            }}
          ></div>

          <div className="pl-4 pr-10">
            <div className="text-sm">{item.name}</div>

            <Label type="info">{item.description}</Label>
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
          src={chest}
          alt="No Buffs"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          There are no buffed collections!
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
