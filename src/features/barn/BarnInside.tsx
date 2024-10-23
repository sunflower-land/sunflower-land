import React, { useContext, useLayoutEffect, useState } from "react";

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
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { Cow } from "./components/Cow";
import { Sheep } from "./components/Sheep";

import shopDisc from "assets/icons/shop_disc.png";
import { AnimalBuildingModal } from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { AnimalBuildingLevel } from "features/game/events/landExpansion/upgradeBuilding";
import { SUNNYSIDE } from "assets/sunnyside";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { ANIMAL_HOUSE_IMAGES } from "features/henHouse/HenHouseInside";
import { Animal, BountyRequest } from "features/game/types/game";
import { AnimalDeal } from "./components/AnimalBounties";
import { Modal } from "components/ui/Modal";
import { AnimalBounties } from "./components/AnimalBounties";
import classNames from "classnames";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";

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
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [selected, setSelected] = useState<Animal>();
  const [deal, setDeal] = useState<BountyRequest>();
  const barn = useSelector(gameService, _barn);
  const level = barn.level as AnimalBuildingLevel;

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const nextLevel = Math.min(level + 1, 3) as Exclude<AnimalBuildingLevel, 1>;

  return (
    <>
      <AnimalBuildingModal
        buildingName="Barn"
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <UpgradeBuildingModal
        buildingName="Barn"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <Modal show={showExchange} onHide={() => setShowExchange(false)}>
        {/* TODO: FIX FOR BARN ANIMALS */}
        <AnimalBounties
          onExchanging={(deal) => {
            setShowExchange(false);
            setDeal(deal);
          }}
          type="Cow"
        />
      </Modal>

      <Modal show={!!deal} onHide={() => setDeal(undefined)}>
        <AnimalDeal
          onClose={() => {
            setDeal(undefined);
          }}
          onSold={() => {
            setDeal(undefined);
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
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-full h-full">
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
                src={SUNNYSIDE.icons.upgradeBuildingIcon}
                alt="Upgrade Building"
                className="absolute bottom-[44px] right-[18px] cursor-pointer z-10"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
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
                }}
              />

              <div
                className="absolute"
                style={{
                  left: `${10 * PIXEL_SCALE}px`,
                  top: `${0 * PIXEL_SCALE}px`,
                  width: `${30 * PIXEL_SCALE}px`,
                }}
              >
                <FeederMachine />
              </div>

              {getKeys(barn.animals)
                .map((id) => {
                  const animal = barn.animals[id];
                  const isValid = deal && isValidDeal({ animal, deal });
                  const Component =
                    BARN_ANIMAL_COMPONENTS[animal.type as BarnAnimal];

                  return (
                    <MapPlacement
                      key={`${animal.type.toLowerCase()}-${id}`}
                      x={animal.coordinates.x}
                      y={animal.coordinates.y}
                      height={ANIMALS.Chicken.height}
                      width={ANIMALS.Chicken.width}
                    >
                      <div
                        className={classNames({
                          "opacity-50": deal && !isValid,
                          "cursor-pointer": deal && isValid,
                          "pointer-events-none": deal && !isValid,
                        })}
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
                        <Component id={id} disabled={!!deal} />
                      </div>
                    </MapPlacement>
                  );
                })
                .sort((a, b) => a.props.y - b.props.y)}

              <Button
                className="absolute -bottom-16"
                onClick={() => navigate("/")}
              >
                {t("exit")}
              </Button>
            </div>
          </div>
        </div>
      </>

      <Hud isFarming={false} location="home" />
    </>
  );
};
