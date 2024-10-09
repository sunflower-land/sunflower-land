import React, { useContext, useLayoutEffect, useState } from "react";
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
import saleDisc from "assets/icons/sales_disc.webp";
import { Modal } from "components/ui/Modal";
import {
  AnimalDeal,
  AnimalExchange,
  ExchangeHud,
} from "features/barn/components/AnimalExchanges";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Animal, ExchangeDeal } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import classNames from "classnames";
import { HudContainer } from "components/ui/HudContainer";

const background = SUNNYSIDE.land.tent_inside;

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
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showExchange, setShowExchange] = useState(false);
  const [deal, setDeal] = useState<ExchangeDeal>();
  const [selected, setSelected] = useState<Animal>();
  const henHouse = useSelector(gameService, _henHouse);
  const level = henHouse.level as AnimalBuildingLevel;

  const { t } = useAppTranslation();

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const mapPlacements: Array<JSX.Element> = [];

  let components = getKeys(henHouse.animals).map((id) => {
    const animal = henHouse.animals[id];
    const isValid = deal && isValidDeal({ animal, deal });

    return (
      <MapPlacement
        key={`chicken-${id}`}
        x={animal.coordinates.x}
        y={animal.coordinates.y}
        height={ANIMALS.Chicken.height}
        width={ANIMALS.Chicken.width}
        z={1}
      >
        <div
          className={classNames(
            deal
              ? {
                  "opacity-50": !isValid,
                  "cursor-pointer": isValid,
                  "pointer-events-none": !isValid,
                }
              : {},
          )}
          onClick={(e) => {
            if (deal) {
              e.preventDefault();

              if (!isValid) return;

              setSelected(animal);
            }
          }}
        >
          <Chicken id={id} />
        </div>
      </MapPlacement>
    );
  });

  mapPlacements.push(...components);

  const nextLevel = Math.min(level + 1, 3) as Exclude<AnimalBuildingLevel, 1>;

  return (
    <>
      <AnimalBuildingModal
        buildingName="Hen House"
        show={showModal}
        onClose={() => setShowModal(false)}
      />
      <UpgradeBuildingModal
        buildingName="Hen House"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
      <Modal show={showExchange} onHide={() => setShowExchange(false)}>
        <AnimalExchange
          onExchanging={(deal) => {
            setShowExchange(false);
            setDeal(deal);
          }}
          type="Chicken"
        />
      </Modal>

      <Modal show={!!selected} onHide={() => setSelected(undefined)}>
        <AnimalDeal
          onClose={() => {
            setSelected(undefined);
          }}
          onSold={() => {
            setDeal(undefined);
            setSelected(undefined);
            setShowExchange(true);
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
            <div className={"relative w-full h-full"}>
              {!deal && (
                <>
                  <img
                    src={shopDisc}
                    alt="Buy Animals"
                    className="absolute top-7 right-8 cursor-pointer z-10"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                    }}
                    onClick={() => setShowModal(true)}
                  />
                  <img
                    src={saleDisc}
                    alt="Buy Animals"
                    className="absolute top-8 left-8 cursor-pointer z-10"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                    }}
                    onClick={() => setShowExchange(true)}
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
                  opacity: deal ? 0.5 : 1,
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

              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
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
