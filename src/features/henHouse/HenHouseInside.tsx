import React, { useContext, useLayoutEffect, useMemo, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
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
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ANIMALS } from "features/game/types/animals";
import { Chicken } from "./Chicken";
import shopDisc from "assets/icons/shop_disc.png";
import { AnimalBuildingModal } from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { Modal } from "components/ui/Modal";
import {
  AnimalDeal,
  ExchangeHud,
} from "features/barn/components/AnimalBounties";
import { Animal, AnimalBounty } from "features/game/types/game";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import classNames from "classnames";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { ANIMAL_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { hasReadGuide } from "features/game/expansion/components/animals/AnimalBuildingModal";

const _henHouse = (state: MachineState) => state.context.state.henHouse;

export const ANIMAL_HOUSE_IMAGES: Record<
  AnimalBuildingLevel,
  { src: string; height: number; width: number }
> = {
  1: { src: SUNNYSIDE.land.animal_house_inside_one, height: 224, width: 192 },
  2: { src: SUNNYSIDE.land.animal_house_inside_two, height: 256, width: 224 },
  3: { src: SUNNYSIDE.land.animal_house_inside_three, height: 288, width: 256 },
};

export const HenHouseInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(!hasReadGuide());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [deal, setDeal] = useState<AnimalBounty>();
  const [selected, setSelected] = useState<Animal>();
  const henHouse = useSelector(gameService, _henHouse);
  const level = henHouse.level as AnimalBuildingLevel;

  const { t } = useAppTranslation();

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const nextLevel = Math.min(level + 1, 3) as Exclude<AnimalBuildingLevel, 1>;

  const {
    x: floorX,
    y: floorY,
    height: floorHeight,
    width: floorWidth,
  } = ANIMAL_HOUSE_BOUNDS.henHouse[level];

  const organizedAnimals = useMemo(() => {
    const animals = getKeys(henHouse.animals).map((id) => ({
      ...henHouse.animals[id],
    }));

    const maxAnimalsPerRow = Math.floor(floorWidth / ANIMALS.Chicken.width);

    return animals.map((animal, index) => {
      const row = Math.floor(index / maxAnimalsPerRow);
      const col = index % maxAnimalsPerRow;
      return {
        ...animal,
        coordinates: {
          x: col * ANIMALS.Chicken.width,
          y: row * ANIMALS.Chicken.height,
        },
      };
    });
  }, [henHouse.animals, floorWidth]);

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <AnimalBuildingModal
          buildingName="Hen House"
          onClose={() => setShowModal(false)}
          onExchanging={(deal) => {
            setShowModal(false);
            setDeal(deal);
          }}
        />
      </Modal>
      <UpgradeBuildingModal
        buildingName="Hen House"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <Modal show={!!selected} onHide={() => setSelected(undefined)}>
        <AnimalDeal
          onClose={() => {
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
            <div className={"relative w-full h-full"}>
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

                  <Button
                    className="absolute -bottom-16"
                    onClick={() => navigate("/")}
                  >
                    {t("exit")}
                  </Button>
                </>
              )}

              <img
                src={SUNNYSIDE.icons.upgrade_disc}
                alt="Upgrade Building"
                className="absolute top-[18px] left-[18px] cursor-pointer z-10"
                style={{
                  width: `${PIXEL_SCALE * 18}px`,
                }}
                onClick={() => setShowUpgradeModal(true)}
              />
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
                  // Center in parent
                  top: `${-4 * PIXEL_SCALE}px`,
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
                    const { width, height } = ANIMALS[animal.type];

                    return (
                      <div
                        id={`${animal.type.toLowerCase()}-${animal.id}`}
                        key={`${animal.type.toLowerCase()}-${animal.id}`}
                        className={classNames({
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
                            // Stop other clicks
                            e.stopPropagation();
                            e.preventDefault();

                            if (!isValid) return;

                            setSelected(animal);
                          }
                        }}
                      >
                        <Chicken disabled={!!deal} id={animal.id} />
                      </div>
                    );
                  })}
                </div>
              </MapPlacement>
            </div>
          </div>
        </div>
      </div>

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
