import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useLocation, useNavigate } from "react-router";

import { Context } from "features/game/GameProvider";
import type { CollectionName } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { getKeys } from "lib/object";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { ListViewCard } from "../ListViewCard";
import { InventoryFilters } from "features/island/hud/components/inventory/InventoryFilters";

import chest from "assets/icons/chest.png";
import { isNode } from "features/game/expansion/lib/expansionNodes";
import { BUILDINGS } from "features/game/types/buildings";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState } from "features/game/types/game";

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};

type CollectionCategory =
  | "buds"
  | "pets"
  | "buildings"
  | "wearables"
  | "collectibles"
  | "cosmetic";

type EnrichedCollectionItem = CollectionItem & {
  details: ReturnType<typeof getTradeableDisplay>;
  category: CollectionCategory;
};

type Props = {
  fullHeight?: boolean;
};

const _state = (state: MachineState) => state.context.state;
const BUILDING_NAMES = new Set(Object.keys(BUILDINGS));

const getBaseCategory = (
  item: CollectionItem,
  details: ReturnType<typeof getTradeableDisplay>,
): CollectionCategory => {
  if (item.collection === "buds") return "buds";
  if (item.collection === "pets") return "pets";
  if (item.collection === "wearables") return "wearables";

  if (BUILDING_NAMES.has(details.name)) {
    return "buildings";
  }

  return details.buffs.length > 0 ? "collectibles" : "cosmetic";
};

export const MyCollection: React.FC<Props> = ({ fullHeight = false }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const gameState = useSelector(gameService, _state);

  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<
    CollectionCategory[]
  >([]);
  const { buds, pets: { nfts: petNFTs = {} } = {} } = gameState;

  const items: CollectionItem[] = [];

  const inventory = getChestItems(gameState);
  getKeys(inventory)
    .filter((name) => !isNode(name))
    .forEach((name) => {
      items.push({
        id: KNOWN_IDS[name],
        collection: "collectibles",
        count: inventory[name]?.toNumber() ?? 0,
      });
    });

  const wardrobe = availableWardrobe(gameState);
  getKeys(wardrobe).forEach((name) => {
    items.push({
      id: ITEM_IDS[name],
      collection: "wearables",
      count: wardrobe[name] ?? 0,
    });
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
      id: Number(id),
      collection: "pets",
      count: 1,
    });
  });

  const enrichedItems: EnrichedCollectionItem[] = items
    .map((item) => {
      const details = getTradeableDisplay({
        id: item.id,
        type: item.collection,
        state: gameState,
      });
      const category = getBaseCategory(item, details);

      return {
        ...item,
        details,
        category,
      };
    })
    .filter((item) =>
      item.details.name.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((item) => {
      if (activeCategories.length === 0) return true;

      return activeCategories.includes(item.category);
    });

  const toggleCategory = (id: string) => {
    setActiveCategories((current) =>
      current.includes(id as CollectionCategory)
        ? current.filter((entry) => entry !== id)
        : [...current, id as CollectionCategory],
    );
  };

  const sortItems = (items: EnrichedCollectionItem[]) =>
    [...items].sort((a, b) => a.details.name.localeCompare(b.details.name));

  const budsItems = sortItems(
    enrichedItems.filter((item) => item.category === "buds"),
  );
  const petsItems = sortItems(
    enrichedItems.filter((item) => item.category === "pets"),
  );
  const buildingItems = sortItems(
    enrichedItems.filter((item) => item.category === "buildings"),
  );
  const wearableItems = sortItems(
    enrichedItems.filter((item) => item.category === "wearables"),
  );
  const collectibleItems = sortItems(
    enrichedItems.filter((item) => item.category === "collectibles"),
  );
  const cosmeticItems = sortItems(
    enrichedItems.filter((item) => item.category === "cosmetic"),
  );

  const categories = [
    { id: "buds", label: t("buds") },
    { id: "pets", label: t("pets") },
    { id: "collectibles", label: t("collectibles") },
    { id: "wearables", label: t("wearables") },
    { id: "cosmetic", label: t("marketplace.cosmetics") },
    { id: "buildings", label: t("buildings") },
  ];

  return (
    <>
      <InnerPanel
        className={
          fullHeight
            ? "w-full h-full min-h-0 flex flex-col mb-1"
            : "w-full mb-1"
        }
        style={
          fullHeight
            ? undefined
            : {
                height: "auto",
                minHeight: "200px",
              }
        }
      >
        <Label className="mb-2 ml-2" type="default" icon={chest}>
          {t("marketplace.myCollection")}
        </Label>
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          categories={categories}
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
          onClearCategories={() => setActiveCategories([])}
        />
        <div
          className={
            fullHeight
              ? "min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden scrollable p-2"
              : "p-2 h-full w-full"
          }
        >
          {enrichedItems.length === 0 ? (
            <p className="text-sm">{t("marketplace.noCollection")}</p>
          ) : (
            <div className="space-y-3">
              {budsItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("buds")} (${budsItems.length})`}
                  </Label>
                  <ItemGrid items={budsItems} gameState={gameState} />
                </div>
              )}
              {petsItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("pets")} (${petsItems.length})`}
                  </Label>
                  <ItemGrid items={petsItems} gameState={gameState} />
                </div>
              )}
              {collectibleItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("collectibles")} (${collectibleItems.length})`}
                  </Label>
                  <ItemGrid items={collectibleItems} gameState={gameState} />
                </div>
              )}
              {wearableItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("wearables")} (${wearableItems.length})`}
                  </Label>
                  <ItemGrid items={wearableItems} gameState={gameState} />
                </div>
              )}
              {cosmeticItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("marketplace.cosmetics")} (${cosmeticItems.length})`}
                  </Label>
                  <ItemGrid items={cosmeticItems} gameState={gameState} />
                </div>
              )}
              {buildingItems.length > 0 && (
                <div>
                  <Label className="mb-2" type="default">
                    {`${t("buildings")} (${buildingItems.length})`}
                  </Label>
                  <ItemGrid items={buildingItems} gameState={gameState} />
                </div>
              )}
            </div>
          )}
        </div>
      </InnerPanel>
    </>
  );
};

const ItemGrid: React.FC<{
  items: EnrichedCollectionItem[];
  gameState: GameState;
}> = ({ items, gameState }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWorldRoute = location.pathname.includes("/world");
  return (
    <div className="flex flex-wrap">
      {items.map((item) => {
        return (
          <div
            key={`${item.collection}-${item.id}`}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/7 p-1"
          >
            <ListViewCard
              details={item.details}
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
};
