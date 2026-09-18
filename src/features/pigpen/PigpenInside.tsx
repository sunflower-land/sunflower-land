import React, { useContext, useLayoutEffect, useState, useMemo } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Navigate, useNavigate } from "react-router";
import { Hud } from "features/island/hud/Hud";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getKeys } from "lib/object";
import { ANIMALS } from "features/game/types/animals";
import { Pig } from "./components/Pig";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import shopDisc from "assets/icons/shop_disc.png";

import {
  AnimalBuildingModal,
  hasReadGuide,
} from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { FeedAllButton } from "features/game/expansion/components/animals/FeedAllButton";
import { SUNNYSIDE } from "assets/sunnyside";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { ANIMAL_HOUSE_IMAGES } from "features/henHouse/HenHouseInside";
import type { AnimalBounty } from "features/game/types/game";
import {
  AnimalDeal,
  ExchangeHud,
} from "features/barn/components/AnimalBounties";
import { AnimalBountySellPanel } from "features/barn/components/AnimalBountySellPanel";
import { Modal } from "components/ui/Modal";
import classNames from "classnames";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ANIMAL_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { PlayerModal } from "features/social/PlayerModal";
import { hasFeatureAccess } from "lib/flags";
import { Context as AuthContext } from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { isBuildingDestroyed } from "features/island/buildings/components/building/Building";

const _pigpen = (state: MachineState) => state.context.state.pigpen;
const _game = (state: MachineState) => state.context.state;
const _island = (state: MachineState) => state.context.state.island;
const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";
const _isPigpenDestroyed = (state: MachineState) =>
  isBuildingDestroyed({
    name: "Pigpen",
    calendar: state.context.state.calendar,
  });

