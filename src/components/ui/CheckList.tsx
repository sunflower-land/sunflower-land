import React, { useContext, useEffect, useState, type JSX } from "react";
import { Button } from "./Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { ButtonPanel, InnerPanel, OuterPanel } from "./Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPC_WEARABLES } from "lib/npcs";
import { Label, LabelType } from "./Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { getStreaks } from "features/world/ui/beach/Digby";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { isMinigameComplete } from "features/game/events/minigames/claimMinigamePrize";
import { PORTAL_OPTIONS } from "features/world/ui/portals/PortalChooser";
import { BUD_ORDER, getDailyBudBoxType } from "features/world/ui/chests/BudBox";
import {
  getDayOfYear,
  secondsTillReset,
  secondsToString,
} from "lib/utils/time";
import { getEntries, getKeys } from "features/game/types/craftables";
import { Bud } from "features/game/types/buds";
import { MinigameName } from "features/game/types/minigames";
import { ModalOverlay } from "./ModalOverlay";
import swords from "assets/icons/factions.webp";
import gift from "assets/icons/gift.png";
import pirate_chest from "public/world/pirate_chest.webp";
import bud from "assets/icons/bud.png";
import heart_air_balloon from "public/world/heart_air_balloon.webp";
import {
  getArtefactsFound,
  SEASONAL_ARTEFACT,
} from "features/game/types/desert";
import { getCurrentSeason } from "features/game/types/seasons";
import { hasClaimedPetalPrize } from "features/game/events/landExpansion/claimPetalPrize";
import { getBumpkinLevel } from "features/game/lib/level";
import { useNavigate } from "react-router";
import { ChestRewardsList } from "./ChestRewardsList";
import { translate } from "lib/i18n/translate";
import { useNow } from "lib/utils/hooks/useNow";

const loveIslandBoxStatus = (state: GameState) => {
  const schedule = state.floatingIsland.schedule;
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  const isOpen = schedule.some((schedule) => {
    const now = new Date();
    const start = new Date(schedule.startAt);
    const end = new Date(schedule.endAt);
    return now >= start && now <= end;
  });

  const nextScheduleTime = schedule.reduce((closestTime, schedule) => {
    const now = new Date();
    const start = new Date(schedule.startAt);

    // If schedule hasn't started yet, compare its start time
    if (now < start) {
      return closestTime === 0
        ? start.getTime()
        : Math.min(closestTime, start.getTime());
    }

    return closestTime;
  }, 0);

  const hasClaimed = hasClaimedPetalPrize({
    state,
    createdAt: Date.now(),
  });

  return { schedule, timeZone, isOpen, nextScheduleTime, hasClaimed };
};

const budBoxStatus = (state: GameState) => {
  const buds = getKeys(state.buds ?? {});
  const hasBud = buds.length > 0;

  const now = Date.now();
  const todayBud = getDailyBudBoxType(now);

  const playerBudTypes = buds.map((id) => {
    const bud = state.buds?.[id] as Bud;
    return bud.type;
  });

  let hasOpened = false;
  const openedAt = state.pumpkinPlaza.budBox?.openedAt ?? 0;

  if (openedAt) {
    hasOpened = getDayOfYear(new Date()) === getDayOfYear(new Date(openedAt));
  }

  return { hasBud, now, todayBud, playerBudTypes, hasOpened };
};

const digbyStreakStatus = (state: GameState) => {
  const collectedAt = state.desert.digging.streak?.collectedAt ?? 0;
  const hasClaimedDigbyReward =
    new Date().toISOString().substring(0, 10) ===
    new Date(collectedAt).toISOString().substring(0, 10);

  const digbyStreakCount = getStreaks({
    game: state,
    now: Date.now(),
  });

  const artefactsFound = getArtefactsFound({ game: state });

  return { hasClaimedDigbyReward, digbyStreakCount, artefactsFound };
};

const piratePotionStatus = (state: GameState) => {
  const hasPiratePotion = (state.wardrobe["Pirate Potion"] ?? 0) > 0;

  const openedAt = state.pumpkinPlaza.pirateChest?.openedAt ?? 0;
  const hasOpenedPirateChest =
    !!openedAt &&
    new Date(openedAt).toISOString().substring(0, 10) ===
      new Date().toISOString().substring(0, 10);

  return { hasPiratePotion, hasOpenedPirateChest };
};

