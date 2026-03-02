import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import {
  DiggingFormation,
  DIGGING_FORMATIONS,
  getArtefactsFound,
  CHAPTER_ARTEFACT,
  hasClaimedReward,
  DiggingFormationName,
} from "features/game/types/desert";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";
import { secondsTillReset, secondsToString } from "lib/utils/time";
import React, { useContext, useEffect, useState } from "react";
import powerup from "assets/icons/level_up.png";
import gift from "assets/icons/gift.png";
import rewardIcon from "assets/icons/stock.webp";

import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NoticeboardItems } from "../kingdom/KingdomNoticeboard";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BuffLabel } from "features/game/types";
import { SquareIcon } from "components/ui/SquareIcon";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { CollectibleName } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { getRemainingDigs } from "features/island/hud/components/DesertDiggingDisplay";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ResizableBar } from "components/ui/ProgressBar";
import { Revealed } from "features/game/components/Revealed";
import { ChestRevealing, ChestRewardType } from "../chests/ChestRevealing";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  getCurrentChapter,
  getChapterArtefact,
} from "features/game/types/chapters";
import { ChestRewardsList } from "components/ui/ChestRewardsList";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useNow } from "lib/utils/hooks/useNow";

export function hasReadDigbyIntro() {
  return !!localStorage.getItem("digging.intro");
}

function acknowledgeIntro() {
  return localStorage.setItem("digging.intro", new Date().toISOString());
}

function centerFormation(formation: DiggingFormation): DiggingFormation {
  const totalX = formation.reduce((sum, item) => sum + item.x, 0);
  const totalY = formation.reduce((sum, item) => sum + item.y, 0);
  const centerX = Math.floor(totalX / formation.length);
  const centerY = Math.floor(totalY / formation.length);

  return formation.map((item) => ({
    ...item,
    x: item.x - centerX - 0.5,
    y: item.y - centerY - 0.5,
  }));
}

export const Pattern: React.FC<{
  pattern: DiggingFormation;
  isDiscovered: boolean;
  now: number;
}> = ({ pattern, isDiscovered, now }) => {
  const width = 25;

  const centeredPattern = centerFormation(pattern);
  return (
    <div
      className="relative w-full h-0"
      style={{
        paddingBottom: "100%",
        backgroundImage: `url(${SUNNYSIDE.ui.site_bg})`,

        backgroundSize: "100%",
        borderRadius: "6px",
      }}
    >
      {isDiscovered && (
        <img
          src={SUNNYSIDE.icons.confirm}
          className="absolute -top-2 -right-2 w-6"
        />
      )}

      {centeredPattern.map(({ name, x, y }) => (
        <div
          className="absolute p-0.5"
          key={`${name}-${x}-${y}`}
          style={{
            top: `${width * (y + 1.5)}%`,
            left: `${width * (x + 1.5)}%`,
            width: `${width}%`,
            height: `${width}%`,
          }}
        >
          <img
            className="w-full h-full"
            src={
              ITEM_DETAILS[
                name === "Seasonal Artefact"
                  ? CHAPTER_ARTEFACT[getCurrentChapter(now)]
                  : name
              ].image
            }
            key={`${name}-${x}-${y}`}
          />
        </div>
      ))}
    </div>
  );
};

const CountdownLabel = () => (
  <Label className="ml-1" type="info" icon={SUNNYSIDE.icons.stopwatch}>
    {`${secondsToString(secondsTillReset(), {
      length: "medium",
      removeTrailingZeros: true,
    })} left`}
  </Label>
);

