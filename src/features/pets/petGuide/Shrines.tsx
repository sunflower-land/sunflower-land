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
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import Decimal from "decimal.js-light";

export const Shrines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useAppTranslation();
  const shrineNames: (PetShrineName | "Obsidian Shrine")[] = [
    ...getKeys(PET_SHRINES),
    "Obsidian Shrine",
  ];

  type Shrine = {
    name: PetShrineName | "Obsidian Shrine";
    image: string;
    ingredients: {
      item: InventoryItemName;
      amount: number;
      icon: string;
    }[];
    effect: string[];
  };

  const shrines = shrineNames.map<Shrine>((name) => {
    const shopItem = PET_SHOP_ITEMS[name];
    const buffLabels =
      COLLECTIBLE_BUFF_LABELS[name]?.({ skills: {}, collectibles: {} }) || [];
    const effect = buffLabels.map((buff) => buff.shortDescription);

    const ingredients = shopItem.ingredients
      ? getObjectEntries(shopItem.ingredients).map<
          Shrine["ingredients"][number]
        >(([item, amount = new Decimal(0)]) => ({
          item,
          amount: Number(amount),
          icon: ITEM_DETAILS[item].image,
        }))
      : [];

    const shrine: Shrine = {
      name,
      image: ITEM_DETAILS[name].image,
      ingredients,
      effect: effect || ["No effect listed"],
    };

    return shrine;
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
        <Label type="default">{t("petGuide.shrines.title")}</Label>
      </div>
      <p className="text-xs p-1 mb-1">{t("petGuide.shrines.description")}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed border-collapse">
          <thead>
            <tr>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/3 sm:w-[27%]"
              >
                {`Shrine`}
              </th>
              <th
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/3 sm:w-2/5"
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
                  <div className="flex flex-col gap-1">
                    {shrine.effect.map((effect) => (
                      <span key={effect}>{effect}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