const minigamesStatus = (minigames: GameState["minigames"]) => {
  const allMinigamesCount = PORTAL_OPTIONS.length;

  const minigameInfo = (name: MinigameName) => {
    const minigame = minigames.games[name];
    const prize = minigames.prizes[name];

    const dateKey = new Date().toISOString().slice(0, 10);
    const history = minigame?.history ?? {};

    const dailyAttempt = history[dateKey] ?? {
      attempts: 0,
      highscore: 0,
    };
    return {
      prize,
      attempts: dailyAttempt.attempts,
      highscore: dailyAttempt.highscore,
      prizeClaimedAt: dailyAttempt.prizeClaimedAt,
    };
  };

  const isMinigameCompleted = (name: MinigameName) =>
    isMinigameComplete({ minigames, name }) &&
    minigameInfo(name).prizeClaimedAt;

  const completedMinigames = PORTAL_OPTIONS.filter(({ id }) => {
    return (
      isMinigameComplete({ minigames, name: id as MinigameName }) &&
      minigameInfo(id as MinigameName).prizeClaimedAt
    );
  }).length;

  return {
    isMinigameCompleted,
    completedMinigames,
    allMinigamesCount,
    minigameInfo,
  };
};

export const checklistCount = (state: GameState, bumpkinLevel: number) => {
  // Plaza Tasks
  const hasNotClaimedLoveBox = !loveIslandBoxStatus(state).hasClaimed;

  const { hasBud, playerBudTypes, todayBud, hasOpened } = budBoxStatus(state);
  const hasNotClaimedBudBox =
    hasBud && playerBudTypes.includes(todayBud) && !hasOpened;

  const completedPlazaTasksCount = () => {
    if (bumpkinLevel >= 2) {
      return (hasNotClaimedLoveBox ? 1 : 0) + (hasNotClaimedBudBox ? 1 : 0);
    }
    return 0;
  };

  // Beach Tasks
  const hasNotClaimedDigbyBox = !digbyStreakStatus(state).hasClaimedDigbyReward;

  const { hasPiratePotion, hasOpenedPirateChest } = piratePotionStatus(state);
  const hasNotClaimedPirateBox = hasPiratePotion && !hasOpenedPirateChest;

  const completedBeachTasksCount = () => {
    if (bumpkinLevel >= 4) {
      return (hasNotClaimedDigbyBox ? 1 : 0) + (hasNotClaimedPirateBox ? 1 : 0);
    }
    return 0;
  };

  // Kingdom Tasks
  const { completedMinigames, allMinigamesCount } = minigamesStatus(
    state.minigames,
  );
  const completedKingdomTasksCount = () => {
    if (bumpkinLevel >= 7) {
      return completedMinigames !== allMinigamesCount
        ? allMinigamesCount - completedMinigames
        : 0;
    }
    return 0;
  };

  return (
    completedPlazaTasksCount() +
    completedBeachTasksCount() +
    completedKingdomTasksCount()
  );
};

