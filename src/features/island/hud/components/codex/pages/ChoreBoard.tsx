import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";

import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { getImageUrl } from "lib/utils/getImageURLS";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";
import chapterPoints from "assets/icons/red_medal_short.webp";

import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getChoreProgress,
  NPC_CHORE_UNLOCKS,
  NPC_CHORES,
  NpcChore,
} from "features/game/types/choreBoard";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { ResizableBar } from "components/ui/ProgressBar";
import { Button } from "components/ui/Button";
import { getBumpkinLevel } from "features/game/lib/level";
import lockIcon from "assets/icons/lock.png";

import { GameState, InventoryItemName } from "features/game/types/game";
import { CHORE_DETAILS } from "../lib/choreDetails";
import { generateChoreRewards } from "features/game/events/landExpansion/completeNPCChore";
import { CHORE_DIALOGUES } from "features/game/types/stories";
import { isMobile } from "mobile-device-detect";
import { Context } from "features/game/GameProvider";
import { formatNumber } from "lib/utils/formatNumber";
import { useNow } from "lib/utils/hooks/useNow";
import { pixelVibrantBorderStyle } from "features/game/lib/style";
import { getChapterTaskPoints } from "features/game/types/tracks";

interface Props {
  state: GameState;
}

export const ChoreBoard: React.FC<Props> = ({ state }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const now = useNow();

  const { choreBoard, bumpkin } = state;
  const { chores } = choreBoard;

  const [selectedId, setSelectedId] = useState<NPCName | undefined>(() => {
    if (isMobile) {
      return undefined;
    }
    return getKeys(chores)[0];
  });

  const end = useCountdown(weekResetsAt());
  const level = getBumpkinLevel(bumpkin.experience ?? 0);

  const previewNpc = selectedId ?? getKeys(chores)[0];
  const previewChore = chores[previewNpc];

  const messages = CHORE_DIALOGUES[previewNpc];

  // Pick random message based on day of week
  const dayOfWeek = new Date().getDate();
  const dialogue = messages?.[dayOfWeek % messages.length];

  const nextUnlock = getKeys(NPC_CHORE_UNLOCKS)
    .filter((name) => name in chores)
    .sort((a, b) => (NPC_CHORE_UNLOCKS[a] > NPC_CHORE_UNLOCKS[b] ? 1 : -1))
    .find((npc) => level < (NPC_CHORE_UNLOCKS?.[npc] ?? 0));

  const handleCompleteChore = (npcName: NPCName) => {
    gameService.send({
      type: "chore.fulfilled",
      npcName,
    });
  };

  const unlockedChores = getKeys(chores).filter(
    (npc) => level >= NPC_CHORE_UNLOCKS[npc as NPCName],
  );
  const chapterTicket = getChapterTicket(now);
  const chapter = getCurrentChapter(now);

  const rewards = generateChoreRewards({
    game: state,
    chore: previewChore as NpcChore,
    now: new Date(),
  });
  const tickets = rewards[chapterTicket] ?? 0;

  return (
    <div className="flex md:flex-row flex-col-reverse md:mr-1 items-start h-full">
      <InnerPanel
        className={classNames(
          "flex flex-col h-full overflow-hidden scrollable overflow-y-auto pl-1 md:flex w-full md:w-2/3",
          {
            hidden: selectedId,
          },
        )}
      >
        <div className="p-1">
          <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
            <Label type="default">{t("chores.weeklyChores")}</Label>
            <Label
              type={end.days < 1 ? "danger" : "info"}
              icon={SUNNYSIDE.icons.stopwatch}
            >
              <TimerDisplay fontSize={24} time={end} />
            </Label>
          </div>
        </div>

        <p className="text-xs mb-2 px-2">
          {t("chores.completeChoresToEarn", { chapterTicket })}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 w-full mt-1">
          {unlockedChores.map((chore) => (
            <ChoreCard
              key={chore}
              chore={chores[chore] as NpcChore}
              npc={chore}
              selected={selectedId}
              onClick={setSelectedId}
              state={state}
            />
          ))}
          {nextUnlock && <LockedChoreCard npc={nextUnlock} />}
        </div>
      </InnerPanel>
      {previewChore && (
        <div
          className={classNames("md:ml-1  flex-1 relative h-auto w-full", {
            hidden: !selectedId,
          })}
        >
          <InnerPanel
            className={classNames(
              " md:flex md:flex-col items-center  relative",
            )}
          >
            <img
              src={SUNNYSIDE.icons.arrow_left}
              className={classNames(
                "absolute top-2 left-2 cursor-pointer md:hidden z-10",
                {
                  hidden: !selectedId,
                  block: !!selectedId,
                },
              )}
              style={{ width: `${PIXEL_SCALE * 11}px` }}
              onClick={() => setSelectedId(undefined)}
            />
            <div
              className="mb-1 mx-auto w-full col-start-1 row-start-1 overflow-hidden z-0 rounded-lg relative"
              style={{
                height: `${PIXEL_SCALE * 50}px`,
                background:
                  "linear-gradient(0deg, rgba(4,159,224,1) 0%, rgba(31,109,213,1) 100%)",
              }}
            >
              <p
                className="z-10 absolute bottom-1 right-1.5 capitalize text-xs"
                style={{
                  background: "#ffffffaf",
                  padding: "2px",
                  borderRadius: "3px",
                }}
              >
                {selectedId}
              </p>

              <div
                className="absolute -inset-2 bg-repeat"
                style={{
                  height: `${PIXEL_SCALE * 50}px`,
                  backgroundImage: `url(${SUNNYSIDE.ui.heartBg})`,
                  backgroundSize: `${32 * PIXEL_SCALE}px`,
                }}
              />

              <div
                className="absolute -inset-2 bg-repeat"
                style={{
                  height: `${PIXEL_SCALE * 80}px`,
                  backgroundImage: `url(${getImageUrl(ITEM_IDS[NPC_WEARABLES[previewNpc].background!])})`,
                  backgroundSize: "100%",
                }}
              />
              <div key={selectedId} className="w-9/12 md:w-full md:-ml-8">
                <DynamicNFT
                  key={selectedId}
                  bumpkinParts={NPC_WEARABLES[previewNpc]}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2 p-1 w-full">
              {dialogue && <p className="text-xs">{dialogue}</p>}

              <div className="text-xs flex justify-between flex-wrap items-center mb-2">
                <Label type="default">
                  {CHORE_DETAILS[previewChore.name].description}
                </Label>
                <p>{`${formatNumber(
                  Math.min(
                    getChoreProgress({
                      chore: previewChore,
                      game: state,
                    }),
                    NPC_CHORES[previewChore.name].requirement,
                  ),
                )}/${NPC_CHORES[previewChore.name].requirement}`}</p>
              </div>

              {!previewChore.completedAt && (
                <Button
                  className="h-12 relative !mt-4"
                  disabled={
                    !!previewChore.completedAt ||
                    getChoreProgress({
                      chore: previewChore,
                      game: state,
                    }) < NPC_CHORES[previewChore.name].requirement
                  }
                  onClick={() => {
                    handleCompleteChore(previewNpc);
                    if (isMobile) {
                      setSelectedId(undefined);
                    }
                  }}
                >
                  {t("chores.complete")}
                  <div className="flex absolute right-0 -top-5">
                    <ChoreRewardLabel chore={previewChore} state={state} />
                  </div>
                </Button>
              )}

              {previewChore.completedAt && (
                <div className="flex items-center">
                  <img src={SUNNYSIDE.icons.confirm} className="mr-2 h-6" />
                  <p className="text-sm">{t("chores.completed")}</p>
                </div>
              )}
            </div>
          </InnerPanel>

          {!!tickets && (
            <div
              className={classNames(
                `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
              )}
              style={{
                background: "#b65389",
                color: "#ffffff",
                ...pixelVibrantBorderStyle,
              }}
            >
              <img src={chapterPoints} className="h-4 mr-2" />
              <p className="text-xs">
                {`+${getChapterTaskPoints({ task: "chore", points: tickets })} ${chapter} points`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ChoreCard: React.FC<{
  chore: NpcChore;
  npc: NPCName;
  selected?: NPCName;
  onClick: (npc: NPCName) => void;
  state: GameState;
}> = ({ npc, chore, onClick, state }) => {
  return (
    <div className="py-1 px-1" key={npc}>
      <ButtonPanel
        onClick={() => onClick(npc)}
        className={classNames("w-full relative cursor-pointer", {
          "!bg-red": !!chore.completedAt,
        })}
        variant={chore.completedAt ? "secondary" : "primary"}
        style={{ paddingBottom: chore.completedAt ? "16px" : "10px" }}
      >
        <div className="flex absolute -right-2 -top-4">
          <ChoreRewardLabel chore={chore} state={state} />
        </div>
        {!chore.completedAt &&
          getChoreProgress({
            chore,
            game: state,
          }) >= NPC_CHORES[chore.name].requirement && (
            <img
              src={SUNNYSIDE.icons.heart}
              className="h-6 absolute -top-4 -left-3"
            />
          )}
        {chore.completedAt && (
          <div className="absolute -bottom-4 left-0 w-full flex justify-center">
            <img src={SUNNYSIDE.icons.confirm} className="h-6" />
          </div>
        )}
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="relative mb-2 mr-0.5 ">
              <NPCIcon parts={NPC_WEARABLES[npc]} />
            </div>
            <div className="flex flex-col items-center">
              <img className="h-6" src={CHORE_DETAILS[chore.name].icon} />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <span className="text-xs line-clamp-2 text-center truncate">
            {CHORE_DETAILS[chore.name].description}
          </span>
        </div>
        {!chore.completedAt && (
          <div className="absolute -bottom-4 left-0 w-full flex justify-center">
            <ResizableBar
              percentage={
                (getChoreProgress({
                  chore,
                  game: state,
                }) /
                  NPC_CHORES[chore.name].requirement) *
                100
              }
              type="progress"
              outerDimensions={{ width: 16, height: 7.5 }}
            />
          </div>
        )}
      </ButtonPanel>
    </div>
  );
};

export const LockedChoreCard: React.FC<{
  npc: NPCName;
}> = ({ npc }) => {
  const { t } = useAppTranslation();

  return (
    <div className="py-1 px-1" key={npc}>
      <ButtonPanel
        className={classNames("w-full relative", {})}
        style={{ paddingBottom: "10px" }}
        disabled
      >
        <div className="flex justify-center">
          <div className="relative mb-2 mr-0.5 ">
            <NPCIcon parts={NPC_WEARABLES[npc]} />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <span className="text-xs line-clamp-2 text-center truncate">
            {`?`}
          </span>
        </div>

        <Label
          icon={lockIcon}
          type={"formula"}
          className="absolute -bottom-4 text-center p-1"
          style={{
            left: `${PIXEL_SCALE * -3}px`,
            right: `${PIXEL_SCALE * -3}px`,
            width: `calc(100% + 16px)`,
            height: "25px",
          }}
        >
          {t("chores.lockedChore", {
            level: NPC_CHORE_UNLOCKS[npc as NPCName],
          })}
        </Label>
      </ButtonPanel>
    </div>
  );
};

export const ChoreRewardLabel: React.FC<{
  chore: NpcChore;
  state: GameState;
}> = ({ chore, state }) => {
  const now = useNow();
  const ticket = getChapterTicket(now);

  if (chore.reward.items[ticket]) {
    return (
      <Label type={"warning"} icon={ITEM_DETAILS[ticket].image}>
        {generateChoreRewards({
          game: state,
          chore,
          now: new Date(),
        })[ticket] ?? 0}
      </Label>
    );
  }

  if (chore.reward.coins) {
    return (
      <Label type={"warning"} icon={SUNNYSIDE.ui.coins}>
        {chore.reward.coins}
      </Label>
    );
  }

  const item = Object.keys(chore.reward.items)[0] as InventoryItemName;

  if (!item) return null;

  return (
    <Label type={"warning"} icon={ITEM_DETAILS[item].image}>
      {chore.reward.items[item]}
    </Label>
  );
};
