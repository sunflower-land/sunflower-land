import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { FlowerBedModal } from "./FlowerBedModal";
import { Context } from "features/game/GameProvider";
import { ProgressBar } from "components/ui/ProgressBar";
import { useActor } from "@xstate/react";
import {
  FLOWERS,
  FLOWER_SEEDS,
  FlowerName,
  FlowerGrowthStage,
} from "features/game/types/flowers";
import { TimerPopover } from "../common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { FLOWER_VARIANTS } from "../lib/alternateArt";

import chest from "assets/icons/chest.png";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { hasFeatureAccess } from "lib/flags";

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

export const FlowerBed: React.FC<Props> = ({ id }) => {
  const { t } = useAppTranslation();
  const { showTimers, gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { flowers, farmActivity } = state;

  const flowerBed = flowers.flowerBeds[id];

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [congratulationsPage, setCongratulationsPage] = useState(0);
  const [showPopover, setShowPopover] = useState(false);

  useUiRefresher();

  if (!flowerBed.flower) {
    return (
      <>
        <div
          className="relative w-full h-full hover:img-highlight cursor-pointer"
          onClick={() => setShowPlantModal(true)}
        >
          <img
            src={FLOWER_VARIANTS(
              state.island.type,
              hasFeatureAccess(state, "SEASONAL_FLOWERS")
                ? state.season.season
                : "summer",
              "Red Pansy",
              "flower_bed",
            )}
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

  const growTime = FLOWER_SEEDS[FLOWERS[flower.name].seed].plantSeconds * 1000;
  const timeLeft = (flowerBed.flower?.plantedAt ?? 0) + growTime - Date.now();
  const timeLeftSeconds = timeLeft / 1000;

  const growPercentage = 100 - (Math.max(timeLeft, 0) / growTime) * 100;

  const isGrowing = timeLeft > 0;

  const stage = getGrowthStage(growPercentage, !!flower.dirty);

  const hasHarvestedBefore = !!farmActivity[`${flower.name} Harvested`];
  const reward = flower.reward;

  const handlePlotClick = () => {
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

  return (
    <>
      <div
        className={classNames("relative w-full h-full", {
          "cursor-pointer hover:img-highlight": !isGrowing,
        })}
        onClick={!isGrowing ? handlePlotClick : undefined}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        <img
          src={FLOWER_VARIANTS(
            state.island.type,
            hasFeatureAccess(state, "SEASONAL_FLOWERS")
              ? state.season.season
              : "summer",
            flower.name,
            stage,
          )}
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
              description={
                hasHarvestedBefore ? flowerBed.flower.name : "Unknown"
              }
              showPopover={showPopover}
              timeLeft={timeLeftSeconds}
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
              seconds={!flower.dirty ? timeLeftSeconds : undefined}
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
                    const boost = COLLECTIBLE_BUFF_LABELS(state)[item.name];

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
