import React, { useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  GameState,
  InventoryItemName,
  IslandType,
  TemperateSeasonName,
} from "features/game/types/game";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { getChestBuds, getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";

import lightning from "assets/icons/lightning.png";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";

import { Bud, BudName, isBudName } from "features/game/types/buds";
import { CONFIG } from "lib/config";
import { BudDetails } from "components/ui/layouts/BudDetails";
import classNames from "classnames";
import { RESOURCES } from "features/game/types/resources";
import { BUILDINGS } from "features/game/types/buildings";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  BUSH_VARIANTS,
  DIRT_PATH_VARIANTS,
  TREE_VARIANTS,
  WATER_WELL_VARIANTS,
} from "features/island/lib/alternateArt";
import { BANNERS } from "features/game/types/banners";
import { InnerPanel } from "components/ui/Panel";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { HourglassType } from "features/island/collectibles/components/Hourglass";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { BEDS } from "features/game/types/beds";
import { WEATHER_SHOP_ITEM_COSTS } from "features/game/types/calendar";
import {
  BUILDING_UPGRADES,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "features/game/events/landExpansion/upgradeBuilding";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

export const ITEM_ICONS: (
  island: IslandType,
  season: TemperateSeasonName,
  level?: number,
) => Partial<Record<InventoryItemName, string>> = (island, season, level) => ({
  Market: SUNNYSIDE.icons.marketIcon,
  "Fire Pit": SUNNYSIDE.icons.firePitIcon,
  Workbench: SUNNYSIDE.icons.workbenchIcon,
  Kitchen: SUNNYSIDE.icons.kitchenIcon,
  "Hen House": SUNNYSIDE.icons.henHouseIcon,
  Bakery: SUNNYSIDE.icons.bakeryIcon,
  Deli: SUNNYSIDE.icons.deliIcon,
  "Smoothie Shack": SUNNYSIDE.icons.smoothieIcon,
  Toolshed: SUNNYSIDE.icons.toolshedIcon,
  Warehouse: SUNNYSIDE.icons.warehouseIcon,
  Tree: TREE_VARIANTS[island][season],
  "Dirt Path": DIRT_PATH_VARIANTS[island],
  Greenhouse: SUNNYSIDE.icons.greenhouseIcon,
  Bush: BUSH_VARIANTS[island][season],
  "Water Well": WATER_WELL_VARIANTS[season][level ?? 1],
});

interface PanelContentProps {
  selectedChestItem: InventoryItemName | `Bud-${number}`;
  closeModal: () => void;
  state: GameState;
  buds: Record<number, Bud>;
  onPlace?: (name: InventoryItemName) => void;
  onPlaceBud?: (bud: BudName) => void;
  isSaving?: boolean;
}

export type TimeBasedConsumables =
  | HourglassType
  | "Time Warp Totem"
  | "Super Totem";

const PanelContent: React.FC<PanelContentProps> = ({
  isSaving,
  onPlace,
  onPlaceBud,
  selectedChestItem,
  closeModal,
  state,
  buds,
}) => {
  const { t } = useAppTranslation();

  const [confirmationModal, showConfirmationModal] = useState(false);

  const handlePlace = () => {
    if (
      selectedChestItem in RESOURCES ||
      selectedChestItem in EXPIRY_COOLDOWNS
    ) {
      showConfirmationModal(true);
    } else {
      isBudName(selectedChestItem)
        ? onPlaceBud && onPlaceBud(selectedChestItem)
        : onPlace && onPlace(selectedChestItem);
      closeModal();
    }
  };

  const getResourceNodeCondition = (hourglass: TimeBasedConsumables) => {
    const hourglassCondition: Record<TimeBasedConsumables, TranslationKeys> = {
      "Blossom Hourglass": "landscape.hourglass.resourceNodeCondition.blossom",
      "Gourmet Hourglass": "landscape.hourglass.resourceNodeCondition.gourmet",
      "Harvest Hourglass": "landscape.hourglass.resourceNodeCondition.harvest",
      "Orchard Hourglass": "landscape.hourglass.resourceNodeCondition.orchard",
      "Ore Hourglass": "landscape.hourglass.resourceNodeCondition.ore",
      "Timber Hourglass": "landscape.hourglass.resourceNodeCondition.timber",
      "Time Warp Totem": "landscape.timeWarpTotem.resourceNodeCondition",
      "Super Totem": "landscape.superTotem.resourceNodeCondition",
      "Fisher's Hourglass": "landscape.hourglass.resourceNodeCondition.fishers",
    };

    return t(hourglassCondition[hourglass], {
      selectedChestItem,
    });
  };

  if (isBudName(selectedChestItem)) {
    const budId = Number(selectedChestItem.split("-")[1]);
    const bud = buds[budId];

    return (
      <BudDetails
        bud={bud}
        budId={budId}
        actionView={
          onPlace && (
            <Button onClick={handlePlace} disabled={isSaving}>
              {isSaving ? t("saving") : t("place.map")}
            </Button>
          )
        }
      />
    );
  }

  return (
    <>
      <InventoryItemDetails
        game={state}
        details={{
          item: selectedChestItem,
        }}
        properties={{
          showOpenSeaLink: true,
        }}
        actionView={
          onPlace && (
            <Button onClick={handlePlace} disabled={isSaving}>
              {isSaving ? t("saving") : t("place.map")}
            </Button>
          )
        }
      />
      <ConfirmationModal
        show={confirmationModal}
        onHide={() => showConfirmationModal(false)}
        messages={
          selectedChestItem in RESOURCES
            ? [
                t("landscape.confirmation.resourceNodes.one"),
                t("landscape.confirmation.resourceNodes.two"),
              ]
            : [
                getResourceNodeCondition(
                  selectedChestItem as TimeBasedConsumables,
                ),
                t("landscape.confirmation.hourglass.one", {
                  selectedChestItem,
                }),
                t("landscape.confirmation.hourglass.two", {
                  selectedChestItem,
                }),
                selectedChestItem === "Time Warp Totem" ||
                selectedChestItem === "Super Totem" ? (
                  <Label type="danger" icon={SUNNYSIDE.icons.cancel}>
                    {t("landscape.timeWarpTotem.nonStack")}
                  </Label>
                ) : (
                  ""
                ),
              ]
        }
        onCancel={() => showConfirmationModal(false)}
        onConfirm={() => {
          onPlace && onPlace(selectedChestItem);
          closeModal();
          showConfirmationModal(false);
        }}
        confirmButtonLabel={t("place")}
      />
    </>
  );
};

interface Props {
  state: GameState;
  selected: InventoryItemName | BudName;
  onSelect: (name: InventoryItemName | BudName) => void;
  closeModal: () => void;
  onPlace?: (name: InventoryItemName) => void;
  onPlaceBud?: (bud: BudName) => void;
  onDepositClick?: () => void;
  isSaving?: boolean;
}

export const Chest: React.FC<Props> = ({
  state,
  selected,
  onSelect,
  closeModal,
  isSaving,
  onPlace,
  onPlaceBud,
  onDepositClick,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const buds = getChestBuds(state);

  const chestMap = getChestItems(state);
  const { t } = useAppTranslation();
  const collectibles = getKeys(chestMap)
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc, item) => {
        return { ...acc, [item]: chestMap[item] };
      },
      {} as Record<CollectibleName, Decimal>,
    );

  const getSelectedChestItems = (): InventoryItemName | BudName => {
    if (isBudName(selected)) {
      const budId = Number(selected.split("-")[1]);
      const bud = buds[budId];
      if (bud) return selected;
      if (getKeys(buds)[0]) return `Bud-${getKeys(buds)[0]}` as BudName;
      return getKeys(collectibles)[0];
    }

    // select first item in collectibles if the original selection is not in collectibles when they are all placed by the player
    const collectible = collectibles[selected as CollectibleName];
    if (collectible) return selected;
    return getKeys(collectibles)[0];
  };

  const selectedChestItem = getSelectedChestItems();

  const handleItemClick = (item: InventoryItemName | BudName) => {
    onSelect(item);
  };

  const chestIsEmpty =
    getKeys(collectibles).length === 0 && Object.values(buds).length === 0;

  if (chestIsEmpty) {
    return (
      <InnerPanel className="flex flex-col justify-evenly items-center px-2 !py-[50px]">
        <img
          src={SUNNYSIDE.npcs.synced}
          alt="Empty Chest"
          style={{
            width: `${PIXEL_SCALE * 17}px`,
          }}
        />
        <span className="text-xs text-center mt-2">
          {t("statements.empty.chest")}
        </span>
        {onDepositClick && (
          <p
            className="underline text-xxs text-center mt-2 cursor-pointer"
            onClick={() => {
              onDepositClick();
              closeModal();
            }}
          >
            {t("statements.wallet.to.inventory.transfer")}
          </p>
        )}
      </InnerPanel>
    );
  }

  // Sort collectibles by type
  const resources = getKeys(collectibles).filter((name) => name in RESOURCES);
  const buildings = getKeys(collectibles).filter((name) => name in BUILDINGS);
  const boosts = getKeys(collectibles)
    .filter(
      (name) =>
        name in COLLECTIBLE_BUFF_LABELS(state) &&
        (COLLECTIBLE_BUFF_LABELS(state)[name] ?? []).length > 0,
    )
    .filter((name) => !resources.includes(name) && !buildings.includes(name));
  const banners = getKeys(collectibles).filter((name) => name in BANNERS);
  const beds = getKeys(collectibles).filter((name) => name in BEDS);
  const weatherItems = getKeys(collectibles).filter(
    (name) => name in WEATHER_SHOP_ITEM_COSTS,
  );
  const decorations = getKeys(collectibles).filter(
    (name) =>
      !resources.includes(name) &&
      !buildings.includes(name) &&
      !boosts.includes(name) &&
      !banners.includes(name) &&
      !beds.includes(name) &&
      !weatherItems.includes(name),
  );

  const ITEM_GROUPS: {
    items: CollectibleName[];
    label: TranslationKeys;
    icon: string;
  }[] = [
    {
      items: resources,
      label: "resource.nodes",
      icon: SUNNYSIDE.resource.tree,
    },
    {
      items: buildings,
      label: "buildings",
      icon: SUNNYSIDE.icons.hammer,
    },
    {
      items: boosts,
      label: "boosts",
      icon: lightning,
    },
    {
      items: banners,
      label: "banners",
      icon: ITEM_DETAILS["Lifetime Farmer Banner"].image,
    },
    {
      items: beds,
      label: "beds",
      icon: ITEM_DETAILS["Basic Bed"].image,
    },
    {
      items: weatherItems,
      label: "weatherItems",
      icon: ITEM_DETAILS["Tornado Pinwheel"].image,
    },
    {
      items: decorations,
      label: "decorations",
      icon: ITEM_DETAILS["Basic Bear"].image,
    },
  ];

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showPanel={!!selectedChestItem}
      panel={
        <PanelContent
          state={state}
          selectedChestItem={selectedChestItem}
          closeModal={closeModal}
          onPlace={onPlace}
          onPlaceBud={onPlaceBud}
          isSaving={isSaving}
          buds={buds}
        />
      }
      content={
        <>
          {!!Object.values(buds).length && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Buds">
              <Label
                type="default"
                className="my-1"
                icon={SUNNYSIDE.icons.heart}
              >
                {t("buds")}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {getKeys(buds).map((budId) => {
                  const type = buds[budId].type;

                  return (
                    <Box
                      isSelected={selectedChestItem === `Bud-${budId}`}
                      key={`Bud-${budId}`}
                      onClick={() => handleItemClick(`Bud-${budId}`)}
                      image={`https://${imageDomain}.sunflower-land.com/images/${budId}.webp`}
                      iconClassName={classNames(
                        "scale-[1.8] origin-bottom absolute",
                        {
                          "top-1": type === "Retreat",

                          "left-1": type === "Plaza",
                        },
                      )}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* {Object.values(collectibles) && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Collectibles">
              <p className="mb-2">Collectibles</p>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {getKeys(collectibles).map((item) => (
                  <Box
                    count={chestMap[item]}
                    isSelected={selectedChestItem === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_ICONS[item] ?? ITEM_DETAILS[item].image}
                    parentDivRef={divRef}
                  />
                ))}
              </div>
            </div>
          )} */}

          {ITEM_GROUPS.map(({ items, label, icon }) => (
            <ItemGroup
              key={label}
              items={items}
              label={t(label)}
              icon={icon}
              chestMap={chestMap}
              selectedChestItem={selectedChestItem}
              onItemClick={handleItemClick}
              state={state}
              divRef={divRef}
            />
          ))}

          {onDepositClick && (
            <div className="flex w-full ml-1 my-1">
              <p
                className="underline text-xxs cursor-pointer"
                onClick={() => {
                  onDepositClick();
                  closeModal();
                }}
              >
                {t("statements.wallet.to.inventory.transfer")}
              </p>
            </div>
          )}
        </>
      }
    />
  );
};

interface ItemGroupProps {
  items: CollectibleName[];
  label: string;
  icon: string;
  chestMap: Record<string, Decimal>;
  selectedChestItem: string;
  onItemClick: (item: InventoryItemName | BudName) => void;
  state: GameState;
  divRef: React.RefObject<HTMLDivElement>;
}

const ItemGroup: React.FC<ItemGroupProps> = ({
  items,
  label,
  icon,
  chestMap,
  selectedChestItem,
  onItemClick,
  state,
  divRef,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col pl-2 mb-2 w-full">
      <Label type="default" className="my-1" icon={icon}>
        {label}
      </Label>
      <div className="flex mb-2 flex-wrap -ml-1.5">
        {items.map((item) => (
          <Box
            count={chestMap[item]}
            isSelected={selectedChestItem === item}
            key={item}
            onClick={() => onItemClick(item)}
            image={
              ITEM_ICONS(
                state.island.type,
                state.season.season,
                item in BUILDING_UPGRADES
                  ? state[
                      makeUpgradableBuildingKey(item as UpgradableBuildingType)
                    ].level
                  : undefined,
              )[item] ?? ITEM_DETAILS[item].image
            }
            parentDivRef={divRef}
          />
        ))}
      </div>
    </div>
  );
};
