import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { useLocation, useNavigate } from "react-router-dom";

import { Context } from "features/game/GameProvider";
import { CollectionName } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { getKeys } from "features/game/types/craftables";
import { BUMPKIN_WITHDRAWABLES } from "features/game/types/withdrawables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { ListViewCard } from "../ListViewCard";

import chest from "assets/icons/chest.png";

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};

export const MyCollection: React.FC = () => {
  const { t } = useAppTranslation();
  const isWorldRoute = useLocation().pathname.includes("/world");

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [search, setSearch] = useState("");
  const { buds } = gameState.context.state;

  const navigate = useNavigate();

  let items: CollectionItem[] = [];

  const inventory = getChestItems(gameState.context.state);
  getKeys(inventory).forEach((name) => {
    items.push({
      id: KNOWN_IDS[name],
      collection: "collectibles",
      count: inventory[name]?.toNumber() ?? 0,
    });
  });

  const wardrobe = availableWardrobe(gameState.context.state);
  getKeys(wardrobe).forEach((name) => {
    if (BUMPKIN_WITHDRAWABLES[name]()) {
      items.push({
        id: ITEM_IDS[name],
        collection: "wearables",
        count: wardrobe[name] ?? 0,
      });
    }
  });

  getKeys(buds ?? {}).forEach((id) => {
    if (!buds?.[id].coordinates) {
      items.push({
        id,
        collection: "buds",
        count: 1,
      });
    }
  });

  items = items.filter((item) => {
    const details = getTradeableDisplay({
      id: item.id,
      type: item.collection,
    });

    return details.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <InnerPanel className="h-auto  w-full mb-1">
        <Label className="mb-2 ml-2" type="default" icon={chest}>
          {t("marketplace.myCollection")}
        </Label>
        <div className="flex items-center">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={setSearch}
          />
        </div>
        <div className="p-2">
          <div className="flex flex-wrap">
            {getKeys(items).length === 0 && (
              <p className="text-sm">{t("marketplace.noCollection")}</p>
            )}
            {items.map((item) => {
              const details = getTradeableDisplay({
                id: item.id,
                type: item.collection,
              });

              return (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                  key={`${item.id}-${item.collection}`}
                >
                  <ListViewCard
                    details={details}
                    onClick={() => {
                      navigate(
                        `${isWorldRoute ? "/world" : ""}/marketplace/${details.type}/${item.id}`,
                      );
                    }}
                    count={item.count}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
