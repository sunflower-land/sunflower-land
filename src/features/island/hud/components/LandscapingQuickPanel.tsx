import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActor, useSelector } from "@xstate/react";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";
import {
  LandscapingPlaceable,
  LandscapingPlaceableType,
  MachineInterpreter,
  placeEvent,
} from "features/game/expansion/placeable/landscapingMachine";
import { PlaceableLocation } from "features/game/types/collectibles";
import { getKeys } from "lib/object";
import {
  getChestBuds,
  getChestFarmHands,
  getChestItems,
  getChestPets,
} from "./inventory/utils/inventory";
import { RESOURCES, ResourceName } from "features/game/types/resources";
import {
  BUILDINGS,
  BUILDINGS_DIMENSIONS,
  BuildingName,
} from "features/game/types/buildings";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BANNERS } from "features/game/types/banners";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { MONUMENTS, REWARD_ITEMS } from "features/game/types/monuments";
import { DOLLS } from "features/game/lib/crafting";
import { PET_TYPES, isPetNFTRevealed } from "features/game/types/pets";
import { WEATHER_SHOP_ITEM_COSTS } from "features/game/types/calendar";
import { Box, BoxProps } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import { isMobile } from "mobile-device-detect";
import { ITEM_ICONS } from "./inventory/Chest";
import { getCurrentBiome } from "features/island/biomes/biomes";
import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "features/game/events/landExpansion/upgradeBuilding";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { getBudImage } from "lib/buds/types";
import { getPetImage } from "features/island/pets/lib/petShared";
import {
  needsPlacementConfirmation,
  PlacementConfirmationModal,
} from "features/game/expansion/placeable/PlacementConfirmationModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NFTName } from "features/game/events/landExpansion/placeNFT";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { PIXEL_SCALE, GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { useNow } from "lib/utils/hooks/useNow";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { SquareIcon } from "components/ui/SquareIcon";
import { useSound } from "lib/utils/hooks/useSound";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

type TabId =
  | "nfts"
  | "resources"
  | "buildings"
  | "boosts"
  | "projects"
  | "decorations";

// Persists scroll position across panel unmount/remount (item select → place → idle)
let _savedScrollLeft = 0;
let _savedPage = 0;

const TWO_ROW_HEIGHT_PX = PIXEL_SCALE * (13.7 + 4 + 3 + 2) * 2 + 8;

const DRAG_THRESHOLD_PX = 8;

const MOBILE_ITEMS_PER_PAGE = 10;

const ALL_DIMENSIONS: Record<string, { width: number; height: number }> = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
  ...RESOURCE_DIMENSIONS,
  Bud: { width: 1, height: 1 },
  Pet: { width: 2, height: 2 },
  FarmHand: { width: 1, height: 1 },
};

const getItemDims = (name: string) =>
  ALL_DIMENSIONS[name] ?? { width: 1, height: 1 };

interface DragOrigin {
  startX: number;
  startY: number;
  item: LandscapingPlaceableType;
  activated: boolean;
}

interface Props {
  location: PlaceableLocation;
  onQuickDragChange: (active: boolean) => void;
}

