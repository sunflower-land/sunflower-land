import React, { useContext, useLayoutEffect, useState, type JSX } from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router";
import { Context } from "features/game/GameProvider";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { Hud } from "features/island/hud/Hud";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { useVisiting } from "lib/utils/visitUtils";
import { Placeable } from "features/game/expansion/placeable/Placeable";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Collectible } from "features/island/collectibles/Collectible";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { PET_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { PetNFT } from "features/island/pets/PetNFT";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { PetHouseModal } from "features/island/buildings/components/building/petHouse/PetHouseModal";

import followIcon from "assets/icons/follow.webp";

export const PET_HOUSE_IMAGES: Record<
  number,
  { src: string; height: number; width: number }
> = {
  1: { src: SUNNYSIDE.land.pet_house_inside_one, height: 128, width: 128 },
  2: { src: SUNNYSIDE.land.pet_house_inside_two, height: 160, width: 160 },
  3: { src: SUNNYSIDE.land.pet_house_inside_three, height: 192, width: 192 },
};

const _petHouse = (state: MachineState) => state.context.state.petHouse;
const _landscaping = (state: MachineState) => state.matches("landscaping");
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _petHousePets = (state: MachineState) =>
  state.context.state.petHouse?.pets ?? {};
const _biome = (state: MachineState) =>
  getCurrentBiome(state.context.state.island);

export const PetHouseInside: React.FC = () => {
  const { isVisiting } = useVisiting();
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);

  const petHouse = useSelector(gameService, _petHouse);
  const landscaping = useSelector(gameService, _landscaping);
  const petNFTs = useSelector(gameService, _petNFTs);
  const pets = useSelector(gameService, _petHousePets);
  const biome = useSelector(gameService, _biome);

  const level = petHouse.level;
  const nextLevel = Math.min(level + 1, 3);

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gameGrid = getGameGrid({
    cropPositions: [],
    collectiblePositions: [],
  });

  const { src: image, height, width } = PET_HOUSE_IMAGES[level];
  const bounds = PET_HOUSE_BOUNDS[level];
  const halfTile = 0.5 * GRID_WIDTH_PX;

  const gameboardDimensions = {
    x: 84,
    y: 56,
  };

  // Build map placements for pets
  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...getKeys(pets)
      .filter((name) => pets[name])
      .flatMap((name) => {
        const items = pets[name]!;
        return items
          .filter((pet) => pet.coordinates)
          .map((pet, index) => {
            const { readyAt, createdAt, coordinates, id } = pet;
            const { x, y } = coordinates!;
            const dimensions = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`pet-${name}-${id}`}
                x={x}
                y={y}
                height={dimensions?.height ?? 1}
                width={dimensions?.width ?? 1}
                z={1}
              >
                <Collectible
                  index={index}
                  location="petHouse"
                  name={name}
                  id={id}
                  readyAt={readyAt ?? 0}
                  createdAt={createdAt ?? 0}
                  x={coordinates!.x}
                  y={coordinates!.y}
                  grid={gameGrid}
                  flipped={pet.flipped}
                />
              </MapPlacement>
            );
          });
      }),
  );

  // Build map placements for pet NFTs
  mapPlacements.push(
    ...Object.entries(petNFTs)
      .filter(
        ([, petNFT]) => !!petNFT.coordinates && petNFT.location === "petHouse",
      )
      .flatMap(([id, petNFT]) => {
        const { x, y } = petNFT.coordinates!;

        return (
          <MapPlacement
            key={`petNFT-${id}`}
            x={x}
            y={y}
            height={2}
            width={2}
            z={1}
          >
            <PetNFT id={id} x={x} y={y} location="petHouse" />
          </MapPlacement>
        );
      }),
  );

  return (
    <>
      <UpgradeBuildingModal
        buildingName="Pet House"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <PetHouseModal
        show={showPetModal}
        onClose={() => setShowPetModal(false)}
      />

      <div
        className="absolute bg-[#181425]"
        style={{
          width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
          height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
          imageRendering: "pixelated",
          backgroundImage: `url(${EXTERIOR_ISLAND_BG[biome]})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={classNames("relative w-full h-full")}>
            {/* Grid overlay for landscaping mode — aligned with bounds coordinate system, offset down 2 tiles */}
            <div
              className={classNames(
                `absolute transition-opacity pointer-events-none z-10`,
                {
                  "opacity-0": !landscaping,
                  "opacity-100": landscaping,
                },
              )}
              style={{
                // Position grid relative to center, aligned with bounds coordinate system
                // MapPlacement uses: left: calc(50% + ${GRID_WIDTH_PX * x}px), top: calc(50% - ${GRID_WIDTH_PX * y}px)
                // Top of bounds is bounds.y + bounds.height (since y increases upward)
                top: `calc(50% - ${GRID_WIDTH_PX * (bounds.y + bounds.height)}px)`,
                left: `calc(50% + ${GRID_WIDTH_PX * bounds.x}px)`,

                height: `${bounds.height * GRID_WIDTH_PX}px`,
                width: `${bounds.width * GRID_WIDTH_PX}px`,

                backgroundSize: `${GRID_WIDTH_PX}px ${GRID_WIDTH_PX}px`,
                backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 17%) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 17%) 1px, transparent 1px)`,
              }}
            />

            {landscaping && <Placeable location="petHouse" />}

            <img
              src={image}
              id={Section.GenesisBlock}
              className="relative z-0"
              style={{
                width: `${width * PIXEL_SCALE}px`,
                height: `${height * PIXEL_SCALE}px`,
                left: `${halfTile}px`,
              }}
            />

            {/* Render placed pets */}
            {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
          </div>
          {!landscaping && !isVisiting && (
            <>
              <Button
                className={`absolute -bottom-16 left-[18px]`}
                onClick={() => navigate("/")}
              >
                {t("exit")}
              </Button>

              <div
                className="absolute cursor-pointer z-10 hover:img-highlight"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                  height: `${PIXEL_SCALE * 19}px`,
                  right: `${-5 * PIXEL_SCALE}px`,
                  top: `${-20 * PIXEL_SCALE}px`,
                }}
                onClick={() => setShowPetModal(true)}
              >
                <img className="w-full" src={SUNNYSIDE.icons.disc} />
                <img
                  className="absolute"
                  src={followIcon}
                  style={{
                    width: `${PIXEL_SCALE * 10}px`,
                    right: `${PIXEL_SCALE * 4}px`,
                    top: `${PIXEL_SCALE * 4}px`,
                  }}
                />
              </div>

              <img
                src={SUNNYSIDE.icons.upgrade_disc}
                alt="Upgrade Building"
                className="absolute cursor-pointer z-10"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                  left: `${9 * PIXEL_SCALE}px`,
                  top: `${-20 * PIXEL_SCALE}px`,
                }}
                onClick={() => setShowUpgradeModal(true)}
              />
            </>
          )}
          {!landscaping && isVisiting && (
            <Button
              className={`absolute -bottom-16 left-[18px]`}
              onClick={() =>
                navigate(`/visit/${gameService.state.context.farmId}`)
              }
            >
              {t("exit")}
            </Button>
          )}
        </div>
      </div>

      {!landscaping && !isVisiting && <Hud isFarming location="petHouse" />}
      {landscaping && <LandscapingHud location="petHouse" />}
      {isVisiting && <VisitingHud />}
    </>
  );
};