export const Checklist: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden overflow-y-auto scrollable gap-y-0.5">
        <InnerPanel>
          <div className="flex justify-between items-center m-1 mb-2">
            <Label type="default">{t("checkList.title")}</Label>
            <Label icon={SUNNYSIDE.icons.stopwatch} type="info">
              {t("checkList.resetsIn", {
                time: secondsToString(secondsTillReset(), {
                  length: "short",
                }),
              })}
            </Label>
          </div>
          <div className="mb-2">
            <NoticeboardItems
              items={[
                {
                  text: t("checkList.description1"),
                  icon: SUNNYSIDE.icons.worldIcon,
                },
                {
                  text: t("checkList.description2"),
                  icon: bud,
                },
              ]}
            />
          </div>
        </InnerPanel>

        {/* Plaza */}
        <InnerPanel>
          <div className="p-0.5 sm:p-1">
            <Heading
              location={t("checkList.plaza")}
              bumpkinLevel={bumpkinLevel}
              requiredLevel={2}
              locationPath="/world/plaza"
            />
            {/* Love Island Box */}
            <LoveIslandBox bumpkinLevel={bumpkinLevel} />
            {/* Bud Box */}
            <BudBoxContent bumpkinLevel={bumpkinLevel} />
          </div>
        </InnerPanel>

        {/* Beach */}
        <InnerPanel>
          <div className="p-0.5 sm:p-1">
            <Heading
              location={t("checkList.beach")}
              bumpkinLevel={bumpkinLevel}
              requiredLevel={4}
              locationPath="/world/beach"
            />
            {/* Digging Streak */}
            <DiggingStreakContent bumpkinLevel={bumpkinLevel} />
            {/* Pirate Chest */}
            <PirateChestContent bumpkinLevel={bumpkinLevel} />
          </div>
        </InnerPanel>

        {/* Kingdom */}
        <InnerPanel>
          <div className="p-0.5 sm:p-1">
            <Heading
              location={t("checkList.kingdom")}
              bumpkinLevel={bumpkinLevel}
              requiredLevel={7}
              locationPath="/world/kingdom"
            />
            {/* Mini Games */}
            <MiniGamesContent bumpkinLevel={bumpkinLevel} />
          </div>
        </InnerPanel>
      </div>
    </>
  );
};

