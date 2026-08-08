import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import glow from "public/world/glow.png";
import classNames from "classnames";
import { Label } from "components/ui/Label";
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
import { renderSickRewardLabel } from "./AnimalBounties";

interface Props {
  deal: AnimalBounty;
  state: GameState;
  now: number;
  /** Animals passing isValidDeal for this deal, pre-filtered by the parent. */
  eligibleAnimals: Animal[];
  selectedAnimalId?: string;
  /** Building-qualified ("henHouse:0"/"barn:0") animal keys picked by OTHER
   * bounty cards in this same bulk-sell session — building-qualified
   * because henHouse and barn animal ids both restart at "0". */
  takenAnimalKeys: Set<string>;
  /** Builds this card's building-qualified key for a raw animal id. */
  getAnimalKey: (animalId: string) => string;
  onSelect: (animalId: string | undefined) => void;
  isSold: boolean;
  /** Whether THIS card's animal list is the one currently expanded, so the
   * parent can collapse every other card when one opens. */
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  /** Non-VIP: card renders so players can see what the feature looks like,
   * but selection is disabled. */
  locked?: boolean;
}

const getXpToNextLevel = (animal: Animal) => {
  const level = getAnimalLevel(animal.experience, animal.type);
  const isMaxLevel = isMaxAnimalLevel(animal.type, level);

  const xpToNext = isMaxLevel
    ? (() => {
        const levelBeforeMaxXP =
          ANIMAL_LEVELS[animal.type][(level - 1) as AnimalLevel];
        const maxLevelXP = ANIMAL_LEVELS[animal.type][level as AnimalLevel];
        const cycleXP = maxLevelXP - levelBeforeMaxXP;
        const excessXP = animal.experience - maxLevelXP;
        return cycleXP - (excessXP % cycleXP);
      })()
    : ANIMAL_LEVELS[animal.type][(level + 1) as AnimalLevel] -
      animal.experience;

  return { level, isMaxLevel, xpToNext };
};

