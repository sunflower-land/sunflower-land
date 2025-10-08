import React, { useRef, useState } from "react";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { CollectibleName, getKeys } from "features/game/types/craftables";
import { getChestBuds, getChestItems, getChestPets } from "./utils/inventory";
import Decimal from "decimal.js-light";
import { Button } from "components/ui/Button";

import lightning from "assets/icons/lightning.png";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InventoryItemDetails } from "components/ui/layouts/InventoryItemDetails";

import { Bud } from "features/game/types/buds";
import { CONFIG } from "lib/config";
import { BudDetails } from "components/ui/layouts/BudDetails";
import classNames from "classnames";
import { RESOURCES } from "features/game/types/resources";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
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
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "features/game/events/landExpansion/upgradeBuilding";
import { LandBiomeName } from "features/island/biomes/biomes";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { WORKBENCH_MONUMENTS } from "features/game/types/monuments";
import { DOLLS } from "features/game/lib/crafting";
import { PET_TYPES, PetNFTs } from "features/game/types/pets";
import {
  LandscapingPlaceable,
  LandscapingPlaceableType,
} from "features/game/expansion/placeable/landscapingMachine";
import { PetNFTDetails } from "components/ui/layouts/PetNFTDetails";
import { getPetImage } from "features/island/pets/lib/petShared";
import { NFTName } from "features/game/events/landExpansion/placeNFT";

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

export const ITEM_ICONS: (
  season: TemperateSeasonName,
  biome: LandBiomeName,
  level?: number,
) => Partial<Record<InventoryItemName, string>> = (season, biome, level) => ({
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
  Tree: TREE_VARIANTS(biome, season, "Tree"),
  "Ancient Tree": TREE_VARIANTS(biome, season, "Ancient Tree"),
  "Sacred Tree": TREE_VARIANTS(biome, season, "Sacred Tree"),
  "Dirt Path": DIRT_PATH_VARIANTS[biome],
  Greenhouse: SUNNYSIDE.icons.greenhouseIcon,
  Bush: BUSH_VARIANTS[biome][season],
  "Water Well": WATER_WELL_VARIANTS[season][level ?? 1],
});

interface PanelContentProps {
  selectedChestItem?: LandscapingPlaceableType;
  closeModal: () => void;
  state: GameState;
  buds: Record<number, Bud>;
  pets: PetNFTs;
  onPlace?: (name: LandscapingPlaceable) => void;
  onPlaceNFT?: (id: string, nft: NFTName) => void;
  isSaving?: boolean;
}

export type TimeBasedConsumables =
  | HourglassType
  | "Time Warp Totem"
  | "Super Totem";