export const PigpenInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(!hasReadGuide());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // Bonus quick-sell flow: the skull disc docks the bounty cards at the
  // bottom of the screen instead of opening the shop modal's Sell tab.
  const [showSellPanel, setShowSellPanel] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>();
  const [deal, setDeal] = useState<AnimalBounty>();
  const { authService } = useContext(AuthContext);
  const context = gameService.getSnapshot().context;
  const loggedInFarmId = context.visitorId ?? context.farmId;

  const hasAirdropAccess = hasFeatureAccess(
    context.visitorState ?? context.state,
    "AIRDROP_PLAYER",
  );

  const token = useSelector(authService, _token);
  const pigpen = useSelector(gameService, _pigpen);
  const isDestroyed = useSelector(gameService, _isPigpenDestroyed);
  const game = useSelector(gameService, _game);
  const island = useSelector(gameService, _island);
  const level = pigpen.level;

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const nextLevel = Math.min(level + 1, 3);

  const {
    x: floorX,
    y: floorY,
    height: floorHeight,
    width: floorWidth,
  } = ANIMAL_HOUSE_BOUNDS.pigpen[level];

  // One animal type lives here, so this orders purely by experience
  const sortedAnimalIds = useMemo(
    () =>
      getKeys(pigpen.animals)
        .map((id) => pigpen.animals[id])
        .sort((a, b) =>
          a.type === b.type
            ? b.experience - a.experience
            : a.type.localeCompare(b.type),
        )
        .map((animal) => animal.id),
    [pigpen.animals],
  );

  // Organize the animals neatly in the pigpen
  const organizedAnimals = useMemo(() => {
    const maxAnimalsPerRow = Math.floor(floorWidth / ANIMALS.Pig.width);
    const verticalGap = 0.5; // Add a 0.5 grid unit gap between rows

    return sortedAnimalIds
      .map((id) => pigpen.animals[id])
      .map((animal, index) => {
        const row = Math.floor(index / maxAnimalsPerRow);
        const col = index % maxAnimalsPerRow;
        return {
          ...animal,
          coordinates: {
            x: col * ANIMALS.Pig.width,
            y: row * (ANIMALS.Pig.height + verticalGap),
          },
        };
      });
  }, [sortedAnimalIds, pigpen.animals, floorWidth]);
  const currentBiome = getCurrentBiome(island);

  const validAnimalsCount = useMemo(() => {
    if (!deal) return 0;
    return organizedAnimals.filter((animal) =>
      isValidDeal({ animal, deal, game }),
    ).length;
  }, [organizedAnimals, deal, game]);

  // Quick-sell (panel) flow: sell on click, only confirming when the sale
  // deserves a second look (sick animal discount / attached reward).
  const handleAnimalSale = (animalId: string) => {
    if (!deal) return;

    const currentGame = gameService.getSnapshot().context.state;
    const animal = currentGame.pigpen.animals[animalId];
    const isCompleted = currentGame.bounties.completed.some(
      (completed) => completed.id === deal.id,
    );

    if (
      !animal ||
      isCompleted ||
      !isValidDeal({ animal, deal, game: currentGame })
    ) {
      return;
    }

    if (animal.state === "sick" || animal.reward?.items?.[0]?.name) {
      setSelectedAnimalId(animalId);
      return;
    }

    gameService.send("animal.sold", {
      requestId: deal.id,
      animalId,
    });
    setDeal(undefined);
  };

  if (isDestroyed) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <AnimalBuildingModal
          buildingName="Pigpen"
          onClose={() => setShowModal(false)}
          onExchanging={(deal) => {
            setShowModal(false);
            setDeal(deal);
          }}
        />
      </Modal>

      {showSellPanel && (
        <AnimalBountySellPanel
          animalTypes={["Pig"]}
          selectedDeal={deal}
          onSelect={setDeal}
          onClose={() => {
            setShowSellPanel(false);
            setDeal(undefined);
          }}
        />
      )}

      <UpgradeBuildingModal
        buildingName="Pigpen"
        currentLevel={level}
        nextLevel={nextLevel}
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <Modal
        show={!!selectedAnimalId && !!deal}
        onHide={() => setSelectedAnimalId(undefined)}
      >
        <AnimalDeal
          onClose={() => {
            setSelectedAnimalId(undefined);
          }}
          onSold={() => {
            setDeal(undefined);
            setSelectedAnimalId(undefined);
          }}
          deal={deal}
          animalId={selectedAnimalId}
        />
      </Modal>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
            backgroundImage: `url(${EXTERIOR_ISLAND_BG[currentBiome]})`,
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
                <FeederMachine building="Pigpen" />
              </div>

              <div className="absolute -top-[11px] left-1/2 translate-x-[58px]">
                <FeedAllButton building="Pigpen" />
              </div>

              <MapPlacement
                x={floorX}
                y={floorY}
                height={floorHeight}
                width={floorWidth}
              >
                <div className="flex flex-wrap w-full h-full">
                  {organizedAnimals.map((animal) => {
                    const isValid = deal && isValidDeal({ animal, deal, game });
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
                            if (showSellPanel) {
                              handleAnimalSale(animal.id.toString());
                            } else {
                              setSelectedAnimalId(animal.id.toString());
                            }
                          }
                        }}
                      >
                        <Pig id={animal.id} disabled={!!deal} />
                      </div>
                    );
                  })}
                </div>
              </MapPlacement>

              {!deal && !showSellPanel && (
                <>
                  <button
                    type="button"
                    aria-label={t("buy")}
                    className="absolute top-[18px] right-[18px] z-10 flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 hover:img-highlight"
                    style={{
                      width: `${PIXEL_SCALE * 18}px`,
                      height: `${PIXEL_SCALE * 21}px`,
                    }}
                    onClick={() => setShowModal(true)}
                  >
                    <img src={shopDisc} className="h-full w-full" alt="" />
                  </button>

                  <button
                    type="button"
                    aria-label={t("bounties.sellAnimals")}
                    className="absolute z-10 cursor-pointer border-0 bg-transparent p-0 hover:img-highlight"
                    style={{
                      // The shop disc has a 2px bag sprite above its disc, so its disc face sits
                      // 2 native px lower than the plain disc. Match that so the two discs line up.
                      top: `${18 + PIXEL_SCALE * 2}px`,
                      width: `${PIXEL_SCALE * 18}px`,
                      right: `${18 + PIXEL_SCALE * 19}px`,
                    }}
                    onClick={() => setShowSellPanel(true)}
                  >
                    <img
                      className="block w-full"
                      src={SUNNYSIDE.icons.disc}
                      alt=""
                    />
                    <img
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      src={SUNNYSIDE.icons.death}
                      alt=""
                      style={{ width: `${PIXEL_SCALE * 7}px` }}
                    />
                  </button>

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

      {!deal && !showSellPanel && <Hud isFarming={false} location="home" />}

      {deal && !showSellPanel && (
        <ExchangeHud
          deal={deal}
          onClose={() => {
            setDeal(undefined);
          }}
          validAnimalsCount={validAnimalsCount}
        />
      )}

      <PlayerModal
        loggedInFarmId={loggedInFarmId}
        token={token}
        hasAirdropAccess={hasAirdropAccess}
      />
    </>
  );
};
