import React, { useContext, useEffect, useState } from "react";
import { useInterpret, useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { ChestRevealing } from "features/world/ui/chests/ChestRevealing";
import { Revealed } from "features/game/components/Revealed";
import { rewardChestMachine } from "./rewardChestMachine";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { getBumpkinLevel } from "features/game/lib/level";
import { Loading } from "features/auth/components";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { Label } from "components/ui/Label";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameWallet } from "features/wallet/Wallet";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _dailyRewards = (state: MachineState) => state.context.state.dailyRewards;
const _isRevealed = (state: MachineState) => state.matches("revealed");

export const DailyReward: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const [showIntro, setShowIntro] = useState(true);
  const dailyRewards = useSelector(gameService, _dailyRewards);
  const bumpkin = useSelector(gameService, _bumpkin);
  const isRevealed = useSelector(gameService, _isRevealed);
  const { t } = useAppTranslation();

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

  const [showModal, setShowModal] = useState(false);

  const chestService = useInterpret(rewardChestMachine, {
    context: {
      lastUsedCode: dailyRewards?.chest?.code ?? 0,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
    },
  });

  const chestCode = useSelector(chestService, (state) => state.context.code);
  const chestOpened = useSelector(chestService, (state) =>
    state.matches("opened"),
  );
  const chestLocked = useSelector(chestService, (state) =>
    state.matches("locked"),
  );
  const chestUnlocked = useSelector(chestService, (state) =>
    state.matches("unlocked"),
  );
  const chestError = useSelector(chestService, (state) =>
    state.matches("error"),
  );
  const chestComingSoon = useSelector(chestService, (state) =>
    state.matches("comingSoon"),
  );
  const chestOpening = useSelector(chestService, (state) =>
    state.matches("opening"),
  );
  const chestUnlocking = useSelector(chestService, (state) =>
    state.matches("unlocking"),
  );
  const chestLoading = useSelector(chestService, (state) =>
    state.matches("loading"),
  );
  const chestIdle = useSelector(chestService, (state) => state.matches("idle"));

  useEffect(() => {
    chestService.send("UPDATE_BUMPKIN_LEVEL", { bumpkinLevel });
  }, [bumpkinLevel]);

  if (getBumpkinLevel(bumpkin?.experience ?? 0) <= 5) {
    return null;
  }
  const openModal = () => {
    setShowModal(true);
  };

  const reveal = () => {
    gameService.send("REVEAL", {
      event: {
        type: "dailyReward.collected",
        createdAt: new Date(),
        code: chestCode,
      },
    });
    chestService.send("OPEN");
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
    if (chestOpened) {
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
              {streaks} {t("reward.streak")}
            </Label>
            <img
              src={SUNNYSIDE.decorations.treasure_chest_opened}
              className="mb-2 mt-2"
              style={{
                width: `${PIXEL_SCALE * 16}px`,
              }}
            />
            <span className="text-center mb-4">
              {t("reward.comeBackLater")}
            </span>
            <CountdownLabel timeLeft={nextRefreshInSeconds} />
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestLocked) {
      return (
        <CloseButtonPanel
          title={t("reward.daily.reward")}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col items-center px-2">
            {streaks > 1 && !missedADay && (
              <>
                <Label type="info" className="px-0.5 text-xs">
                  {streaks} {t("reward.streak")}
                </Label>
                <p className="text-xxs mt-2">
                  {t("reward.nextBonus")} {getNextBonus}
                  {t("reward.streak")}
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
            {t("reward.unlock")}
          </Button>
        </CloseButtonPanel>
      );
    }

    if (chestUnlocked) {
      return (
        <CloseButtonPanel
          title={t("reward.daily.reward")}
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
          <Button onClick={reveal}>{t("reward.open")}</Button>
        </CloseButtonPanel>
      );
    }

    if (chestError) {
      return (
        <CloseButtonPanel
          title={t("error.wentWrong")}
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
          <Button onClick={() => setShowModal(false)}>{t("close")}</Button>
        </CloseButtonPanel>
      );
    }

    if (chestComingSoon) {
      return (
        <CloseButtonPanel title="Oh oh!" onClose={() => setShowModal(false)}>
          <div className="px-2 pb-2 w-full flex flex-col items-center">
            <img src={SUNNYSIDE.icons.player} className="w-1/5 mb-3" />
            <p className="text-sm">{t("reward.lvlRequirement")}</p>
          </div>
        </CloseButtonPanel>
      );
    }

    if (chestOpening && isRevealed) {
      return (
        <Panel>
          <Revealed
            onAcknowledged={() => chestService.send("ACKNOWLEDGE")}
            streaks={true}
          />
        </Panel>
      );
    }

    if (chestOpening) {
      return (
        <Panel>
          <ChestRevealing type="Daily Reward" />
        </Panel>
      );
    }

    if (chestUnlocking) {
      return (
        <Panel>
          <Loading text={t("unlocking")} />
        </Panel>
      );
    }

    if (chestLoading) {
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
            chestOpened
              ? SUNNYSIDE.decorations.treasure_chest_opened
              : SUNNYSIDE.decorations.treasure_chest
          }
          className="cursor-pointer hover:img-highlight w-full absolute bottom-0"
          onClick={openModal}
        />
        {!chestOpened && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className={"absolute" + (showAnimations ? " animate-float" : "")}
            style={{
              width: `${PIXEL_SCALE * 4}px`,
              top: `${PIXEL_SCALE * -14}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {showIntro && (
          <CloseButtonPanel onClose={() => setShowModal(false)}>
            <div className="p-2">
              <img
                src={SUNNYSIDE.decorations.treasure_chest}
                className="mb-2 mt-2 mx-auto"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                }}
              />
              <p className="text-sm text-center">
                {t("reward.connectWeb3Wallet")}
              </p>
            </div>
            <Button onClick={() => setShowIntro(false)}>{t("continue")}</Button>
          </CloseButtonPanel>
        )}

        {!showIntro && chestIdle && (
          <Panel>
            <GameWallet
              action="dailyReward"
              onReady={() => {
                chestService.send("LOAD");
              }}
            >
              <ModalContent />
            </GameWallet>
          </Panel>
        )}

        {!showIntro && !chestIdle && (
          <GameWallet
            action="dailyReward"
            onReady={() => {
              chestService.send("LOAD");
            }}
          >
            <ModalContent />
          </GameWallet>
        )}
      </Modal>
    </>
  );
};
