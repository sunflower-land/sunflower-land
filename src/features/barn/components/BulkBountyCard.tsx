import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import animalFloorTile from "assets/ui/animal_floor_tile.png";
import glow from "public/world/glow.png";
import { LABEL_STYLES, Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  getAnimalLevel,
  isMaxLevel as isMaxAnimalLevel,
} from "features/game/lib/animals";
import { ANIMAL_LEVELS, type AnimalLevel } from "features/game/types/animals";
import {
  generateBountyCoins,
  generateBountyTicket,
} from "features/game/events/landExpansion/sellBounty";
import { getChapterTicket } from "features/game/types/chapters";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { Animal, AnimalBounty, GameState } from "features/game/types/game";

interface Props {
  deal: AnimalBounty;
  state: GameState;
  now: number;
  /** Animals passing isValidDeal for this deal, pre-filtered by the parent. */
  eligibleAnimals: Animal[];
  isSold: boolean;
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
}

interface PickerProps {
  deal: AnimalBounty;
  anchorColumn: number;
  cardsPerRow: number;
  eligibleAnimals: Animal[];
  onSell: (animal: Animal) => void;
}

const SELECT_CORNER_SIZE = PIXEL_SCALE * 8;
const PANEL_TAIL_SIZE = PIXEL_SCALE * 4.4;

const getAnimalExperienceProgress = (animal: Animal) => {
  const level = getAnimalLevel(animal.experience, animal.type);
  const isMaxLevel = isMaxAnimalLevel(animal.type, level);
  const currentLevelXp = ANIMAL_LEVELS[animal.type][level];
  const nextLevelXp = isMaxLevel
    ? currentLevelXp +
      (currentLevelXp - ANIMAL_LEVELS[animal.type][(level - 1) as AnimalLevel])
    : ANIMAL_LEVELS[animal.type][(level + 1) as AnimalLevel];
  const levelXp = nextLevelXp - currentLevelXp;
  const experienceInLevel = isMaxLevel
    ? (animal.experience - currentLevelXp) % levelXp
    : animal.experience - currentLevelXp;
  const xpToNext = levelXp - experienceInLevel;

  return {
    level,
    isMaxLevel,
    xpToNext,
    percentage: (experienceInLevel / levelXp) * 100,
  };
};

const getSortedEligibleAnimals = (eligibleAnimals: Animal[]) =>
  [...eligibleAnimals].sort((a, b) => a.experience - b.experience);