const PanelContent: React.FC<PanelContentProps> = ({
  isSaving,
  onPlace,
  onPlaceNFT,
  selectedChestItem,
  closeModal,
  state,
  buds,
  pets,
}) => {
  const { t } = useAppTranslation();

  const [confirmationModal, showConfirmationModal] = useState(false);

  if (!selectedChestItem) return null;

  const handlePlace = () => {
    if (
      selectedChestItem.name === "Gnome" ||
      selectedChestItem.name in EXPIRY_COOLDOWNS
    ) {
      showConfirmationModal(true);
    } else {
      selectedChestItem.name === "Bud" || selectedChestItem.name === "Pet"
        ? onPlaceNFT && onPlaceNFT(selectedChestItem.id, selectedChestItem.name)
        : onPlace && onPlace(selectedChestItem.name);
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
      selectedChestItem: selectedChestItem.name,
    });
  };

  if (selectedChestItem.name === "Bud") {
    const budId = Number(selectedChestItem.id);
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

  if (selectedChestItem.name === "Pet") {
    const petId = Number(selectedChestItem.id);
    const petData = pets[petId];

    return (
      <PetNFTDetails
        petData={petData}
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

  const redGnomeBoostInstruction = () => {
    return (
      <div className="flex flex-col gap-y-2 text-xs">
        <p>{t("landscape.confirmation.gnomes.one")}</p>
        <p>{t("landscape.confirmation.gnomes.two")}</p>

        <div className="flex justify-center mt-2 space-x-2">
          <img src={ITEM_DETAILS["Cobalt"].image} className="w-12" />
          <img src={ITEM_DETAILS["Gnome"].image} className="w-12" />
          <img src={ITEM_DETAILS["Clementine"].image} className="w-12" />
        </div>

        <div className="flex justify-center">
          <img src={ITEM_DETAILS["Crop Plot"].image} className="w-12" />
        </div>
      </div>
    );
  };

  return (
    <>
      <InventoryItemDetails
        game={state}
        details={{
          item: selectedChestItem.name,
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
          selectedChestItem.name === "Gnome"
            ? [redGnomeBoostInstruction()]
            : [
                getResourceNodeCondition(
                  selectedChestItem.name as TimeBasedConsumables,
                ),
                t("landscape.confirmation.hourglass.one", {
                  selectedChestItem: selectedChestItem.name,
                }),
                t("landscape.confirmation.hourglass.two", {
                  selectedChestItem: selectedChestItem.name,
                }),
                selectedChestItem.name === "Time Warp Totem" ||
                selectedChestItem.name === "Super Totem" ? (
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
          onPlace && onPlace(selectedChestItem.name);
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
  selected?: LandscapingPlaceableType;
  onSelect: (item: LandscapingPlaceableType) => void;
  closeModal: () => void;
  onPlace?: (name: LandscapingPlaceable) => void;
  onPlaceNFT?: (id: string, nft: NFTName) => void;
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
  onPlaceNFT,
  onDepositClick,
}: Props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const buds = getChestBuds(state);
  const petsNFTs = getChestPets(state.pets?.nfts ?? {});

  const chestMap = getChestItems(state);
  const { t } = useAppTranslation();
  const collectibles = getKeys(chestMap)
    .filter((item) => chestMap[item]?.gt(0))
    .sort((a, b) => a.localeCompare(b))
    .reduce(
      (acc, item) => {
        return { ...acc, [item]: chestMap[item] };
      },
      {} as Record<CollectibleName, Decimal>,
    );

  const getSelectedChestItems = (): LandscapingPlaceableType | undefined => {
    if (selected?.name === "Bud") {
      const budId = Number(selected.id);
      const bud = buds[budId];
      if (bud) return selected;
      if (getKeys(buds)[0])
        return { name: "Bud", id: String(getKeys(buds)[0]) };
      return { name: getKeys(collectibles)[0] };
    }

    if (selected?.name === "Pet") {
      const petId = Number(selected.id);
      const pet = petsNFTs[petId];
      if (pet) return selected;
      if (getKeys(petsNFTs)[0])
        return { name: "Pet", id: String(getKeys(petsNFTs)[0]) };
      return { name: getKeys(collectibles)[0] };
    }

    // select first item in collectibles if the original selection is not in collectibles when they are all placed by the player
    const collectible = collectibles[selected?.name as CollectibleName];
    if (collectible) return selected;
    return { name: getKeys(collectibles)[0] };
  };

  const selectedChestItem = getSelectedChestItems();

  const handleItemClick = (item: LandscapingPlaceableType) => {
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
  const monuments = getKeys(collectibles).filter(
    (name) => name in WORKBENCH_MONUMENTS,
  );
  const boosts = getKeys(collectibles)
    .filter(
      (name) =>
        name in COLLECTIBLE_BUFF_LABELS &&
        (
          COLLECTIBLE_BUFF_LABELS[name]?.({
            skills: state.bumpkin.skills,
            collectibles: state.collectibles,
          }) ?? []
        ).length > 0,
    )
    .filter(
      (name) =>
        !resources.includes(name) &&
        !buildings.includes(name) &&
        !monuments.includes(name),
    );

  const banners = getKeys(collectibles).filter((name) => name in BANNERS);
  const beds = getKeys(collectibles).filter((name) => name in BEDS);
  const weatherItems = getKeys(collectibles).filter(
    (name) => name in WEATHER_SHOP_ITEM_COSTS,
  );

  const dolls = getKeys(collectibles).filter((name) => name in DOLLS);

  const pets = getKeys(collectibles).filter((name) => name in PET_TYPES);

  const decorations = getKeys(collectibles).filter(
    (name) =>
      !resources.includes(name) &&
      !buildings.includes(name) &&
      !boosts.includes(name) &&
      !banners.includes(name) &&
      !beds.includes(name) &&
      !weatherItems.includes(name) &&
      !monuments.includes(name) &&
      !dolls.includes(name) &&
      !pets.includes(name),
  );

  const ITEM_GROUPS: {
    items: CollectibleName[];
    label: TranslationKeys;
    icon: string;
  }[] = [
    {
      items: pets,
      label: "pets",
      icon: SUNNYSIDE.icons.expression_confused,
    },
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
      items: monuments,
      label: "monuments",
      icon: ITEM_DETAILS["Farmer's Monument"].image,
    },
    {
      items: dolls,
      label: "dolls",
      icon: ITEM_DETAILS["Doll"].image,
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
          onPlaceNFT={onPlaceNFT}
          isSaving={isSaving}
          buds={buds}
          pets={petsNFTs}
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
                      isSelected={
                        selectedChestItem?.name === "Bud" &&
                        selectedChestItem?.id === String(budId)
                      }
                      key={`Bud-${budId}`}
                      onClick={() =>
                        handleItemClick({ name: "Bud", id: String(budId) })
                      }
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
          {!!Object.values(petsNFTs).length && (
            <div className="flex flex-col pl-2 mb-2 w-full" key="Buds">
              <Label
                type="default"
                className="my-1"
                icon={SUNNYSIDE.icons.heart}
              >
                {`Pet NFTs`}
              </Label>
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {getKeys(petsNFTs).map((petId) => {
                  const petImage = getPetImage("happy", petsNFTs[petId]);
                  return (
                    <Box
                      isSelected={
                        selectedChestItem?.name === "Pet" &&
                        selectedChestItem?.id === String(petId)
                      }
                      key={`Pet-${petId}`}
                      onClick={() =>
                        handleItemClick({ name: "Pet", id: String(petId) })
                      }
                      image={petImage}
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
  selectedChestItem?: LandscapingPlaceableType;
  onItemClick: (item: LandscapingPlaceableType) => void;
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
  if (items.length === 0 || !selectedChestItem) return null;

  const biome = getCurrentBiome(state.island);

  return (
    <div className="flex flex-col pl-2 mb-2 w-full">
      <Label type="default" className="my-1" icon={icon}>
        {label}
      </Label>
      <div className="flex mb-2 flex-wrap -ml-1.5">
        {items.map((item) => {
          const hasLevel = isBuildingUpgradable(item as BuildingName)
            ? state[makeUpgradableBuildingKey(item as UpgradableBuildingType)]
                .level
            : undefined;

          const image =
            ITEM_ICONS(state.season.season, biome, hasLevel)[item] ??
            ITEM_DETAILS[item].image;
          return (
            <Box
              count={chestMap[item]}
              isSelected={selectedChestItem?.name === item}
              key={item}
              onClick={() => onItemClick({ name: item })}
              image={image}
              parentDivRef={divRef}
            />
          );
        })}
      </div>
    </div>
  );
};
