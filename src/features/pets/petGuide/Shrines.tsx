import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { PET_SHOP_ITEMS } from "features/game/types/petShop";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { PET_SHRINES, PetShrineName } from "features/game/types/pets";
import { InventoryItemName } from "features/game/types/game";
import classNames from "classnames";
import { getKeys } from "features/game/lib/crafting";

export const Shrines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const shrineNames: (PetShrineName | "Obsidian Shrine")[] = [
    ...getKeys(PET_SHRINES),
    "Obsidian Shrine",
  ];

  const shrines = shrineNames.map((name) => {
    const shopItem = PET_SHOP_ITEMS[name];
    const buffLabels =
      COLLECTIBLE_BUFF_LABELS[name]?.({ skills: {}, collectibles: {} }) || [];
    const effect = buffLabels.map((buff) => buff.shortDescription).join(", ");

    const ingredients = shopItem.ingredients
      ? Object.entries(shopItem.ingredients).map(([item, amount]) => {
          const itemName = item as InventoryItemName;
          return {
            item: itemName,
            amount: amount.toString(),
            icon: ITEM_DETAILS[itemName]?.image,
          };
        })
      : [];

    return {
      name,
      image: ITEM_DETAILS[name as InventoryItemName]?.image,
      ingredients,
      effect: effect || "No effect listed",
    };
  });

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Shrines`}</Label>
      </div>
      <p className="text-xs p-1 mb-1">
        {`Every shrine blueprint uses pet resources—double-check your fetch stockpile before crafting. Shrines can be renewed once expired.`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed border-collapse">
          <thead>
            <tr>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/4"
              >
                {`Shrine`}
              </th>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-2/5"
              >
                {`Ingredients`}
              </th>
              <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
                {`Effect`}
              </th>
            </tr>
          </thead>
          <tbody>
            {shrines.map((shrine, index) => (
              <tr
                key={index}
                className={classNames("relative", {
                  "bg-[#ead4aa]": index % 2 === 0,
                })}
              >
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  <div className="flex items-center gap-1">
                    {shrine.image && (
                      <img
                        src={shrine.image}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span>{shrine.name}</span>
                  </div>
                </td>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {shrine.ingredients.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1">
                      {shrine.ingredients.map((ingredient, idx) => (
                        <div key={idx} className="flex items-center gap-0.5">
                          {ingredient.icon && (
                            <img
                              src={ingredient.icon}
                              className="w-4 h-4 object-contain"
                            />
                          )}
                          <span>
                            {ingredient.amount} {ingredient.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </td>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  {shrine.effect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