export const LandscapingQuickPanel: React.FC<Props> = ({
  location,
  onQuickDragChange,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const state = gameState.context.state;
  const now = useNow();
  const tabSound = useSound("tab");

  const child = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const isIdle = useSelector(child, (s) => s.matches({ editing: "idle" }));
  const movingItem = useSelector(child, (s) => s.context.moving);

  const [activeTab, setActiveTab] = useState<TabId>("decorations");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(_savedPage);
  const [pendingDragPlacement, setPendingDragPlacement] = useState<{
    gridX: number;
    gridY: number;
    item: LandscapingPlaceableType;
  } | null>(null);

  // ── Quick drag-and-drop state ──────────────────────────────────────────
  const dragRef = useRef<DragOrigin | null>(null);
  const wasDragRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Restore horizontal scroll position after item placement remounts the panel
  useEffect(() => {
    if (_savedScrollLeft > 0 && scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      requestAnimationFrame(() => {
        el.scrollLeft = _savedScrollLeft;
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const computeGridPos = useCallback((clientX: number, clientY: number) => {
    // Use the actual land center (GenesisBlock element) as the coordinate origin,
    // not the viewport center. When the player scrolls, the land shifts away from
    // the viewport center, so window.innerWidth/2 would give wrong grid coords.
    const land = document
      .getElementById(Section.GenesisBlock)
      ?.getBoundingClientRect();
    const landCenterX = (land?.left ?? 0) + (land?.width ?? 0) / 2;
    const landCenterY = (land?.top ?? 0) + (land?.height ?? 0) / 2;

    return {
      gridX: Math.round((clientX - landCenterX) / GRID_WIDTH_PX),
      gridY: Math.round(-(clientY - landCenterY) / GRID_WIDTH_PX),
    };
  }, []);

  useEffect(() => {
    const sendSelect = (
      item: LandscapingPlaceableType,
      loc: PlaceableLocation,
      freshChild: MachineInterpreter,
    ) => {
      if (item.name === "Bud" || item.name === "Pet") {
        freshChild.send("SELECT", {
          action: "nft.placed",
          placeable: {
            id: (item as { id: string; name: NFTName }).id,
            name: item.name as NFTName,
          },
          requirements: { coins: 0, ingredients: {} },
          collisionDetected: false,
          location: loc,
        } as any);
      } else if (item.name === "FarmHand") {
        freshChild.send("SELECT", {
          placeable: {
            name: "FarmHand",
            id: (item as { id: string }).id,
          },
          action: "farmHand.placed",
          requirements: { coins: 0, ingredients: {} },
          collisionDetected: false,
        } as any);
      } else {
        freshChild.send("SELECT", {
          action: placeEvent(item.name as LandscapingPlaceable, loc),
          placeable: { name: item.name as LandscapingPlaceable },
          requirements: { coins: 0, ingredients: {} },
          collisionDetected: false,
          multiple: false,
        } as any);
      }
    };

    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      if (!drag.activated) {
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

        // Only activate from idle state
        const freshChild = gameService.getSnapshot().children
          .landscaping as MachineInterpreter;
        const machineState = freshChild.getSnapshot();
        if (!machineState.matches({ editing: "idle" })) {
          dragRef.current = null;
          return;
        }

        drag.activated = true;
        wasDragRef.current = true;
        _savedScrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
        sendSelect(drag.item, location, freshChild);
        freshChild.send("DRAG");
        onQuickDragChange(true);
      }

      const { gridX, gridY } = computeGridPos(e.clientX, e.clientY);
      const snap = gameService.getSnapshot().context.state;
      const dims = getItemDims(drag.item.name);
      const collision = detectCollision({
        state: snap,
        position: { x: gridX, y: gridY, ...dims },
        location,
        name: drag.item.name as CollectibleName,
      });

      const freshChild = gameService.getSnapshot().children
        .landscaping as MachineInterpreter;
      freshChild.send({
        type: "UPDATE",
        coordinates: { x: gridX, y: gridY },
        collisionDetected: collision,
      });
    };

    const handleUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      dragRef.current = null;

      if (!drag?.activated) return;

      const { gridX, gridY } = computeGridPos(e.clientX, e.clientY);
      const snap = gameService.getSnapshot().context.state;
      const dims = getItemDims(drag.item.name);
      const collision = detectCollision({
        state: snap,
        position: { x: gridX, y: gridY, ...dims },
        location,
        name: drag.item.name as CollectibleName,
      });

      // Confirmation-required items: stay in dragging state and show modal.
      // The ghost remains visible at the drop position while the user decides.
      if (!collision && needsPlacementConfirmation(drag.item.name)) {
        const freshChild = gameService.getSnapshot().children
          .landscaping as MachineInterpreter;
        freshChild.send({
          type: "UPDATE",
          coordinates: { x: gridX, y: gridY },
          collisionDetected: false,
        });
        setPendingDragPlacement({ gridX, gridY, item: drag.item });
        return;
      }

      const freshChild = gameService.getSnapshot().children
        .landscaping as MachineInterpreter;

      // DROP transitions from dragging → placing
      freshChild.send("DROP");

      if (collision) {
        freshChild.send("BACK");
      } else {
        freshChild.send({
          type: "UPDATE",
          coordinates: { x: gridX, y: gridY },
          collisionDetected: false,
        });
        freshChild.send({ type: "PLACE", location } as any);
      }

      onQuickDragChange(false);
    };

    const handleCancel = () => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag?.activated) return;
      onQuickDragChange(false);
      const freshChild = gameService.getSnapshot().children
        .landscaping as MachineInterpreter;
      freshChild.send("DROP");
      freshChild.send("BACK");
    };

    window.addEventListener("pointermove", handleMove, { capture: true });
    window.addEventListener("pointerup", handleUp, { capture: true });
    window.addEventListener("pointercancel", handleCancel, { capture: true });
    return () => {
      window.removeEventListener("pointermove", handleMove, { capture: true });
      window.removeEventListener("pointerup", handleUp, { capture: true });
      window.removeEventListener("pointercancel", handleCancel, {
        capture: true,
      });
    };
  }, [location, gameService, onQuickDragChange, computeGridPos]);

  const handleDragStart = useCallback(
    (e: React.PointerEvent, item: LandscapingPlaceableType) => {
      e.stopPropagation();
      wasDragRef.current = false;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        item,
        activated: false,
      };
    },
    [],
  );

  // ── Chest inventory ────────────────────────────────────────────────────
  const buds = getChestBuds(state);
  const petsNFTs = getChestPets(state.pets?.nfts ?? {});
  const farmHands = getChestFarmHands(state.farmHands);
  const chestMap = getChestItems(state);
  const biome = useMemo(() => getCurrentBiome(state.island), [state.island]);

  const collectibleNames = useMemo(
    () => getKeys(chestMap).filter((item) => chestMap[item]?.gt(0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chestMap],
  );

  // ── Group items ────────────────────────────────────────────────────────
  const resources = collectibleNames.filter((name) => name in RESOURCES);
  const buildings = collectibleNames.filter((name) => name in BUILDINGS);
  const monuments = collectibleNames.filter((name) => name in MONUMENTS);
  const villageProjects = collectibleNames.filter(
    (name) => name in REWARD_ITEMS,
  );
  const banners = collectibleNames.filter((name) => name in BANNERS);
  const beds = collectibleNames.filter((name) => name in BED_FARMHAND_COUNT);
  const weatherItems = collectibleNames.filter(
    (name) => name in WEATHER_SHOP_ITEM_COSTS,
  );
  const dolls = collectibleNames.filter((name) => name in DOLLS);
  const pets = collectibleNames.filter((name) => name in PET_TYPES);

  const resourcesSet = new Set(resources);
  const buildingsSet = new Set(buildings);
  const monumentsSet = new Set(monuments);
  const villageProjectsSet = new Set(villageProjects);
  const bedsSet = new Set(beds);
  const bannersSet = new Set(banners);
  const weatherItemsSet = new Set(weatherItems);
  const dollsSet = new Set(dolls);
  const petsSet = new Set(pets);

  const boosts = collectibleNames
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
        !resourcesSet.has(name) &&
        !buildingsSet.has(name) &&
        !monumentsSet.has(name) &&
        !villageProjectsSet.has(name) &&
        !bedsSet.has(name),
    );

  const boostsSet = new Set(boosts);

  const decorations = collectibleNames.filter(
    (name) =>
      !resourcesSet.has(name) &&
      !buildingsSet.has(name) &&
      !boostsSet.has(name) &&
      !bannersSet.has(name) &&
      !bedsSet.has(name) &&
      !weatherItemsSet.has(name) &&
      !monumentsSet.has(name) &&
      !dollsSet.has(name) &&
      !petsSet.has(name) &&
      !villageProjectsSet.has(name),
  );

  // ── Tab definitions ────────────────────────────────────────────────────
  const tabs: {
    id: TabId;
    label: string;
    emptyLabel: string;
    icon: string;
    farmOnly?: boolean;
    hasItems: boolean;
  }[] = [
    {
      id: "resources",
      label: t("resources"),
      emptyLabel: "No resources available.",
      icon: SUNNYSIDE.resource.tree,
      farmOnly: true,
      hasItems: resources.length > 0,
    },
    {
      id: "buildings",
      label: t("buildings"),
      emptyLabel: "No buildings available.",
      icon: SUNNYSIDE.icons.hammer,
      farmOnly: true,
      hasItems: buildings.length > 0,
    },
    {
      id: "boosts",
      label: t("boosts"),
      emptyLabel: "No boosts available.",
      icon: lightning,
      hasItems: boosts.length > 0 || weatherItems.length > 0 || beds.length > 0,
    },
    {
      id: "decorations",
      label: t("decorations"),
      emptyLabel: "No decorations available.",
      icon: ITEM_DETAILS["Basic Bear"].image,
      hasItems:
        banners.length > 0 ||
        dolls.length > 0 ||
        pets.length > 0 ||
        decorations.length > 0,
    },
    {
      id: "projects",
      label: "Projects",
      emptyLabel: "No projects available.",
      icon: ITEM_DETAILS["Farmer's Monument"].image,
      farmOnly: true,
      hasItems: monuments.length > 0 || villageProjects.length > 0,
    },
    {
      id: "nfts",
      label: "NFTs",
      emptyLabel: "No NFTs available.",
      icon: SUNNYSIDE.icons.heart,
      hasItems:
        Object.keys(buds).length > 0 ||
        Object.keys(petsNFTs).length > 0 ||
        Object.keys(farmHands).length > 0,
    },
  ];

  const visibleTabs = tabs.filter(
    (tab) => !tab.farmOnly || location === "farm",
  );

  // ── Placement helpers ──────────────────────────────────────────────────
  const doPlace = (item: LandscapingPlaceableType) => {
    if (item.name === "Bud" || item.name === "Pet") {
      child.send("SELECT", {
        action: "nft.placed",
        placeable: { id: item.id, name: item.name as NFTName },
        location,
      });
    } else if (item.name === "FarmHand") {
      child.send("SELECT", {
        placeable: { name: "FarmHand", id: item.id },
        action: "farmHand.placed",
        requirements: { coins: 0, ingredients: {} },
      });
    } else {
      child.send("SELECT", {
        action: placeEvent(item.name as LandscapingPlaceable, location),
        placeable: { name: item.name as LandscapingPlaceable },
        multiple: true,
      });
    }
  };

  const handleClick = (item: LandscapingPlaceableType) => {
    if (wasDragRef.current) {
      wasDragRef.current = false;
      return;
    }
    _savedScrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
    _savedPage = currentPage;
    doPlace(item);
  };

  // ── Image resolver ─────────────────────────────────────────────────────
  const getItemImage = (name: CollectibleName) => {
    const level = isBuildingUpgradable(name as BuildingName)
      ? state[makeUpgradableBuildingKey(name as UpgradableBuildingType)].level
      : undefined;
    return (
      ITEM_ICONS(state.season.season, biome, level)[name] ??
      ITEM_DETAILS[name]?.image
    );
  };

  // ── Items for the active tab ───────────────────────────────────────────
  const items = useMemo(() => {
    const wrapBox = (
      key: string,
      item: LandscapingPlaceableType,
      boxNode: React.ReactElement<BoxProps>,
    ) =>
      React.cloneElement(boxNode, {
        key,
        style: { touchAction: "none" },
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) =>
          handleDragStart(e, item),
      });

    switch (activeTab) {
      case "nfts":
        return [
          ...getKeys(buds).map((budId) => {
            const image = getBudImage(Number(budId));
            const item: LandscapingPlaceableType = {
              name: "Bud",
              id: String(budId),
            };
            return wrapBox(
              `bud-${budId}`,
              item,
              <Box
                image={image}
                iconClassName={classNames(
                  "scale-[1.8] origin-bottom absolute",
                  {
                    "top-1": buds[budId].type === "Retreat",
                    "left-1": buds[budId].type === "Plaza",
                  },
                )}
                onClick={() => handleClick(item)}
              />,
            );
          }),
          ...getKeys(petsNFTs).map((petId) => {
            const revealed = isPetNFTRevealed(Number(petId), now);
            const image = getPetImage("happy", Number(petId));
            const item: LandscapingPlaceableType = {
              name: "Pet",
              id: String(petId),
            };
            return wrapBox(
              `pet-${petId}`,
              item,
              <Box
                image={image}
                className={!revealed ? "opacity-50" : ""}
                onClick={() => {
                  if (!revealed) return;
                  handleClick(item);
                }}
              />,
            );
          }),
          ...Object.keys(farmHands).map((id) => {
            const image = SUNNYSIDE.achievement.farmHand;
            const item: LandscapingPlaceableType = { name: "FarmHand", id };
            return wrapBox(
              `farmhand-${id}`,
              item,
              <Box image={image} onClick={() => handleClick(item)}>
                <NPCPlaceable
                  parts={farmHands[id].equipped}
                  width={PIXEL_SCALE * 12}
                />
              </Box>,
            );
          }),
        ];

      case "resources":
        return resources.map((name) => {
          const image = getItemImage(name as CollectibleName);
          const item: LandscapingPlaceableType = {
            name: name as CollectibleName | BuildingName | ResourceName,
          };
          return wrapBox(
            name,
            item,
            <Box
              count={chestMap[name]}
              image={image}
              onClick={() => handleClick(item)}
            />,
          );
        });

      case "buildings":
        return buildings.map((name) => {
          const image = getItemImage(name as CollectibleName);
          const item: LandscapingPlaceableType = {
            name: name as CollectibleName | BuildingName | ResourceName,
          };
          return wrapBox(
            name,
            item,
            <Box
              count={chestMap[name]}
              image={image}
              onClick={() => handleClick(item)}
            />,
          );
        });

      case "boosts":
        return [...boosts, ...weatherItems, ...beds].map((name) => {
          const image = getItemImage(name as CollectibleName);
          const item: LandscapingPlaceableType = {
            name: name as CollectibleName | BuildingName | ResourceName,
          };
          return wrapBox(
            name,
            item,
            <Box
              count={chestMap[name]}
              image={image}
              onClick={() => handleClick(item)}
            />,
          );
        });

      case "projects":
        return [...monuments, ...villageProjects].map((name) => {
          const image = getItemImage(name as CollectibleName);
          const item: LandscapingPlaceableType = {
            name: name as CollectibleName | BuildingName | ResourceName,
          };
          return wrapBox(
            name,
            item,
            <Box
              count={chestMap[name]}
              image={image}
              onClick={() => handleClick(item)}
            />,
          );
        });

      case "decorations":
        return [...banners, ...dolls, ...pets, ...decorations].map((name) => {
          const image = getItemImage(name as CollectibleName);
          const item: LandscapingPlaceableType = {
            name: name as CollectibleName | BuildingName | ResourceName,
          };
          return wrapBox(
            name,
            item,
            <Box
              count={chestMap[name]}
              image={image}
              onClick={() => handleClick(item)}
            />,
          );
        });

      default:
        return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, chestMap, buds, petsNFTs, farmHands, now]);

  const totalPages = Math.ceil(items.length / MOBILE_ITEMS_PER_PAGE);
  const pagedItems = isMobile
    ? items.slice(
        currentPage * MOBILE_ITEMS_PER_PAGE,
        (currentPage + 1) * MOBILE_ITEMS_PER_PAGE,
      )
    : items;

  return (
    <>
      {isIdle && !(isMobile && movingItem) && (
        <div
          className="absolute bottom-0 left-0 right-0"
          data-prevent-drag-scroll
          style={{ zIndex: 49 }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center">
              <img src={SUNNYSIDE.icons.drag} className="h-4 mr-1" />
              <span className="text-white text-xs">
                {"Quick drag and drop"}
              </span>
            </div>
            <img
              src={
                isCollapsed
                  ? SUNNYSIDE.icons.chevron_up
                  : SUNNYSIDE.icons.chevron_down
              }
              className="h-4 cursor-pointer"
              onClick={() => setIsCollapsed((c) => !c)}
            />
          </div>

          {!isCollapsed && (
            <OuterPanel hasTabs className="relative !rounded-none">
              {/* Tab bar */}
              <div
                className="absolute flex"
                style={{
                  top: `${PIXEL_SCALE * 1}px`,
                  left: 0,
                  right: `${PIXEL_SCALE * 1}px`,
                }}
              >
                <div className="flex overflow-x-auto scrollbar-hide">
                  {visibleTabs.map((tab, index) => (
                    <Tab
                      key={tab.id}
                      isFirstTab={index === 0}
                      className="relative mr-1"
                      isActive={activeTab === tab.id}
                      onClick={() => {
                        tabSound.play();
                        setActiveTab(tab.id);
                        setCurrentPage(0);
                        _savedScrollLeft = 0;
                        _savedPage = 0;
                      }}
                    >
                      <SquareIcon icon={tab.icon} width={7} />
                      {!isMobile && (
                        <span className="text-xs sm:text-sm ml-1 whitespace-nowrap">
                          {tab.label}
                        </span>
                      )}
                    </Tab>
                  ))}
                </div>
              </div>

              {/* Item grid */}
              <InnerPanel>
                <div
                  ref={scrollContainerRef}
                  className={classNames("flex items-center", {
                    "overflow-x-auto scrollable overflow-y-hidden pb-1":
                      !isMobile,
                  })}
                  style={{ height: `${TWO_ROW_HEIGHT_PX}px` }}
                >
                  {isMobile && totalPages > 1 && (
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className={classNames("h-6 flex-shrink-0 mr-1", {
                        "opacity-30 pointer-events-none": currentPage === 0,
                        "cursor-pointer": currentPage > 0,
                      })}
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    />
                  )}

                  <div
                    className={
                      isMobile ? "flex-1 overflow-hidden h-full" : "h-full"
                    }
                  >
                    {pagedItems.length > 0 ? (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateRows: "1fr 1fr",
                          gridAutoFlow: "column",
                          gridAutoColumns: "max-content",
                          alignItems: "start",
                          height: "100%",
                          width: isMobile ? undefined : "max-content",
                        }}
                      >
                        {pagedItems}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center px-4">
                        <span className="text-xs">
                          {
                            visibleTabs.find((tab) => tab.id === activeTab)
                              ?.emptyLabel
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {isMobile && totalPages > 1 && (
                    <img
                      src={SUNNYSIDE.icons.arrow_right}
                      className={classNames("h-6 flex-shrink-0 ml-1", {
                        "opacity-30 pointer-events-none":
                          currentPage >= totalPages - 1,
                        "cursor-pointer": currentPage < totalPages - 1,
                      })}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                    />
                  )}
                </div>
              </InnerPanel>
            </OuterPanel>
          )}
        </div>
      )}

      {pendingDragPlacement && (
        <PlacementConfirmationModal
          itemName={pendingDragPlacement.item.name}
          onCancel={() => {
            const freshChild = gameService.getSnapshot().children
              .landscaping as MachineInterpreter;
            freshChild.send("DROP");
            freshChild.send("BACK");
            onQuickDragChange(false);
            setPendingDragPlacement(null);
          }}
          onConfirm={() => {
            const { gridX, gridY } = pendingDragPlacement;
            const freshChild = gameService.getSnapshot().children
              .landscaping as MachineInterpreter;
            freshChild.send("DROP");
            freshChild.send({
              type: "UPDATE",
              coordinates: { x: gridX, y: gridY },
              collisionDetected: false,
            });
            freshChild.send({ type: "PLACE", location } as any);
            onQuickDragChange(false);
            setPendingDragPlacement(null);
          }}
        />
      )}
    </>
  );
};
