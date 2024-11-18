import React, { useContext, useLayoutEffect, useState, useMemo } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router-dom";
import { Hud } from "features/island/hud/Hud";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { Cow } from "./components/Cow";
import { Sheep } from "./components/Sheep";

import shopDisc from "assets/icons/shop_disc.png";

import {
  AnimalBuildingModal,
  hasReadGuide,
} from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { SUNNYSIDE } from "assets/sunnyside";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { ANIMAL_HOUSE_IMAGES } from "features/henHouse/HenHouseInside";
import { Animal, AnimalBounty, IslandType } from "features/game/types/game";
import { AnimalDeal, ExchangeHud } from "./components/AnimalBounties";
import { Modal } from "components/ui/Modal";
import classNames from "classnames";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ANIMAL_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";

export const EXTERIOR_ISLAND_BG: Record<IslandType, string> = {
  basic: SUNNYSIDE.land.basic_building_bg,
  spring: SUNNYSIDE.land.spring_building_bg,
  desert: SUNNYSIDE.land.desert_building_bg,
};

const _barn = (state: MachineState) => state.context.state.barn;

type BarnAnimal = Exclude<AnimalType, "Chicken">;

const BARN_ANIMAL_COMPONENTS: Record<
  BarnAnimal,
  React.FC<{ id: string; disabled: boolean }>
> = {
  Cow: Cow,
  Sheep: Sheep,
};

export const BarnInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(!hasReadGuide());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selected, setSelected] = useState<Animal>();
  const [deal, setDeal] = useState<AnimalBounty>();

  const barn = useSelector(gameService, _barn);
  const level = barn.level as AnimalBuildingLevel;

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const nextLevel = Math.min(level + 1, 3) as Exclude<AnimalBuildingLevel, 1>;

  const {
    x: floorX,
    y: floorY,
    height: floorHeight,
    width: floorWidth,
  } = ANIMAL_HOUSE_BOUNDS.barn[level];

  // Organise the animals neatly in the barn
  const organizedAnimals = useMemo(() => {
    // First, group animals by type and sort within each group
    const animals = getKeys(barn.animals)
      .map((id) => ({
        ...barn.animals[id],
      }))
      // Group by type first (Cow, then Sheep)
      .sort((a, b) => b.experience - a.experience)
      .sort((a, b) => {
        if (a.type === b.type) {
          return a.experience - b.experience;
        }
        return a.type === "Cow" ? -1 : 1;
      });

    const maxAnimalsPerRow = Math.floor(floorWidth / ANIMALS.Cow.width);
    const verticalGap = 0.5; // Add a 0.5 grid unit gap between rows

    return animals.map((animal, index) => {
      const row = Math.floor(index / maxAnimalsPerRow);
      const col = index % maxAnimalsPerRow;
      return {
        ...animal,
        coordinates: {
          x: col * ANIMALS.Cow.width,
          y: row * (ANIMALS.Cow.height + verticalGap),
        },
      };
    });
  }, [getKeys(barn.animals).length, floorWidth]);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <AnimalBuildingModal
          buildingName="Barn"
          onClose={() => setShowModal(false)}
          onExchanging={(deal) => {
            setShowModal(false);
            setDeal(deal);
          }}
        />
      </Modal>

      <UpgradeBuildingModal
        buildingName="Barn"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <Modal show={!!selected} onHide={() => setDeal(undefined)}>
        <AnimalDeal
          onClose={() => {
            setDeal(undefined);
            setSelected(undefined);
          }}
          onSold={() => {
            setDeal(undefined);
            setSelected(undefined);
          }}
          deal={deal!}
          animal={selected!}
        />
      </Modal>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
            backgroundImage: `url(${EXTERIOR_ISLAND_BG[gameService.getSnapshot().context.state.island.type]})`,
            backgroundRepeat: "repeat",
            backgroundPosition: "center",
            backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-full h-full">
              <img
                src={ANIMAL_HOUSE_IMAGES[level].src}
                id={Section.GenesisBlock}
                className="relative z-0"
                style={{
                  width: `${ANIMAL_HOUSE_IMAGES[level].width * PIXEL_SCALE}px`,
                  height: `${ANIMAL_HOUSE_IMAGES[level].height * PIXEL_SCALE}px`,
                  opacity: deal ? 0.5 : 1,
                }}
              />

              <div
                className="absolute"
                style={{
                  top: `${-4 * PIXEL_SCALE}px`,
                  // Center in parent
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <FeederMachine />
              </div>

              <MapPlacement
                x={floorX}
                y={floorY}
                height={floorHeight}
                width={floorWidth}
              >
                <div className="flex flex-wrap w-full h-full">
                  {organizedAnimals.map((animal) => {
                    const isValid = deal && isValidDeal({ animal, deal });
                    const Component =
                      BARN_ANIMAL_COMPONENTS[animal.type as BarnAnimal];
                    const { width, height } = ANIMALS[animal.type];

                    return (
                      <div
                        id={`${animal.type.toLowerCase()}-${animal.id}`}
                        key={`${animal.type.toLowerCase()}-${animal.id}`}
                        className={classNames("relative", {
                          "opacity-50": deal && !isValid,
                          "cursor-pointer": deal && isValid,
                          "pointer-events-none": deal && !isValid,
                        })}
                        style={{
                          position: "absolute",
                          left: `${animal.coordinates.x * GRID_WIDTH_PX}px`,
                          top: `${animal.coordinates.y * GRID_WIDTH_PX}px`,
                          width: `${width * GRID_WIDTH_PX}px`,
                          height: `${height * GRID_WIDTH_PX}px`,
                        }}
                        onClick={(e) => {
                          if (deal) {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!isValid) return;
                            setSelected(animal);
                          }
                        }}
                      >
                        <Component id={animal.id} disabled={!!deal} />
                      </div>
                    );
                  })}
                </div>
              </MapPlacement>

              {!deal && (
                <>
                  <img
                    src={shopDisc}
                    alt="Buy Animals"
                    className="absolute top-[18px] right-[18px] cursor-pointer z-10"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                    }}
                    onClick={() => setShowModal(true)}
                  />
                  <img
                    src={SUNNYSIDE.icons.upgrade_disc}
                    alt="Upgrade Building"
                    className="absolute top-[18px] left-[18px] cursor-pointer z-10"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                    }}
                    onClick={() => setShowUpgradeModal(true)}
                  />

                  <Button
                    className="absolute -bottom-16"
                    onClick={() => navigate("/")}
                  >
                    {t("exit")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </>

      {!deal && <Hud isFarming={false} location="home" />}

      {deal && (
        <ExchangeHud
          deal={deal}
          onClose={() => {
            setDeal(undefined);
          }}
        />
      )}
    </>
  );
};