const LoveIslandBox: React.FC<{ bumpkinLevel: number }> = ({
  bumpkinLevel,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const now = useNow();

  const { schedule, timeZone, isOpen, nextScheduleTime, hasClaimed } =
    loveIslandBoxStatus(state);

  const [nextFlightTime, setNextFlightTime] = useState(
    (nextScheduleTime - now) / 1000,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setNextFlightTime((nextScheduleTime - Date.now()) / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [nextScheduleTime]);

  const labelText = `${hasClaimed ? "" : "0/1"} ${t("completed")}`;
  const flightTimeText = `${
    isOpen
      ? t("checkList.loveIsland.flyNow")
      : translate("checkList.nextScheduleTime", {
          time: secondsToString(nextFlightTime, {
            length: "short",
          }),
        })
  }`;

  return (
    <RowContent
      isLocked={bumpkinLevel < 2}
      title={t("checkList.loveIsland.title")}
      titleIcon={heart_air_balloon}
      labelType={hasClaimed ? "success" : "warning"}
      showConfirmIcon={hasClaimed}
      labelText={labelText}
      extraInfo={
        <div className={isOpen ? "" : "mr-1"}>
          <Label
            type={isOpen ? "success" : "info"}
            secondaryIcon={isOpen ? undefined : SUNNYSIDE.icons.stopwatch}
          >
            <p className="text-xxs sm:text-xs">{flightTimeText}</p>
          </Label>
        </div>
      }
      overlayContent={
        <div className="p-0.5">
          <div className="flex justify-between pb-1">
            <Label type="default">{t("hotAirBalloon.flightTimes")}</Label>
            {isOpen && (
              <Label type="success">{t("checkList.loveIsland.flyNow")}</Label>
            )}
          </div>
          <p className="text-xs p-1 pb-2">
            {t("checkList.loveIsland.description")}
          </p>
          <OuterPanel>
            <div className="py-0.5">
              <div className="flex justify-between mr-1">
                <Label type="default">
                  {t("checkList.loveIsland.currentTimezone")}
                </Label>
                <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
                  {timeZone}
                </Label>
              </div>

              {schedule.map((schedule, index) => {
                const start = new Date(schedule.startAt);
                const end = new Date(schedule.endAt);
                const startTime = start.toLocaleString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const endTime = end.toLocaleString("en-GB", {
                  ...(end.getDate() !== start.getDate() && {
                    weekday: "short",
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                  }),
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Label
                    type="transparent"
                    className="mt-2 mb-1 ml-4"
                    icon={SUNNYSIDE.icons.stopwatch}
                    key={index}
                  >
                    {`${startTime} - ${endTime}`}
                  </Label>
                );
              })}
            </div>
          </OuterPanel>
        </div>
      }
    />
  );
};

const BudBoxContent: React.FC<{ bumpkinLevel: number }> = ({
  bumpkinLevel,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const { hasBud, now, todayBud, playerBudTypes, hasOpened } =
    budBoxStatus(state);

  const labelText = !hasBud
    ? t("checkList.budBox.missingBudLabel")
    : hasOpened
      ? t("completed")
      : playerBudTypes.includes(todayBud)
        ? `0/1 ${t("completed")}`
        : undefined;

  return (
    <RowContent
      isLocked={bumpkinLevel < 2 || !hasBud}
      title={t("checkList.budBox.title")}
      titleIcon={gift}
      labelType={
        hasOpened
          ? "success"
          : playerBudTypes.includes(todayBud)
            ? "warning"
            : "default"
      }
      requiredItemMessage={
        !hasBud ? t("checkList.budBox.missingBudMessage") : undefined
      }
      showConfirmIcon={hasOpened}
      labelText={labelText}
      extraInfo={
        <div>
          <Label type="default">
            <p className="text-xxs sm:text-xs">
              {t("checkList.budBox.todayBudType", { budType: todayBud })}
            </p>
          </Label>
        </div>
      }
      overlayContent={
        <div className="overflow-y-auto max-h-[300px] scrollable p-2 space-y-1 -ml-1">
          <p className="text-xs mb-3">{t("checkList.budBox.description")}</p>
          {BUD_ORDER.map((_, index) => {
            const budTypeTimestamp = now + 24 * 60 * 60 * 1000 * index;
            const dailyBud = getDailyBudBoxType(budTypeTimestamp);
            const date = new Date(budTypeTimestamp);
            const ISOdate = new Date(date).toISOString().split("T")[0];

            return (
              <OuterPanel
                key={date.toISOString()}
                className="flex justify-between items-center space-y-1"
              >
                <Label
                  type={
                    playerBudTypes.includes(dailyBud) ? "success" : "default"
                  }
                  className="mr-1"
                >
                  <p className="text-xxs sm:text-xs">{dailyBud}</p>
                </Label>

                <div className="flex items-center pb-1">
                  {index === 0 && (
                    <Label
                      secondaryIcon={
                        hasOpened ? SUNNYSIDE.icons.confirm : undefined
                      }
                      type={hasOpened ? "success" : "default"}
                      className={hasOpened ? "mr-1" : ""}
                    >
                      <p className="text-xxs sm:text-xs">
                        {hasOpened
                          ? t("checkList.openedToday")
                          : t("checkList.budBox.today")}
                      </p>
                    </Label>
                  )}
                  {index > 0 && (
                    <Label type="default">
                      <p className="text-xxs sm:text-xs">{ISOdate}</p>
                    </Label>
                  )}
                </div>
              </OuterPanel>
            );
          })}
        </div>
      }
    />
  );
};

const DiggingStreakContent: React.FC<{ bumpkinLevel: number }> = ({
  bumpkinLevel,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const { hasClaimedDigbyReward, digbyStreakCount, artefactsFound } =
    digbyStreakStatus(state);
  return (
    <RowContent
      isLocked={bumpkinLevel < 4}
      title={t("checkList.diggingStreak.title")}
      titleIcon={ITEM_DETAILS["Sand Shovel"].image}
      labelType={hasClaimedDigbyReward ? "success" : "warning"}
      showConfirmIcon={hasClaimedDigbyReward}
      labelText={
        hasClaimedDigbyReward ? t("completed") : `0/1 ${t("completed")}`
      }
      overlayContent={
        <div className="overflow-y-auto max-h-[300px] scrollable p-2 space-y-1 -ml-1">
          <p className="text-xs p-1 pb-2">
            {t("checkList.diggingStreak.description")}
          </p>
          <OuterPanel className="flex justify-between items-center">
            <div className="flex items-center">
              <NPCIcon
                width={PIXEL_SCALE * 13}
                parts={NPC_WEARABLES["digby"]}
              />
              <div className="flex flex-col items-start gap-y-1">
                <Label
                  type={hasClaimedDigbyReward ? "success" : "default"}
                  icon={
                    hasClaimedDigbyReward ? SUNNYSIDE.icons.confirm : undefined
                  }
                  className={hasClaimedDigbyReward ? "ml-1" : ""}
                >
                  <p className="text-xxs sm:text-xs">
                    {t("checkList.diggingStreak.title")}
                  </p>
                </Label>
                <p className="text-xxs ml-1">
                  {t("checkList.diggingStreak.streakCount", {
                    count: digbyStreakCount,
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col text-xxs items-end">
              <Label
                type="default"
                secondaryIcon={
                  ITEM_DETAILS[SEASONAL_ARTEFACT[getCurrentSeason()]].image
                }
                className="mr-1"
              >
                <p className="text-xxs sm:text-xs">
                  {`${artefactsFound}/3 ${t("checkList.diggingStreak.found")}`}
                </p>
              </Label>
            </div>
          </OuterPanel>
        </div>
      }
    />
  );
};

const PirateChestContent: React.FC<{ bumpkinLevel: number }> = ({
  bumpkinLevel,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const { hasPiratePotion, hasOpenedPirateChest } = piratePotionStatus(state);
  return (
    <div className="mt-1">
      <RowContent
        isLocked={bumpkinLevel < 4 || !hasPiratePotion}
        title={t("checkList.pirateChest.title")}
        titleIcon={pirate_chest}
        labelType={hasOpenedPirateChest ? "success" : "warning"}
        requiredItemMessage={
          !hasPiratePotion
            ? t("checkList.pirateChest.missingPotionMessage")
            : undefined
        }
        showConfirmIcon={hasOpenedPirateChest}
        labelText={
          !hasPiratePotion
            ? t("checkList.pirateChest.missingPotionLabel")
            : hasOpenedPirateChest
              ? t("completed")
              : `0/1 ${t("completed")}`
        }
        overlayContent={
          <div className="max-h-[300px] overflow-y-auto scrollable">
            <div className="p-1">
              {hasOpenedPirateChest && (
                <Label
                  type="success"
                  icon={SUNNYSIDE.icons.confirm}
                  className="ml-1"
                >
                  {t("checkList.openedToday")}
                </Label>
              )}
              <p className="text-xs mt-1 mx-1">
                {t("checkList.pirateChest.description")}
              </p>
            </div>
            <ChestRewardsList
              type="Pirate Chest"
              isSubsequentInMultiList={true}
            />
          </div>
        }
      />
    </div>
  );
};

const MiniGamesContent: React.FC<{ bumpkinLevel: number }> = ({
  bumpkinLevel,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const {
    isMinigameCompleted,
    completedMinigames,
    allMinigamesCount,
    minigameInfo,
  } = minigamesStatus(state.minigames);

  const hasCompletedAll = completedMinigames === allMinigamesCount;

  return (
    <RowContent
      isLocked={bumpkinLevel < 7}
      title={t("checkList.miniGames.title")}
      titleIcon={swords}
      labelType={hasCompletedAll ? "success" : "warning"}
      showConfirmIcon={hasCompletedAll}
      labelText={`${completedMinigames}/${allMinigamesCount} ${t("completed")}`}
      overlayContent={
        <div className="overflow-y-auto max-h-[300px] scrollable p-2 space-y-1 -ml-1">
          <p className="text-xs p-1 pb-2">
            {t("checkList.miniGames.description")}
          </p>
          {PORTAL_OPTIONS.map((option) => {
            return (
              <OuterPanel
                className="flex justify-between items-center"
                key={option.id}
              >
                <div className="flex items-center">
                  <NPCIcon
                    width={PIXEL_SCALE * 13}
                    parts={NPC_WEARABLES[option.npc]}
                  />
                  <div className="flex flex-col items-start gap-y-1">
                    <Label
                      type={
                        isMinigameCompleted(option.id) ? "success" : "default"
                      }
                      icon={
                        isMinigameCompleted(option.id)
                          ? SUNNYSIDE.icons.confirm
                          : undefined
                      }
                      className={isMinigameCompleted(option.id) ? "ml-1" : ""}
                    >
                      <p className="text-xxs sm:text-xs">{option.title}</p>
                    </Label>
                    <p className="text-xxs ml-1">
                      {t("checkList.miniGames.missionPoints", {
                        number: minigameInfo(option.id)?.prize?.score ?? 0,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-xxs items-end">
                  {getEntries(minigameInfo(option.id)?.prize?.items ?? {}).map(
                    (entry, index) =>
                      entry && (
                        <Label
                          type="default"
                          key={index}
                          secondaryIcon={ITEM_DETAILS[entry[0]].image}
                          className="mr-1"
                        >
                          <p className="text-xxs sm:text-xs">
                            {`${entry[1]} ${entry[0]}`}
                          </p>
                        </Label>
                      ),
                  )}
                </div>
              </OuterPanel>
            );
          })}
        </div>
      }
    />
  );
};

const Heading: React.FC<{
  location: string;
  bumpkinLevel: number;
  requiredLevel: number;
  locationPath: string;
}> = ({ location, requiredLevel, bumpkinLevel, locationPath }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const isLocked = bumpkinLevel < requiredLevel;
  return (
    <div
      className={`flex justify-between items-center ${isLocked ? "mb-0.5" : ""}`}
    >
      <div className="flex ml-2">
        <Label type="default" icon={SUNNYSIDE.icons.worldIcon}>
          <p>{location}</p>
        </Label>
      </div>
      {isLocked ? (
        <Label
          type="danger"
          icon={SUNNYSIDE.icons.player}
          secondaryIcon={SUNNYSIDE.icons.lock}
          className="mr-2"
        >
          {t("level.number", { level: requiredLevel })}
        </Label>
      ) : (
        <Button
          className="w-fit"
          onClick={isLocked ? undefined : () => navigate(locationPath)}
          disabled={isLocked}
        >
          <div className="flex flex-row -m-1.5">
            <p className="text-xxs sm:text-xs mr-0.5">
              {t("checkList.travel")}
            </p>
            <img src={SUNNYSIDE.icons.search} className="w-4 h-4" />
          </div>
        </Button>
      )}
    </div>
  );
};

const RowContent: React.FC<{
  isLocked: boolean;
  title: string;
  titleIcon: string;
  labelType: LabelType;
  requiredItemMessage?: string;
  showConfirmIcon: boolean;
  labelText?: string;
  extraInfo?: JSX.Element;
  overlayContent?: JSX.Element;
}> = ({
  isLocked,
  title,
  titleIcon,
  labelType,
  requiredItemMessage,
  showConfirmIcon,
  labelText,
  extraInfo,
  overlayContent,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const secondaryIcon = showConfirmIcon
    ? SUNNYSIDE.icons.confirm
    : requiredItemMessage
      ? SUNNYSIDE.icons.lock
      : undefined;

  return (
    <>
      <ButtonPanel
        onClick={isLocked ? undefined : () => setShowOverlay(!showOverlay)}
        disabled={isLocked}
      >
        <div
          className={`flex justify-between flex-wrap items-center ${requiredItemMessage ? "py-0.5" : "py-2"}`}
        >
          <div className="flex items-center">
            <img src={titleIcon} className="w-7 mr-2" />
            <p className="text-xs sm:text-sm w-14 sm:w-fit">{title}</p>
          </div>
          <div className="flex flex-col md:flex-row-reverse items-end gap-1">
            {labelText && (
              <Label
                type={requiredItemMessage ? "danger" : labelType}
                secondaryIcon={secondaryIcon}
                className={`${(showConfirmIcon || requiredItemMessage) && "mr-1"}`}
              >
                <p className="text-xxs sm:text-xs">{labelText}</p>
              </Label>
            )}
            {!requiredItemMessage && extraInfo}
          </div>
        </div>
        {requiredItemMessage && (
          <p className="text-xxs my-1 ml-1">{requiredItemMessage}</p>
        )}
      </ButtonPanel>

      <ModalOverlay
        show={showOverlay}
        onBackdropClick={() => setShowOverlay(false)}
      >
        <CloseButtonPanel
          onClose={() => setShowOverlay(false)}
          tabs={[{ name: title, icon: titleIcon }]}
        >
          {overlayContent}
        </CloseButtonPanel>
      </ModalOverlay>
    </>
  );
};
