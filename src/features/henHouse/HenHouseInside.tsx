import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
  AnimalBounties,
  ExchangeHud,
} from "features/barn/components/AnimalBounties";
import { Animal, AnimalBounty } from "features/game/types/game";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import classNames from "classnames";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

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
        <AnimalBounties
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
                  <div
                    className="absolute bottom-32 left-8 cursor-pointer z-10"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                    }}
                    onClick={() => setShowExchange(true)}
                  >
                    <GrabNab />
                  </div>

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

              {getKeys(henHouse.animals)
                .map((id) => {
                  const animal = henHouse.animals[id];
                  const isValid = deal && isValidDeal({ animal, deal });

                  return (
                    <MapPlacement
                      key={`chicken-${id}`}
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
                        <Chicken disabled={!!deal} id={id} />
                      </div>
                    </MapPlacement>
                  );
                })
                .sort((a, b) => a.props.y - b.props.y)}
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

const message = () => {
  if (Math.random() < 0.05) return "Feast";

  if (Math.random() < 0.2) return "Gobble";
  if (Math.random() < 0.5) return "Crunch";
  return "Tasty...";
};

const GrabNab: React.FC = () => {
  const [hint, _] = useState(message());
  const [state, setState] = useState<"idle" | "typing">("idle");

  useEffect(() => {
    const speak = async () => {
      setState("typing");

      await new Promise((res) => setTimeout(() => setState("idle"), 1000));
    };

    speak();
  }, [hint]);

  return (
    <>
      <div>
        {hint && (
          <div
            className={"absolute uppercase"}
            style={{
              fontFamily: "Teeny",
              color: "black",
              textShadow: "none",
              top: `${PIXEL_SCALE * -4}px`,
              left: `${PIXEL_SCALE * 12}px`,

              borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
              borderStyle: "solid",
              borderTopWidth: `${PIXEL_SCALE * 2}px`,
              borderRightWidth: `${PIXEL_SCALE * 2}px`,
              borderBottomWidth: `${PIXEL_SCALE * 4}px`,
              borderLeftWidth: `${PIXEL_SCALE * 5}px`,

              borderImageSlice: "2 2 4 5 fill",
              imageRendering: "pixelated",
              borderImageRepeat: "stretch",
              fontSize: "8px",
            }}
          >
            <div
              style={{
                height: "12px",
                minWidth: "30px",
              }}
            >
              {state === "idle" && (
                <span
                  className="whitespace-nowrap"
                  style={{
                    fontSize: "10px",
                    position: "relative",
                    bottom: "4px",
                    left: "-2px",
                    wordSpacing: "-4px",
                    color: "#262b45",
                  }}
                >
                  {hint}
                </span>
              )}

              {state === "typing" && (
                <span
                  style={{
                    fontSize: "10px",
                    position: "relative",
                    bottom: "4px",
                    left: "-2px",
                    wordSpacing: "-4px",
                    color: "#262b45",
                  }}
                >
                  {"..."}
                </span>
              )}
            </div>
          </div>
        )}

        <NPC parts={NPC_WEARABLES["grabnab"]} />
      </div>
    </>
  );
};
