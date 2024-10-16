import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import {
  BEACH_BUMPKINS,
  KINGDOM_BUMPKINS,
  RETREAT_BUMPKINS,
} from "features/island/delivery/components/Orders";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { getImageUrl } from "lib/utils/getImageURLS";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

import { getSeasonalTicket } from "features/game/types/seasons";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CHORE_DETAILS,
  ChoreNPCName,
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
import giftIcon from "assets/icons/gift.png";

import { GameState } from "features/game/types/game";
export const ChoreBoard: React.FC = () => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [selectedId, setSelectedId] = useState<NPCName>();

  const chores = useSelector(
    gameService,
    (state) => state.context.state.choreBoard.chores,
  );
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );

  const end = useCountdown(weekResetsAt());

  const previewNpc = selectedId ?? getKeys(chores)[0];
  const previewChore = chores[previewNpc];

  const getLocationName = (npcName: NPCName) => {
    if (RETREAT_BUMPKINS.includes(npcName)) return t("island.goblin.retreat");
    if (BEACH_BUMPKINS.includes(npcName)) return t("island.beach");
    if (KINGDOM_BUMPKINS.includes(npcName)) return t("island.kingdom");
    return t("island.pumpkin.plaza");
  };

  const {
    tasksStartAt,
    tasksCloseAt,
    ticketTasksAreFrozen,
    ticketTasksAreClosing,
  } = getSeasonChangeover({ id: gameService.state.context.farmId });

  const level = getBumpkinLevel(
    gameService.state.context.state.bumpkin.experience ?? 0,
  );

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
          <div className="flex items-center justify-between mb-2">
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
          {t("chores.completeChoresToEarn", {
            seasonalTicket: getSeasonalTicket(),
          })}
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 w-full ">
          {getKeys(chores)
            .filter((npc) => level >= NPC_CHORE_UNLOCKS[npc as ChoreNPCName])
            .map((chore) => (
              <ChoreCard
                key={chore}
                chore={chores[chore] as NpcChore}
                npc={chore}
                selected={selectedId}
                onClick={setSelectedId}
                game={gameService.state.context.state}
              />
            ))}
          {nextUnlock && (
            <LockedChoreCard
              chore={chores[nextUnlock] as NpcChore}
              npc={nextUnlock}
            />
          )}
        </div>
      </InnerPanel>
      {previewChore && (
        <InnerPanel
          className={classNames(
            "md:ml-1 md:flex md:flex-col items-center flex-1 relative h-auto w-full",
            {
              hidden: !selectedId,
            },
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
                backgroundImage: `url(${getImageUrl(ITEM_IDS[NPC_WEARABLES[previewNpc].background])})`,
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
            <div className="text-xs flex justify-between flex-wrap items-center mb-2">
              <Label type="default">
                {CHORE_DETAILS[previewChore.name].description}
              </Label>
              <p>{`${Math.min(
                getChoreProgress({
                  chore: previewChore,
                  game: gameService.state.context.state,
                }),
                NPC_CHORES[previewChore.name].requirement,
              )}/${NPC_CHORES[previewChore.name].requirement}`}</p>
            </div>

            {!previewChore.completedAt && (
              <Button
                className="h-12 relative !mt-4"
                disabled={
                  ticketTasksAreFrozen ||
                  ticketTasksAreClosing ||
                  !!previewChore.completedAt ||
                  getChoreProgress({
                    chore: previewChore,
                    game: gameService.state.context.state,
                  }) < NPC_CHORES[previewChore.name].requirement
                }
                onClick={() => handleCompleteChore(previewNpc)}
              >
                {t("chores.complete")}
                <Label
                  type={"warning"}
                  icon={ITEM_DETAILS[getSeasonalTicket()].image}
                  className="flex absolute right-0 -top-5"
                >
                  {previewChore.reward.items[getSeasonalTicket()] ?? 0}
                </Label>
              </Button>
            )}

            {previewChore.completedAt && (
              <div className="flex">
                <img src={SUNNYSIDE.icons.confirm} className="mr-2 h-4" />
                <p className="text-xxs">{t("chores.completed")}</p>
              </div>
            )}
          </div>
          {ticketTasksAreFrozen && (
            <Label
              type="danger"
              className="mb-1"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {t("deliveries.closed")}
            </Label>
          )}
        </InnerPanel>
      )}
    </div>
  );
};

export const ChoreCard: React.FC<{
  chore: NpcChore;
  npc: NPCName;
  selected?: NPCName;
  onClick: (npc: NPCName) => void;
  game: GameState;
}> = ({ npc, chore, selected, onClick, game }) => {
  const tickets = chore.reward.items[getSeasonalTicket()];

  return (
    <div className="py-1 px-1" key={npc}>
      <ButtonPanel
        onClick={() => onClick(npc)}
        className={classNames("w-full relative", {
          "sm:!bg-brown-200": npc === selected,
        })}
        style={{ paddingBottom: "10px" }}
      >
        <Label type={"warning"} className="flex absolute -right-2 -top-4">
          {chore.reward.items[getSeasonalTicket()] ?? 0}
        </Label>
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="relative mb-2 mr-0.5 ">
              <NPCIcon parts={NPC_WEARABLES[npc]} />
            </div>
            <div className="flex flex-col items-center flex-1">
              <img className="h-8" src={CHORE_DETAILS[chore.name].icon} />
            </div>
          </div>
        </div>

        {chore.completedAt && (
          <Label
            type="success"
            className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10 h-6"
            style={{ width: "calc(100% + 15px)" }}
          >
            <img src={SUNNYSIDE.icons.confirm} className="h-4" />
          </Label>
        )}

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
                  game,
                }) /
                  NPC_CHORES[chore.name].requirement) *
                100
              }
              type="progress"
              outerDimensions={{ width: 16, height: 7.5 }}
            />
            {getChoreProgress({
              chore,
              game,
            }) >= NPC_CHORES[chore.name].requirement && (
              <img src={giftIcon} className="h-6 absolute -top-1 right-1.5" />
            )}
          </div>
        )}
      </ButtonPanel>
    </div>
  );
};

export const LockedChoreCard: React.FC<{
  chore: NpcChore;
  npc: NPCName;
}> = ({ npc, chore }) => {
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
            width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
            height: "25px",
          }}
        >
          {t("chores.lockedChore", {
            level: NPC_CHORE_UNLOCKS[npc as ChoreNPCName],
          })}
        </Label>
      </ButtonPanel>
    </div>
  );
};
