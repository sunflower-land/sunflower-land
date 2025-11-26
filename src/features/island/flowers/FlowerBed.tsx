import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { FlowerBedModal } from "./FlowerBedModal";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { useSelector } from "@xstate/react";
import {
  FLOWERS,
  FLOWER_SEEDS,
  FlowerName,
  FlowerGrowthStage,
} from "features/game/types/flowers";
import { TimerPopover } from "../common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { FLOWER_VARIANTS } from "../lib/alternateArt";
import { getCurrentBiome } from "../biomes/biomes";

import chest from "assets/icons/chest.png";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { calculateInstaGrowCost } from "features/game/events/landExpansion/instaGrowFlower";
import { Panel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import { PlantedFlower } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { useCountdown } from "lib/utils/hooks/useCountdown";

interface Props {
  id: string;
}

const FlowerCongratulations: React.FC<{ flowerName: FlowerName }> = ({
  flowerName,
}) => (
  <div
    id="congratulations"
    className="absolute -top-1 left-1/2 -translate-x-1/2 h-36 w-40 pointer-events-none"
  >
    {Array.from({ length: 7 }).map((_, i) => (
      <img
        key={`flower-${i + 1}`}
        src={ITEM_DETAILS[flowerName].image}
        alt="Flower"
        // Steal bee animations
        className={`absolute left-1/2 -translate-x-1/2 swarm-bee-${i + 1}`}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
    ))}
  </div>
);

const getGrowthStage = (
  growPercentage: number,
  dirty: boolean,
): FlowerGrowthStage => {
  // It's possible with boosts that the initial growth stage is not sprout.
  // Always render a sprout if the flower is dirt (i.e. data not from backend).
  if (dirty) return "sprout";

  return growPercentage >= 100
    ? "ready"
    : growPercentage >= 66
      ? "almost"
      : growPercentage >= 44
        ? "halfway"
        : "sprout";
};

const _flowers = (state: MachineState) => state.context.state.flowers;
const _biome = (state: MachineState) =>
  getCurrentBiome(state.context.state.island);
const _season = (state: MachineState) => state.context.state.season.season;

export const FlowerBed: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);

  const flowers = useSelector(gameService, _flowers);
  const biome = useSelector(gameService, _biome);
  const season = useSelector(gameService, _season);

  const [showPlantModal, setShowPlantModal] = useState(false);

  const flowerBed = flowers.flowerBeds[id];

  if (!flowerBed.flower) {
    return (
      <>
        <div
          className="relative w-full h-full hover:img-highlight cursor-pointer"
          onClick={() => setShowPlantModal(true)}
        >
          <img
            src={FLOWER_VARIANTS(biome, season, "Red Pansy", "flower_bed")}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 48}px`,
              bottom: 0,
            }}
          />
        </div>
        <Modal show={showPlantModal} onHide={() => setShowPlantModal(false)}>
          <FlowerBedModal id={id} onClose={() => setShowPlantModal(false)} />
        </Modal>
      </>
    );
  }

  const flower = flowerBed.flower;

  return <Flower flower={flower} id={id} />;
};

const _farmActivity = (state: MachineState) => state.context.state.farmActivity;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _collectibles = (state: MachineState) => state.context.state.collectibles;

const Flower: React.FC<{ flower: PlantedFlower; id: string }> = ({
  flower,
  id,
}) => {
  const { gameService, showTimers } = useContext(Context);
  const { t } = useAppTranslation();

  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [congratulationsPage, setCongratulationsPage] = useState(0);
  const [showPopover, setShowPopover] = useState(false);
  const [showInstaGrowModal, setShowInstaGrowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const farmActivity = useSelector(gameService, _farmActivity);
  const inventory = useSelector(gameService, _inventory);
  const biome = useSelector(gameService, _biome);
  const season = useSelector(gameService, _season);
  const bumpkin = useSelector(gameService, _bumpkin);
  const collectibles = useSelector(gameService, _collectibles);

  // Keep growth calculations in seconds to match `useCountdown`, and only use
  // milliseconds for the countdown target date.
  const growSeconds = FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds;
  const growTimeMs = growSeconds * 1000;

  const { totalSeconds: secondsLeft } = useCountdown(
    flower.plantedAt + growTimeMs,
  );
  const growPercentage = 100 - (Math.max(secondsLeft, 0) / growSeconds) * 100;

  const isGrowing = secondsLeft > 0;

  const stage = getGrowthStage(growPercentage, !!flower.dirty);

  const hasHarvestedBefore = !!farmActivity[`${flower.name} Harvested`];
  const reward = flower.reward;

  const instaGrowCost = calculateInstaGrowCost(secondsLeft);
  const playerObsidian = inventory.Obsidian ?? new Decimal(0);

  const handlePlotClick = () => {
    if (isGrowing) {
      setShowInstaGrowModal(true);
      return;
    }

    if (!hasHarvestedBefore || !!reward) {
      setShowCongratulationsModal(true);
      return;
    }

    gameService.send({
      type: "flower.harvested",
      id,
    });
  };

  const handleCongratulationsClose = () => {
    setShowCongratulationsModal(false);

    gameService.send({
      type: "flower.harvested",
      id,
    });
  };

  const closeInstaGrowModal = () => {
    setShowInstaGrowModal(false);
    setShowConfirm(false);
  };

  const handleInstaGrow = () => {
    gameService.send({
      type: "flower.instaGrown",
      id,
    });

    closeInstaGrowModal();
  };
  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handlePlotClick}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        <img
          src={FLOWER_VARIANTS(biome, season, flower.name, stage)}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            bottom: 0,
          }}
        />
        {flower && isGrowing && !flower.dirty && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -18}px`,
            }}
          >
            <TimerPopover
              image={
                hasHarvestedBefore
                  ? ITEM_DETAILS[flower.name].image
                  : SUNNYSIDE.icons.search
              }
              description={hasHarvestedBefore ? flower.name : "Unknown"}
              showPopover={showPopover}
              timeLeft={secondsLeft}
            />
          </div>
        )}

        {showTimers && isGrowing && (
          <div
            className="absolute"
            style={{
              bottom: `${PIXEL_SCALE * 3}px`,
              left: `${PIXEL_SCALE * 16}px`,
              width: `${PIXEL_SCALE * 16}px`,
            }}
          >
            <ProgressBar
              percentage={growPercentage}
              seconds={!flower.dirty ? secondsLeft : undefined}
              type="progress"
              formatLength="short"
            />
          </div>
        )}
      </div>

      <Modal show={showCongratulationsModal}>
        <Panel
          className="relative space-y-1"
          bumpkinParts={NPC_WEARABLES.poppy}
        >
          {congratulationsPage === 0 && (
            <SpeakingText
              message={[
                {
                  text: getCongratulationsMessage({
                    isNewFlower: !hasHarvestedBefore,
                    isMutantFlower: !!reward,
                  }),
                },
              ]}
              onClose={() => setCongratulationsPage(1)}
            />
          )}
          {congratulationsPage === 1 && (
            <div className="flex flex-col justify-center items-center space-y-2">
              {!hasHarvestedBefore && (
                <div className="flex flex-col justify-center items-center">
                  <Label type="warning" icon={SUNNYSIDE.icons.search}>
                    {t("new.species")}
                  </Label>
                  <span className="text-sm mb-2">{flower.name}</span>
                  <img
                    src={ITEM_DETAILS[flower.name]?.image}
                    className="h-12 mb-2"
                  />
                  <span className="text-xs text-center mb-2">
                    {ITEM_DETAILS[flower.name].description}
                  </span>
                </div>
              )}
              {!!reward && (
                <div className="flex flex-col justify-center items-center">
                  <Label type="warning" icon={chest}>
                    {t("reward")}
                  </Label>
                  {(reward.items ?? []).map((item) => {
                    const boost = COLLECTIBLE_BUFF_LABELS[item.name]?.({
                      skills: bumpkin.skills,
                      collectibles: collectibles,
                    });

                    return (
                      <>
                        <span className="text-sm mb-2">{item.name}</span>
                        <img
                          src={ITEM_DETAILS[item.name]?.image}
                          className="h-12 mb-2"
                        />
                        <span className="text-xs text-center mb-2">
                          {ITEM_DETAILS[item.name].description}
                        </span>
                        {boost && (
                          <div className="flex flex-col gap-1">
                            {boost.map(
                              (
                                {
                                  labelType,
                                  boostTypeIcon,
                                  boostedItemIcon,
                                  shortDescription,
                                },
                                index,
                              ) => (
                                <Label
                                  key={index}
                                  type={labelType}
                                  icon={boostTypeIcon}
                                  secondaryIcon={boostedItemIcon}
                                  className="mb-1"
                                >
                                  {shortDescription}
                                </Label>
                              ),
                            )}
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
              <Button onClick={handleCongratulationsClose}>{t("ok")}</Button>
            </div>
          )}
          <FlowerCongratulations flowerName={flower.name} />
        </Panel>
      </Modal>

      <Modal show={showInstaGrowModal} onHide={closeInstaGrowModal}>
        <CloseButtonPanel
          onClose={closeInstaGrowModal}
          bumpkinParts={NPC_WEARABLES["poppy"]}
        >
          <div className="p-1 flex flex-col gap-2">
            <Label type="vibrant">{t("instaGrow")}</Label>
            <Label type="warning">
              {t("instaGrow.timeRemaining", {
                time: secondsToString(secondsLeft, { length: "medium" }),
              })}
            </Label>
            <p className="text-sm my-1">
              {t("instaGrow.description", {
                project: hasHarvestedBefore ? flower.name : "flower",
              })}
            </p>
            <div className="flex justify-start">
              <RequirementLabel
                item="Obsidian"
                requirement={instaGrowCost}
                type="item"
                balance={playerObsidian}
              />
            </div>
            {showConfirm ? (
              <div className="flex justify-between gap-1">
                <Button onClick={() => setShowConfirm(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleInstaGrow}
                  disabled={!playerObsidian.gte(instaGrowCost)}
                >
                  {t("confirm")}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!playerObsidian.gte(instaGrowCost)}
              >
                {t("instaGrow")}
              </Button>
            )}
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

const getCongratulationsMessage = ({
  isNewFlower,
  isMutantFlower,
}: {
  isNewFlower: boolean;
  isMutantFlower: boolean;
}) => {
  // It's possible to discover a new flower, and a mutant in the same pull.
  // In this case, we want to show a message for both.
  if (isNewFlower && isMutantFlower)
    return translate("flowerBed.newSpecies.superLucky");

  if (isMutantFlower) return translate("flowerBed.newSpecies.mutant");

  return translate("flowerBed.newSpecies.discovered");
};
