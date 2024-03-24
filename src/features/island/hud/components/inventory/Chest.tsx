import React, { useRef } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { getChestBuds, getChestItems } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";
import chest from "assets/npcs/synced.gif";
import lightning from "assets/icons/lightning.png";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";

import marketIcon from "assets/buildings/market_icon.png";
import firePitIcon from "assets/buildings/fire_pit_icon.png";
import workbenchIcon from "assets/buildings/workbench_icon.png";
import kitchenIcon from "assets/buildings/kitchen_icon.png";
import henHouseIcon from "assets/buildings/hen_house_icon.png";
import bakeryIcon from "assets/buildings/bakery_icon.png";
import deliIcon from "assets/buildings/deli_icon.png";
import smoothieIcon from "assets/buildings/smoothie_shack_icon.png";
import toolshedIcon from "assets/buildings/toolshed_icon.png";
import warehouseIcon from "assets/buildings/warehouse_icon.png";
import { BudName, isBudName } from "features/game/types/buds";
import { CONFIG } from "lib/config";
import { BudDetails } from "components/ui/layouts/BudDetails";
import classNames from "classnames";
import { RESOURCES } from "features/game/types/resources";
import { BUILDINGS } from "features/game/types/buildings";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

export const ITEM_ICONS: Partial<Record<InventoryItemName, string>> = {
  Market: marketIcon,
  "Fire Pit": firePitIcon,
  Workbench: workbenchIcon,
  Kitchen: kitchenIcon,
  "Hen House": henHouseIcon,
  Bakery: bakeryIcon,
  Deli: deliIcon,
  "Smoothie Shack": smoothieIcon,
  Toolshed: toolshedIcon,
  Warehouse: warehouseIcon,
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
    .reduce((acc, item) => {
      return { ...acc, [item]: chestMap[item] };
    }, {} as Record<CollectibleName, Decimal>);

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

  const handlePlace = () => {
    if (isBudName(selectedChestItem)) {
      onPlaceBud && onPlaceBud(selectedChestItem);
    } else {
      onPlace && onPlace(selectedChestItem);
    }

    closeModal();
  };

  const handleItemClick = (item: InventoryItemName | BudName) => {
    onSelect(item);
  };

  const chestIsEmpty =
    getKeys(collectibles).length === 0 && Object.values(buds).length === 0;

  if (chestIsEmpty) {
    return (
      <div className="flex flex-col justify-evenly items-center p-2">
        <img
          src={chest}
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
      </div>
    );
  }

  const PanelContent: React.FC = () => {
    const { t } = useAppTranslation();
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
                {isSaving ? t("saving") : "Place on map"}
              </Button>
            )
          }
        />
      );
    }

    return (
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
    );
  };

  // Sort collectibles by type
  const resources = getKeys(collectibles).filter((name) => name in RESOURCES);
  const buildings = getKeys(collectibles).filter((name) => name in BUILDINGS);
  const boosts = getKeys(collectibles).filter(
    (name) => name in COLLECTIBLE_BUFF_LABELS
  );
  const decorations = getKeys(collectibles).filter(
    (name) =>
      !resources.includes(name) &&
      !buildings.includes(name) &&
      !boosts.includes(name)
  );

  return (
    <SplitScreenView
      divRef={divRef}
      tallMobileContent={true}
      wideModal={true}
      showPanel={!!selectedChestItem}
      panel={<PanelContent />}
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
                        }
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

          {resources.length > 0 && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Resources">
              <Label
                type="default"
                className="my-1"
                icon={SUNNYSIDE.resource.tree}
              >
                {t("resources")}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {resources.map((item) => (
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
          )}

          {buildings.length > 0 && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Buildings">
              <Label
                type="default"
                className="my-1"
                icon={SUNNYSIDE.icons.hammer}
              >
                {t("buildings")}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {buildings.map((item) => (
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
          )}

          {boosts.length > 0 && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Boosts">
              <Label type="default" className="my-1" icon={lightning}>
                {t("boosts")}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {boosts.map((item) => (
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
          )}

          {decorations.length > 0 && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Decorations">
              <Label type="default" className="my-1">
                {t("decorations")}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {decorations.map((item) => (
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
          )}

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
