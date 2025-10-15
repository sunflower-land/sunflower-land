import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { useLocation, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import { CollectionName } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { getKeys } from "features/game/types/craftables";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { ListViewCard } from "../ListViewCard";

import chest from "assets/icons/chest.png";
import { isNode } from "features/game/expansion/lib/expansionNodes";
import { BUMPKIN_RELEASES } from "features/game/types/withdrawables";

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};

export const MyCollection: React.FC = () => {
  const { t } = useAppTranslation();
  const location = useLocation();
  const isWorldRoute = location.pathname.includes("/world");

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [search, setSearch] = useState("");
  const { buds, pets: { nfts: petNFTs = {} } = {} } = gameState.context.state;

  const navigate = useNavigate();
  let items: CollectionItem[] = [];

  const inventory = getChestItems(gameState.context.state);
  getKeys(inventory)
    .filter((name) => !isNode(name))
    .forEach((name) => {
      items.push({
        id: KNOWN_IDS[name],
        collection: "collectibles",
        count: inventory[name]?.toNumber() ?? 0,
      });
    });

  const wardrobe = availableWardrobe(gameState.context.state);
  getKeys(wardrobe).forEach((name) => {
    const withdrawAt = BUMPKIN_RELEASES[name]?.withdrawAt;
    const canWithdraw = !!withdrawAt && withdrawAt <= new Date();
    if (canWithdraw) {
      items.push({
        id: ITEM_IDS[name],
        collection: "wearables",
        count: wardrobe[name] ?? 0,
      });
    }
  });

  getKeys(buds ?? {}).forEach((id) => {
    items.push({
      id,
      collection: "buds",
      count: 1,
    });
  });

  getKeys(petNFTs ?? {}).forEach((id) => {
    items.push({
      id,
      collection: "pets",
      count: 1,
    });
  });

  items = items.filter((item) => {
    const details = getTradeableDisplay({
      id: item.id,
      type: item.collection,
      state: gameState.context.state,
    });

    return details.name.toLowerCase().includes(search.toLowerCase());
  });

  // Separate items into three categories
  const budsItems = items.filter((item) => item.collection === "buds");
  const petsItems = items.filter((item) => item.collection === "pets");
  const wearableItems = items.filter((item) => item.collection === "wearables");
  const collectibleItems = items.filter(
    (item) => item.collection === "collectibles",
  );

  const ItemGrid: React.FC<{ items: CollectionItem[] }> = ({ items }) => (
    <div className="flex flex-wrap">
      {items.map((item) => {
        const details = getTradeableDisplay({
          id: item.id,
          type: item.collection,
          state: gameState.context.state,
        });

        return (
          <div
            key={`${item.collection}-${item.id}`}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/7 p-1"
          >
            <ListViewCard
              details={details}
              onClick={() => {
                navigate(
                  `${isWorldRoute ? "/world" : ""}/marketplace/${item.collection}/${item.id}`,
                  {
                    state: {
                      route: `${location.pathname}${location.search}`,
                    },
                  },
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <InnerPanel
        className="w-full mb-1"
        style={{
          height: "auto",
          minHeight: "200px",
        }}
      >
        <Label className="mb-2 ml-2" type="default" icon={chest}>
          {t("marketplace.myCollection")}
        </Label>
        <div className="flex items-center mb-2">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={setSearch}
          />
        </div>
        <div className="p-2 h-full w-full">
          {items.length === 0 ? (
            <p className="text-sm">{t("marketplace.noCollection")}</p>
          ) : (
            <div className="space-y-3">
              {collectibleItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("collectibles")} (${collectibleItems.length})`}
                  </Label>
                  <ItemGrid items={collectibleItems} />
                </div>
              )}

              {wearableItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("wearables")} (${wearableItems.length})`}
                  </Label>
                  <ItemGrid items={wearableItems} />
                </div>
              )}

              {budsItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("buds")} (${budsItems.length})`}
                  </Label>
                  <ItemGrid items={budsItems} />
                </div>
              )}

              {petsItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("pets")} (${petsItems.length})`}
                  </Label>
                  <ItemGrid items={petsItems} />
                </div>
              )}
            </div>
          )}
        </div>
      </InnerPanel>
    </>
  );
};