export const BulkBountyCard: React.FC<Props> = ({
  deal,
  state,
  now,
  eligibleAnimals,
  selectedAnimalId,
  takenAnimalKeys,
  getAnimalKey,
  onSelect,
  isSold,
  isExpanded,
  onExpandedChange,
  locked = false,
}) => {
  const { t } = useAppTranslation();
  const chapterTicket = getChapterTicket(now);

  const { coins } = generateBountyCoins({ game: state, bounty: deal });

  const selectableAnimals = eligibleAnimals
    .filter(
      (animal) =>
        !takenAnimalKeys.has(getAnimalKey(animal.id)) ||
        animal.id === selectedAnimalId,
    )
    .sort((a, b) => a.experience - b.experience);

  const selectedAnimal = selectableAnimals.find(
    (a) => a.id === selectedAnimalId,
  );

  const selectedAnimalLabel = selectedAnimal
    ? `Lvl ${getAnimalLevel(selectedAnimal.experience, selectedAnimal.type)} ${selectedAnimal.type}`
    : undefined;

  const isSelectedAnimalMutantReady = !!selectedAnimal?.reward?.items?.length;

  return (
    <div className="w-full pb-1.5">
      <div
        className={classNames(
          "relative border-2 border-transparent rounded p-1",
          { "pointer-events-none opacity-75": isSold },
        )}
      >
        <div className="flex items-center gap-1 mb-1">
          <img src={ITEM_DETAILS[deal.name].image} className="w-6" />
          <Label type="formula">{`Lvl ${deal.level}+`}</Label>
          {!!deal.coins && (
            <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
              {coins}
            </Label>
          )}
          {getKeys(deal.items ?? {}).map((name) => (
            <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
              {name !== chapterTicket ? deal.items?.[name] : "?"}
            </Label>
          ))}
          {isSold && <Label type="success">{t("bounties.sold")}</Label>}
        </div>

        {!isSold && (
          <>
            {selectableAnimals.length === 0 ? (
              <Label type="default" className="ml-1">
                {t("bounties.animal.noAnimalToSell", { name: deal.name })}
              </Label>
            ) : (
              <>
                <Label
                  type={selectedAnimalId ? "success" : "default"}
                  onClick={() => !locked && onExpandedChange(!isExpanded)}
                  className={classNames("w-full justify-between !flex", {
                    "cursor-pointer hover:brightness-110": !locked,
                    "opacity-50 cursor-not-allowed": locked,
                  })}
                >
                  <span className="flex items-center gap-1">
                    {!!selectedAnimalId && (
                      <img
                        src={SUNNYSIDE.icons.confirm}
                        alt="selected"
                        className="w-4 h-4 flex-none"
                      />
                    )}
                    <span className="text-xs font-secondary">
                      {selectedAnimalLabel ?? t("bounties.bulkSell.pickAnimal")}
                    </span>
                  </span>
                  {locked ? (
                    <img
                      src={SUNNYSIDE.icons.lock}
                      alt="locked"
                      className="w-4 h-4"
                    />
                  ) : (
                    <img
                      src={SUNNYSIDE.icons.chevron_down}
                      alt="expand"
                      className={classNames("w-4 h-4 transition-transform", {
                        "rotate-180": isExpanded,
                      })}
                    />
                  )}
                </Label>

                {!locked && isExpanded && (
                  <div className="flex flex-col gap-1 mt-1 max-h-[180px] overflow-y-auto scrollable">
                    {selectableAnimals.map((animal) => {
                      const isSelected = animal.id === selectedAnimalId;
                      const isSick = animal.state === "sick";
                      const isMutantReady = !!animal.reward?.items?.length;
                      const { level, isMaxLevel, xpToNext } =
                        getXpToNextLevel(animal);

                      return (
                        <Label
                          key={animal.id}
                          type={isSelected ? "success" : "default"}
                          onClick={() => {
                            onSelect(isSelected ? undefined : animal.id);
                            onExpandedChange(false);
                          }}
                          className="w-full justify-between !flex cursor-pointer hover:brightness-110"
                        >
                          <span className="flex items-center gap-1 min-w-0">
                            {isSelected && (
                              <img
                                src={SUNNYSIDE.icons.confirm}
                                alt="selected"
                                className="w-4 h-4 flex-none"
                              />
                            )}
                            <img
                              src={ITEM_DETAILS[deal.name].image}
                              className="w-5 flex-none"
                            />
                            <span className="text-xs font-secondary whitespace-nowrap">
                              {`Lvl ${level} ${animal.type}`}
                            </span>
                            {isSick && (
                              <Label type="danger" className="text-xxs">
                                {t("bounties.bulkSell.sickOption")}
                              </Label>
                            )}
                            {isMutantReady && (
                              <Label
                                type="vibrant"
                                icon={glow}
                                className="text-xxs"
                              >
                                {t("bounties.bulkSell.mutantOption")}
                              </Label>
                            )}
                          </span>
                          <span className="text-xxs font-secondary text-right whitespace-nowrap">
                            <span className="block">
                              {t("sleepingAnimal.xp", {
                                experience: animal.experience,
                              })}
                            </span>
                            <span className="block">
                              {isMaxLevel
                                ? t("sleepingAnimal.xpToNextCycle", {
                                    xpToNext,
                                  })
                                : t("sleepingAnimal.xpToNextLevel", {
                                    xpToNext,
                                    level: level + 1,
                                  })}
                            </span>
                          </span>
                        </Label>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {isSelectedAnimalMutantReady && (
              <Label type="vibrant" icon={glow} className="mt-1">
                {t("bounties.bulkSell.mutantWarning")}
              </Label>
            )}

            {selectedAnimal?.state === "sick" && (
              <>
                <Label type="danger" className="mt-1">
                  {t("bounties.sell.animal.sickReducedBounty")}
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {!!deal.coins &&
                    renderSickRewardLabel(
                      coins,
                      "coins",
                      SUNNYSIDE.ui.coinsImg,
                    )}
                  {getKeys(deal.items ?? {}).map((name) => {
                    const amount =
                      name === chapterTicket
                        ? generateBountyTicket({
                            game: state,
                            bounty: deal,
                            now,
                          })
                        : (deal.items?.[name] ?? 0);
                    return (
                      <React.Fragment key={name}>
                        {renderSickRewardLabel(
                          amount,
                          name,
                          ITEM_DETAILS[name].image,
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