export const BulkBountyCard: React.FC<Props> = ({
  deal,
  state,
  now,
  eligibleAnimals,
  isSold,
  isExpanded,
  onExpandedChange,
}) => {
  const { t } = useAppTranslation();
  const chapterTicket = getChapterTicket(now);
  const { coins } = generateBountyCoins({ game: state, bounty: deal });
  const isAvailable = !isSold && eligibleAnimals.length > 0;
  const status = isSold
    ? { label: t("bounties.sold"), type: "success" as const }
    : isAvailable
      ? { label: t("available"), type: "info" as const }
      : { label: t("unavailable"), type: "default" as const };
  const toggleExpanded = () => onExpandedChange(!isExpanded);

  return (
    <div
      className="relative w-1/3 sm:w-1/4 pr-1.5 pb-2"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="relative">
        <ButtonPanel
          variant={isSold || !isAvailable ? "secondary" : "primary"}
          disabled={!isAvailable}
          onClick={isAvailable ? toggleExpanded : undefined}
        >
          <div className="flex justify-center items-center my-2 mb-6">
            <img src={ITEM_DETAILS[deal.name].image} className="w-10 z-20" />
          </div>

          <Label
            type="formula"
            className="absolute -top-3.5 -left-2"
          >{`Lvl ${deal.level}+`}</Label>

          {!!deal.coins && (
            <Label
              type="warning"
              icon={SUNNYSIDE.ui.coinsImg}
              className="absolute -bottom-2 text-center p-1"
              style={{
                left: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                height: "25px",
              }}
            >
              {coins}
            </Label>
          )}

          {getKeys(deal.items ?? {}).map((name) => (
            <Label
              key={name}
              type="warning"
              icon={ITEM_DETAILS[name].image}
              className="absolute -bottom-2 text-center p-1"
              style={{
                left: `${PIXEL_SCALE * -3}px`,
                right: `${PIXEL_SCALE * -3}px`,
                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                height: "25px",
              }}
            >
              {name !== chapterTicket
                ? deal.items?.[name]
                : generateBountyTicket({ game: state, bounty: deal, now })}
            </Label>
          ))}
        </ButtonPanel>

        <div className="relative z-30 -mt-1">
          <Label
            type={status.type}
            className="text-center"
            style={{
              width: "100%",
              height: "23px",
              borderTopWidth: 0,
            }}
            onClick={isAvailable ? toggleExpanded : undefined}
          >
            {status.label}
          </Label>
        </div>

        {isExpanded && (
          <div className="absolute inset-0 z-40 pointer-events-none">
            <img
              src={SUNNYSIDE.ui.selectBoxTL}
              className="absolute"
              style={{
                top: `${PIXEL_SCALE * -2}px`,
                left: `${PIXEL_SCALE * -2}px`,
                width: `${SELECT_CORNER_SIZE}px`,
              }}
            />
            <img
              src={SUNNYSIDE.ui.selectBoxTR}
              className="absolute"
              style={{
                top: `${PIXEL_SCALE * -2}px`,
                right: `${PIXEL_SCALE * -2}px`,
                width: `${SELECT_CORNER_SIZE}px`,
              }}
            />
            <img
              src={SUNNYSIDE.ui.selectBoxBL}
              className="absolute"
              style={{
                bottom: `${PIXEL_SCALE * -2}px`,
                left: `${PIXEL_SCALE * -2}px`,
                width: `${SELECT_CORNER_SIZE}px`,
              }}
            />
            <img
              src={SUNNYSIDE.ui.selectBoxBR}
              className="absolute"
              style={{
                right: `${PIXEL_SCALE * -2}px`,
                bottom: `${PIXEL_SCALE * -2}px`,
                width: `${SELECT_CORNER_SIZE}px`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const BulkBountyAnimalPicker: React.FC<PickerProps> = ({
  deal,
  anchorColumn,
  cardsPerRow,
  eligibleAnimals,
  onSell,
}) => {
  const { t } = useAppTranslation();
  const selectableAnimals = getSortedEligibleAnimals(eligibleAnimals);

  return (
    <InnerPanel
      className="relative z-20 mb-3 p-1"
      style={{ background: "#c28669" }}
    >
      <img
        src={SUNNYSIDE.ui.speechBubbleBottom}
        className="absolute z-30 rotate-180 pointer-events-none"
        style={{
          width: `${PANEL_TAIL_SIZE}px`,
          top: `${-PANEL_TAIL_SIZE}px`,
          left: `calc(${((anchorColumn + 0.5) / cardsPerRow) * 100}% - ${PANEL_TAIL_SIZE / 2}px)`,
        }}
      />

      <p className="text-xs mb-2">
        {t("bounties.animal.select", { name: deal.name })}
      </p>

      <div className="flex flex-wrap pt-2">
        {selectableAnimals.map((animal) => {
          const { level, isMaxLevel, xpToNext, percentage } =
            getAnimalExperienceProgress(animal);
          const progress = Math.max(0, Math.min(percentage, 100));
          const hasUpcomingMutant = !!animal.reward?.items?.[0]?.name;

          return (
            <div
              key={animal.id}
              className="relative w-1/3 sm:w-1/4 pr-1.5 pb-3"
            >
              <ButtonPanel
                variant="card"
                className="min-w-0"
                title={
                  isMaxLevel
                    ? t("sleepingAnimal.xpToNextCycle", { xpToNext })
                    : t("sleepingAnimal.xpToNextLevel", {
                        xpToNext,
                        level: level + 1,
                      })
                }
                onClick={(event) => {
                  event.stopPropagation();
                  onSell(animal);
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${animalFloorTile})`,
                    backgroundRepeat: "repeat",
                    backgroundSize: `${PIXEL_SCALE * 8}px ${PIXEL_SCALE * 16}px`,
                    imageRendering: "pixelated",
                  }}
                />

                <div className="relative flex justify-center items-center my-2 mb-8">
                  {hasUpcomingMutant && (
                    <img
                      src={glow}
                      className="absolute animate-pulsate pointer-events-none"
                      style={{
                        bottom: "-30px",
                        left: "calc(50% - 50px)",
                        width: "100px",
                        height: "100px",
                        maxWidth: "none",
                      }}
                    />
                  )}
                  {animal.type === "Chicken" && (
                    <img
                      src={SUNNYSIDE.animals.chickenShadow}
                      className="absolute left-1/2 -translate-x-1/2 z-10"
                      style={{
                        width: `${PIXEL_SCALE * 18}px`,
                        bottom: `${PIXEL_SCALE * -2}px`,
                      }}
                    />
                  )}
                  <img
                    src={ITEM_DETAILS[animal.type].image}
                    className="w-10 relative z-20"
                  />
                </div>

                <Label
                  type="formula"
                  className="absolute -top-3.5 -left-2 whitespace-nowrap"
                >{`Lvl ${level}`}</Label>

                {animal.state === "sick" && (
                  <Label
                    type="danger"
                    className="absolute -top-3.5 -right-2 text-xxs"
                  >
                    {t("bounties.animalPicker.sickOption")}
                  </Label>
                )}

                <Label
                  type="formula"
                  icon={SUNNYSIDE.icons.lightning}
                  className="absolute -bottom-2 text-center p-1 whitespace-nowrap"
                  style={{
                    left: `${PIXEL_SCALE * -3}px`,
                    right: `${PIXEL_SCALE * -3}px`,
                    width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                    height: "25px",
                    fontSize: "18px",
                    background: `linear-gradient(to right, ${LABEL_STYLES.success.background} 0%, ${LABEL_STYLES.success.background} ${progress}%, #193c3e ${progress}%, #193c3e 100%)`,
                  }}
                >
                  {t("bounties.animalPicker.xpRemaining", { xp: xpToNext })}
                </Label>
              </ButtonPanel>
            </div>
          );
        })}
      </div>
    </InnerPanel>
  );
};
