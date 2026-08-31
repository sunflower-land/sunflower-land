import React, { useContext, useLayoutEffect, useMemo, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useNavigate } from "react-router";
import { Hud } from "features/island/hud/Hud";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getKeys, getValues } from "lib/object";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ANIMALS } from "features/game/types/animals";
import { Chicken } from "./Chicken";
import {
  AnimalBuildingModal,
  hasReadGuide,
} from "features/game/expansion/components/animals/AnimalBuildingModal";
import { FeederMachine } from "features/feederMachine/FeederMachine";
import { FeedAllButton } from "features/game/expansion/components/animals/FeedAllButton";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { Modal } from "components/ui/Modal";
import { AnimalDeal } from "features/barn/components/AnimalBounties";
import { AnimalBountySellPanel } from "features/barn/components/AnimalBountySellPanel";
import type { AnimalBounty } from "features/game/types/game";
import { isValidDeal } from "features/game/events/landExpansion/sellAnimal";
import classNames from "classnames";
import { EXTERIOR_ISLAND_BG } from "features/barn/BarnInside";
import { ANIMAL_HOUSE_BOUNDS } from "features/game/expansion/placeable/lib/collisionDetection";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { PlayerModal } from "features/social/PlayerModal";
import { hasFeatureAccess } from "lib/flags";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { AnimalBuildingActions } from "features/game/expansion/components/animals/AnimalBuildingActions";

const _henHouse = (state: MachineState) => state.context.state.henHouse;
const _game = (state: MachineState) => state.context.state;
const _token = (state: AuthMachineState) => state.context.user.rawToken ?? "";

export const ANIMAL_HOUSE_IMAGES: Record<
  number,
  { src: string; height: number; width: number }
> = {
  1: { src: SUNNYSIDE.land.animal_house_inside_one, height: 224, width: 192 },
  2: { src: SUNNYSIDE.land.animal_house_inside_two, height: 256, width: 224 },
  3: { src: SUNNYSIDE.land.animal_house_inside_three, height: 288, width: 256 },
};

export const HenHouseInside: React.FC = () => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(!hasReadGuide());
  const [showSellPanel, setShowSellPanel] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [deal, setDeal] = useState<AnimalBounty>();
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>();

  const henHouse = useSelector(gameService, _henHouse);
  const game = useSelector(gameService, _game);
  const token = useSelector(authService, _token);
  const level = henHouse.level;

  const context = gameService.getSnapshot().context;
  const loggedInFarmId = context.visitorId ?? context.farmId;

  const animalCount = getKeys(henHouse.animals).length;
  const sickAnimalCount = getValues(henHouse.animals).filter(
    (animal) => animal.state === "sick",
  ).length;

  const hasAirdropAccess = hasFeatureAccess(
    context.visitorState ?? context.state,
    "AIRDROP_PLAYER",
  );

  const { t } = useAppTranslation();

  const [scrollIntoView] = useScrollIntoView();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const {
    x: floorX,
    y: floorY,
    height: floorHeight,
    width: floorWidth,
  } = ANIMAL_HOUSE_BOUNDS.henHouse[level];

  // Sort order will remain the same as long as animals are not added or removed
  const sortedAnimalIds = useMemo(
    () =>
      getKeys(henHouse.animals)
        .map((id) => henHouse.animals[id])
        .sort((a, b) => b.experience - a.experience)
        .map((animal) => animal.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getKeys(henHouse.animals).length],
  );

  // Organize the animals neatly in the hen house
  const organizedAnimals = useMemo(() => {
    const maxAnimalsPerRow = Math.floor(floorWidth / ANIMALS.Cow.width);
    const verticalGap = 0.5; // Add a 0.5 grid unit gap between rows

    return sortedAnimalIds
      .map((id) => henHouse.animals[id])
      .map((animal, index) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animalCount, sickAnimalCount, floorWidth]);

  const nextLevel = Math.min(level + 1, 3);

  const handleAnimalSale = (animalId: string) => {
    if (!deal) return;

    const currentGame = gameService.getSnapshot().context.state;
    const animal = currentGame.henHouse.animals[animalId];
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

  return (
    <>
      <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)}>
        <AnimalBuildingModal
          buildingName="Hen House"
          view="buy"
          onClose={() => setShowBuyModal(false)}
        />
      </Modal>

      <Modal show={showGuideModal} onHide={() => setShowGuideModal(false)}>
        <AnimalBuildingModal
          buildingName="Hen House"
          view="guide"
          onClose={() => setShowGuideModal(false)}
        />
      </Modal>

      {showSellPanel && (
        <AnimalBountySellPanel
          animalTypes={["Chicken"]}
          selectedDeal={deal}
          onSelect={setDeal}
          onClose={() => {
            setShowSellPanel(false);
            setDeal(undefined);
          }}
        />
      )}

      <UpgradeBuildingModal
        buildingName="Hen House"
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
      <div
        className="absolute bg-[#181425]"
        style={{
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
          imageRendering: "pixelated",
          backgroundImage: `url(${EXTERIOR_ISLAND_BG[getCurrentBiome(gameService.getSnapshot().context.state.island)]})`,
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          backgroundSize: `${96 * PIXEL_SCALE}px ${96 * PIXEL_SCALE}px`,
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-full h-full">
            <div className={"relative w-full h-full"}>
              {!deal &&
                !showSellPanel &&
                !showBuyModal &&
                !showGuideModal &&
                !showUpgradeModal && (
                  <>
                    <AnimalBuildingActions
                      onBuy={() => setShowBuyModal(true)}
                      onSell={() => setShowSellPanel(true)}
                      onGuide={() => setShowGuideModal(true)}
                      onUpgrade={() => setShowUpgradeModal(true)}
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
                <FeederMachine building="Hen House" />
              </div>

              <div className="absolute -top-[11px] left-1/2 translate-x-[58px]">
                <FeedAllButton building="Hen House" />
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

                            handleAnimalSale(animal.id.toString());
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

      {!deal &&
        !showSellPanel &&
        !showBuyModal &&
        !showGuideModal &&
        !showUpgradeModal && <Hud isFarming={false} location="home" />}
      <PlayerModal
        loggedInFarmId={loggedInFarmId}
        token={token}
        hasAirdropAccess={hasAirdropAccess}
      />
    </>
  );
};