export function getStreaks({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): number {
  const collectedAt = game.desert.digging.streak?.collectedAt ?? 0;

  const collectedDate = new Date(collectedAt).toISOString().substring(0, 10);
  const currentDate = new Date(now).toISOString().substring(0, 10);
  const streakCount = game.desert.digging.streak?.count ?? 0;

  // Calculate the day difference
  const dayDifference =
    (new Date(currentDate).getTime() - new Date(collectedDate).getTime()) /
    (1000 * 60 * 60 * 24);

  // Reset streaks if they miss a day
  if (dayDifference > 1) {
    return 0;
  }

  return streakCount;
}

export const DailyPuzzle: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  // Just a prolonged UI state to show the shuffle of reward items
  const [isPicking, setIsPicking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const now = useNow();

  const { patterns, completedPatterns = [] } =
    gameState.context.state.desert.digging;
  const streak = gameState.context.state.desert.digging.streak ?? {
    count: 0,
    collectedAt: 0,
    totalClaimed: 0,
  };

  const { t } = useAppTranslation();

  const artefactsFound = getArtefactsFound({
    game: gameState.context.state,
    now,
  });
  const percentage = Math.round((artefactsFound / 3) * 100);

  const hasClaimedReward =
    new Date().toISOString().substring(0, 10) ===
    new Date(streak.collectedAt).toISOString().substring(0, 10);

  const streakCount = getStreaks({
    game: gameState.context.state,
    now,
  });

  const open = async () => {
    setIsPicking(true);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    gameService.send("REVEAL", {
      event: {
        type: "diggingReward.collected",
        farmId: gameState.context.farmId,
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
    setIsPicking(false);
  };

  if (isPicking || (gameState.matches("revealing") && isRevealing)) {
    let type: ChestRewardType = "Basic Desert Rewards";

    if (streakCount >= 4) {
      type = "Advanced Desert Rewards";
    }

    if (streakCount >= 10) {
      type = "Expert Desert Rewards";
    }

    return <ChestRevealing type={type} />;
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Revealed
        onAcknowledged={() => {
          setIsRevealing(false);
        }}
      />
    );
  }

  return (
    <>
      <div className="p-1">
        <div className="flex justify-between mb-1">
          <Label type="default">{t("digby.puzzle")}</Label>
          <CountdownLabel />
        </div>
        <span className="text-xs mt-2">{t("digby.today")}</span>
        <div
          className="flex flex-wrap  scrollable overflow-y-auto pt-2 overflow-x-hidden pr-1"
          style={{ maxHeight: "300px" }}
        >
          <Patterns
            patterns={patterns}
            completedPatterns={completedPatterns}
            now={now}
          />
        </div>

        <div className="flex justify-between items-center mt-2 mb-1">
          {hasClaimedReward ? (
            <Label type="success" icon={SUNNYSIDE.icons.confirm}>
              {[t("digby.streak"), streakCount].join(" - ")}
            </Label>
          ) : (
            <Label type="default">
              {[t("digby.streak"), streakCount].join(" - ")}
            </Label>
          )}

          <div className="flex items-center">
            <img src={gift} className="h-5 mr-2" />
            <ResizableBar
              percentage={percentage}
              type={"progress"}
              outerDimensions={{
                width: 24,
                height: 7,
              }}
            />
            <span className="text-xs ml-2">{`${artefactsFound}/3`}</span>
            <img
              src={ITEM_DETAILS[CHAPTER_ARTEFACT[getCurrentChapter(now)]].image}
              className="h-5 ml-1"
            />
          </div>
        </div>

        <div className="mb-2">
          <span className="text-xs">
            {t("digby.streakReward", {
              name: CHAPTER_ARTEFACT[getCurrentChapter(now)],
            })}
          </span>
        </div>
      </div>
      {!hasClaimedReward && (
        <Button onClick={open} disabled={percentage < 100}>
          {t("claim")}
        </Button>
      )}
    </>
  );
};

const Patterns: React.FC<{
  patterns: DiggingFormationName[];
  completedPatterns: DiggingFormationName[];
  now: number;
}> = ({ patterns, completedPatterns, now }) => {
  const completedPatternCount = completedPatterns.reduce(
    (acc, pattern) => {
      acc[pattern] = (acc[pattern] || 1) + 1;
      return acc;
    },
    {} as Record<DiggingFormationName, number>,
  );

  return (
    <>
      {patterns.map((pattern, index) => {
        const isDiscovered = completedPatterns.includes(pattern);

        // Make sure the number of completed patterns is respected
        // ie it doesn't tick off all duplicate patterns if only one set is found
        if (completedPatternCount[pattern] > 0) {
          completedPatternCount[pattern] = completedPatternCount[pattern] - 1;
        }

        return (
          <div key={index} className="w-1/4 sm:w-1/4">
            <div className="m-1">
              <Pattern
                pattern={DIGGING_FORMATIONS[pattern]}
                isDiscovered={
                  isDiscovered && completedPatternCount[pattern] !== 0
                }
                now={now}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

const isWearable = (
  item: BumpkinItem | CollectibleName,
): item is BumpkinItem => {
  return getKeys(ITEM_IDS).includes(item as BumpkinItem);
};

export const getItemImage = (item: BumpkinItem | CollectibleName): string => {
  if (!item) return "";

  if (isWearable(item)) {
    return getImageUrl(ITEM_IDS[item]);
  }

  return ITEM_DETAILS[item].image;
};

interface BoostDigItem {
  location: string;
  buff: BuffLabel[];
}

const BoostDigItems: (
  state: GameState,
  now: number,
) => Partial<Record<BumpkinItem | CollectibleName, BoostDigItem>> = (
  state,
  now,
) => ({
  "Pharaoh Chicken": {
    buff: COLLECTIBLE_BUFF_LABELS["Pharaoh Chicken"]?.({
      skills: state.bumpkin.skills,
      collectibles: state.collectibles,
    }) as BuffLabel[],
    location: "Marketplace",
  },
  "Heart of Davy Jones": {
    buff: COLLECTIBLE_BUFF_LABELS["Heart of Davy Jones"]?.({
      skills: state.bumpkin.skills,
      collectibles: state.collectibles,
    }) as BuffLabel[],
    location: "Marketplace",
  },
  "Bionic Drill": {
    buff: BUMPKIN_ITEM_BUFF_LABELS["Bionic Drill"] as BuffLabel[],
    location: "Artefact Shop",
  },
  Meerkat: {
    buff: COLLECTIBLE_BUFF_LABELS.Meerkat?.({
      skills: state.bumpkin.skills,
      collectibles: state.collectibles,
    }) as BuffLabel[],
    location: "Megastore",
  },
  ...(getCurrentChapter(now) === "Pharaoh's Treasure"
    ? {
        "Pharaoh's Treasure Banner": {
          buff: [
            {
              shortDescription: "+5 digs",
              labelType: "vibrant",
              boostTypeIcon: gift,
            },
          ],
          location: "VIP Item",
        },
      }
    : {}),
});

const Rewards: React.FC = () => {
  const [showRewards, setShowRewards] = useState(false);
  const { t } = useAppTranslation();
  const now = useNow();
  return (
    <>
      {/* A button instead of a 4th tab to avoid
       * overflowing the tab list on small screens */}
      <div className="absolute -top-9 right-0">
        <Button onClick={() => setShowRewards(true)}>
          <div className="flex justify-between text-xs -m-1 space-x-1">
            <img src={rewardIcon} className="w-4" />
            <p>{t("chestRewardsList.rewardsTitle")}</p>
          </div>
        </Button>
      </div>

      <ModalOverlay
        show={showRewards}
        onBackdropClick={() => setShowRewards(false)}
      >
        {showRewards && (
          <CloseButtonPanel
            tabs={[
              {
                id: "rewards",
                icon: rewardIcon,
                name: t("chestRewardsList.rewardsTitle"),
              },
            ]}
            onClose={() => setShowRewards(false)}
          >
            <div className="flex flex-col gap-y-4 overflow-y-auto max-h-[400px] scrollable">
              <ChestRewardsList
                type="Basic Desert Rewards"
                listTitle={t("chestRewardsList.desertReward.listTitle1")}
                isFirstInMultiList
                chestDescription={[
                  {
                    text: t("chestRewardsList.desertReward.desc1"),
                    icon: ITEM_DETAILS["Sand Drill"].image,
                  },
                  {
                    text: t("chestRewardsList.desertReward.desc2"),
                    icon: ITEM_DETAILS[getChapterArtefact(now)].image,
                  },
                ]}
              />
              <ChestRewardsList
                type="Advanced Desert Rewards"
                listTitle={t("chestRewardsList.desertReward.listTitle2")}
                isSubsequentInMultiList
              />
              <ChestRewardsList
                type="Expert Desert Rewards"
                listTitle={t("chestRewardsList.desertReward.listTitle3")}
                isSubsequentInMultiList
              />
            </div>
          </CloseButtonPanel>
        )}
      </ModalOverlay>
    </>
  );
};

type DigbyTab = "patterns" | "guide" | "extras";

const getDefaultTab = (game: GameState, now: number): DigbyTab => {
  if (!hasReadDigbyIntro()) return "guide";

  const remainingDigs = getRemainingDigs(game);
  const artefactsFound = getArtefactsFound({ game, now });
  const percentage = Math.round((artefactsFound / 3) * 100);
  const hasClaimedStreakReward = hasClaimedReward({ game });

  if (remainingDigs <= 0) {
    return "extras";
  } else if (percentage >= 100 && !hasClaimedStreakReward) {
    return "patterns";
  }

  return "patterns";
};

export const Digby: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const now = useNow();
  const [tab, setTab] = useState<DigbyTab>(
    getDefaultTab(gameState.context.state, now),
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const inventory = gameState.context.state.inventory;
  const digsLeft = getRemainingDigs(gameState.context.state);

  const artefactsFound = getArtefactsFound({
    game: gameState.context.state,
    now,
  });
  const percentage = Math.round((artefactsFound / 3) * 100);
  const hasClaimedStreakReward = hasClaimedReward({
    game: gameState.context.state,
  });

  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeIntro();
  }, []);

  const confirmBuyMoreDigs = () => {
    onClose();
    gameService.send({ type: "desert.digsBought" });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: 10,
      item: "DesertDigs",
      type: "Fee",
    });
  };

  const canAfford = (inventory["Gem"] ?? new Decimal(0))?.gte(10);

  return (
    <>
      <CloseButtonPanel
        setCurrentTab={setTab}
        currentTab={tab}
        tabs={[
          {
            id: "patterns",
            icon: ITEM_DETAILS["Sand Shovel"].image,
            name: t("digby.patterns"),
            alert: percentage >= 100 && !hasClaimedStreakReward,
          },
          {
            id: "guide",
            icon: SUNNYSIDE.icons.expression_confused,
            name: t("guide"),
          },
          {
            id: "extras",
            icon: powerup,
            name: t("digby.extras"),
          },
        ]}
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.digby}
      >
        {tab === "patterns" && (
          <>
            <DailyPuzzle />
          </>
        )}
        {tab === "guide" && (
          <div className="pt-2">
            <NoticeboardItems
              items={[
                {
                  icon: ITEM_DETAILS["Sand Shovel"].image,
                  text: t("digby.guide.one"),
                },
                {
                  icon: ITEM_DETAILS["Crab"].image,
                  text: t("digby.guide.two"),
                },
                {
                  icon: ITEM_DETAILS["Sand"].image,
                  text: t("digby.guide.three"),
                },
                {
                  icon: SUNNYSIDE.icons.stopwatch,
                  text: t("digby.guide.four"),
                },
              ]}
            />
            <Button onClick={() => setTab("patterns")}>{t("ok")}</Button>
          </div>
        )}
        {tab === "extras" && (
          <>
            {!showConfirm && (
              <>
                <div className="p-1">
                  <div className="flex items-center justify-between space-x-1 mb-1">
                    <Label type="default">{t("desert.extraDigs")}</Label>
                    <Label type="default" icon={SUNNYSIDE.tools.sand_shovel}>
                      <span className="text">
                        {t("desert.hud.digsLeft", { digsLeft })}
                      </span>
                    </Label>
                  </div>
                  <span className="text-xs my-2">
                    {t("digby.moreDigsIntro")}
                  </span>
                  <div className="flex flex-col my-2 space-y-1">
                    {Object.entries(
                      BoostDigItems(gameState.context.state, now),
                    ).map(([item, itemData]) => (
                      <div key={item} className="flex space-x-2">
                        <div
                          className="bg-brown-600 cursor-pointer relative"
                          style={{
                            ...pixelDarkBorderStyle,
                          }}
                        >
                          <SquareIcon
                            icon={getItemImage(
                              item as BumpkinItem | CollectibleName,
                            )}
                            width={20}
                          />
                        </div>
                        <div className="flex flex-col justify-center space-y-1">
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-xs">{item}</span>
                            <span className="text-xxs italic">
                              {itemData.location}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {itemData.buff.map(
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
                                >
                                  {shortDescription}
                                </Label>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  disabled={!canAfford}
                  onClick={canAfford ? () => setShowConfirm(true) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <p>{t("digby.buyMoreDigs")}</p>
                    <img src={ITEM_DETAILS.Gem.image} className="w-4" />
                  </div>
                </Button>
              </>
            )}
            {showConfirm && (
              <>
                <div className="flex flex-col p-2 pb-0 items-center">
                  <span className="text-sm text-start w-full mb-1">
                    {t("desert.buyDigs.confirmation")}
                  </span>
                </div>
                <div className="flex justify-content-around mt-2 space-x-1">
                  <Button onClick={() => setShowConfirm(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={confirmBuyMoreDigs}>{t("confirm")}</Button>
                </div>
              </>
            )}
          </>
        )}
      </CloseButtonPanel>

      <Rewards />
    </>
  );
};
