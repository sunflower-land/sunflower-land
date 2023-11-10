import React, { useContext, useEffect, useState } from "react";
import { useActor, useInterpret, useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { rewardChestMachine } from "./rewardChestMachine";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Loading } from "features/auth/components";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { Equipped } from "features/game/types/bumpkin";
import { Label } from "components/ui/Label";
import { MachineState } from "features/game/lib/gameMachine";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _dailyRewards = (state: MachineState) => state.context.state.dailyRewards;
const _isRevealed = (state: MachineState) => state.matches("revealed");

export const DailyReward: React.FC = () => {
  const { gameService } = useContext(Context);
  const dailyRewards = useSelector(gameService, _dailyRewards);
  const bumpkin = useSelector(gameService, _bumpkin);
  const isRevealed = useSelector(gameService, _isRevealed);

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

  const [showModal, setShowModal] = useState(false);

  const chestService = useInterpret(rewardChestMachine, {
    context: {
      lastUsedCode: dailyRewards?.chest?.code ?? 0,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
    },
  });

  useEffect(() => {
    chestService.send("UPDATE_BUMPKIN_LEVEL", { bumpkinLevel });
  }, [bumpkinLevel]);

  const [chestState] = useActor(chestService);

  if (getBumpkinLevel(gameState.context.state.bumpkin?.experience ?? 0) <= 5) {
    return null;
  }
  const openModal = () => {
    setShowModal(true);
    chestService.send("LOAD");
  };

  const onUpgrade = () => {
    gameService.send("UPGRADE");
    setShowModal(true);
  };

  const reveal = () => {
    gameService.send("REVEAL", {
      event: {
        type: "dailyReward.collected",
        createdAt: new Date(),
        code: chestState.context.code,
      },
    });
    chestService.send("OPEN");
  };

  const pirateBumpkin: Equipped = {
    body: "Goblin Potion",
    hair: "White Long Hair",
    hat: "Pirate Hat",
    shirt: "Fancy Top",
    pants: "Pirate Pants",
    tool: "Pirate Scimitar",
    background: "Seashore Background",
    shoes: "Black Farmer Boots",
  };

  const streaks = dailyRewards?.streaks ?? 0;
  const collectedAt = dailyRewards?.chest?.collectedAt ?? 0;

  const collectedDate = new Date(collectedAt).toISOString().substring(0, 10);
  const currentDate = new Date().toISOString().substring(0, 10);

  const missedADay =
    (new Date(currentDate).getTime() - new Date(collectedDate).getTime()) /
      (1000 * 60 * 60 * 24) >
    1;

  const streakRemainder = streaks % 5;
  const getNextBonus = streaks + (5 - streakRemainder);

  const ModalContent = () => {
    if (chestState.matches("opened")) {
      const now = new Date();
      const nextRefreshInSeconds =
        24 * 60 * 60 -
        (now.getUTCHours() * 60 * 60 +
          now.getUTCMinutes() * 60 +
          now.getUTCSeconds());

      return (
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="flex flex-col items-center p-2 w-full">
            <Label type="info" className="px-0.5 text-xs">
              {streaks} day streak
            </Label>
            <img
              src={SUNNYSIDE.decorations.treasure_chest_opened}
              className="mb-2 mt-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="text-center mb-4">
              Come back later for more rewards
            </span>
            <CountdownLabel timeLeft={nextRefreshInSeconds} />
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("locked")) {
      return (
        <CloseButtonPanel
          title="Daily Reward"
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col items-center px-2">
            {streaks > 1 && !missedADay && (
              <>
                <Label type="info" className="px-0.5 text-xs">
                  {streaks} day streak
                </Label>
                <p className="text-xxs mt-2">
                  Next bonus: {getNextBonus} Day Streak
                </p>
              </>
            )}
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2 mt-2"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
              }}
            />
          </div>
          <Button onClick={() => chestService.send("UNLOCK")}>
            Unlock Reward
          </Button>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("unlocked")) {
      return (
        <CloseButtonPanel
          title="Daily Reward"
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
              }}
            />
          </div>
          <Button onClick={reveal}>Open reward</Button>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("error")) {
      return (
        <CloseButtonPanel
          title="Something went wrong!"
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col items-center p-2">
            <img
              src={SUNNYSIDE.icons.sad}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
              }}
            />
          </div>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("comingSoon")) {
      return (
        <CloseButtonPanel title="Oh oh!" onClose={() => setShowModal(false)}>
          <div className="px-2 pb-2 w-full flex flex-col items-center">
            <img src={SUNNYSIDE.icons.player} className="w-1/5 mb-3" />
            <p className="text-sm">
              You must be level 3 to claim daily rewards.
            </p>
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestState.matches("opening") && isRevealed) {
      return (
        <Panel>
          <Revealed
            onAcknowledged={() => chestService.send("ACKNOWLEDGE")}
            streaks={true}
          />
        </Panel>
      );
    }

    if (chestState.matches("opening")) {
      return (
        <Panel>
          <Revealing icon={SUNNYSIDE.icons.treasure} />
        </Panel>
      );
    }

    if (chestState.matches("unlocking")) {
      return (
        <Panel>
          <Loading text="Unlocking" />
        </Panel>
      );
    }

    if (chestState.matches("loading")) {
      return (
        <Panel>
          <Loading />
        </Panel>
      );
    }

    return null;
  };

  return (
    <>
      <div
        className="absolute z-20"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
          left: `${GRID_WIDTH_PX * 1.5}px`,
          top: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        <img
          id="daily-reward"
          src={
            chestState.matches("opened")
              ? SUNNYSIDE.decorations.treasure_chest_opened
              : SUNNYSIDE.decorations.treasure_chest
          }
          className="cursor-pointer hover:img-highlight w-full absolute bottom-0"
          onClick={() => openModal()}
        />
        {!chestState.matches("opened") && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute animate-float"
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ModalContent />
      </Modal>
    </>
  );
};
