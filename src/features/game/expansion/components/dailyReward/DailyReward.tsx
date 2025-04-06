import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameWallet } from "features/wallet/Wallet";
import { useInterpret, useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { Label } from "components/ui/Label";
import { Revealed } from "features/game/components/Revealed";
import { ChestRevealing } from "features/world/ui/chests/ChestRevealing";
import { Loading } from "features/auth/components/Loading";
import {
  DailyRewardState,
  DailyRewardContext,
  rewardChestMachine,
  DailyRewardEvent,
} from "./rewardChestMachine";
import { hasFeatureAccess } from "lib/flags";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { DailyRewards } from "features/game/types/game";
import {
  BaseActionObject,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  State,
  TypegenDisabled,
} from "xstate";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { NetworkOption } from "features/island/hud/components/DepositFlower";
import baseIcon from "assets/icons/chains/base.png";
import { CONFIG } from "lib/config";
import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
const _hasReferralAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "TASK_BOARD");
const _network = (state: MachineState) => state.context.state.settings.network;

export const DailyReward: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, showAnimations } = useContext(Context);
  const bumpkinLevel = useSelector(gameService, (state) =>
    getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0),
  );
  const dailyRewards = useSelector(
    gameService,
    (state) => state.context.state.dailyRewards,
  );
  const isRevealed = useSelector(gameService, (state) =>
    state.matches("revealed"),
  );
  const hasReferralAccess = useSelector(gameService, _hasReferralAccess);
  const chestService = useInterpret(rewardChestMachine, {
    context: {
      lastUsedCode: dailyRewards?.chest?.code ?? 0,
      openedAt: dailyRewards?.chest?.collectedAt ?? 0,
      bumpkinLevel,
      network: gameService.state.context.state.settings.network,
    },
  });
  const [chestState] = useActor(chestService);

  if (hasReferralAccess || bumpkinLevel <= 5) {
    return <></>;
  }

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
          onClick={() => setShowModal(true)}
        />
        {!chestState.matches("opened") && (
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
        <CloseButtonPanel>
          <DailyRewardContent
            onClose={() => setShowModal(false)}
            gameService={gameService}
            dailyRewards={dailyRewards}
            isRevealed={isRevealed}
            bumpkinLevel={bumpkinLevel}
            chestService={chestService}
            chestState={chestState}
          />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

const MAINNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base",
    icon: baseIcon,
    chainId: 8453,
  },

  {
    value: "Ronin",
    icon: SUNNYSIDE.icons.roninIcon,
    chainId: 2020,
  },
  {
    value: "Polygon",
    icon: SUNNYSIDE.icons.polygonIcon,
    chainId: 137,
  },
];

const TESTNET_NETWORKS: NetworkOption[] = [
  {
    value: "Base Sepolia",
    icon: baseIcon,
    chainId: 84532,
  },
  {
    value: "Ronin Saigon",
    icon: SUNNYSIDE.icons.roninIcon,
    chainId: 2021,
  },
  {
    value: "Polygon Amoy",
    icon: SUNNYSIDE.icons.polygonIcon,
    chainId: 80002,
  },
];

// Select appropriate network options based on config
const networkOptions =
  CONFIG.NETWORK === "mainnet" ? MAINNET_NETWORKS : TESTNET_NETWORKS;

export const DailyRewardContent: React.FC<{
  onClose: () => void;
  gameService: MachineInterpreter;
  dailyRewards?: DailyRewards;
  isRevealed: boolean;
  bumpkinLevel: number;
  chestService: Interpreter<
    DailyRewardContext,
    any,
    DailyRewardEvent,
    DailyRewardState,
    ResolveTypegenMeta<
      TypegenDisabled,
      DailyRewardEvent,
      BaseActionObject,
      ServiceMap
    >
  >;
  chestState: State<
    DailyRewardContext,
    DailyRewardEvent,
    any,
    DailyRewardState,
    ResolveTypegenMeta<
      TypegenDisabled,
      DailyRewardEvent,
      BaseActionObject,
      ServiceMap
    >
  >;
}> = ({
  onClose,
  gameService,
  dailyRewards,
  isRevealed,
  bumpkinLevel,
  chestService,
  chestState,
}) => {
  const { t } = useAppTranslation();

  const hasReferralAccess = useSelector(gameService, _hasReferralAccess);
  const network = useSelector(gameService, _network);

  const handleNetworkChange = (networkName: NetworkName) => {
    // Use proper type checking to ensure networkName is a valid key
    const networkOption = networkOptions.find(
      (option) => option.value === networkName,
    ) as NetworkOption;

    if (!networkOption) {
      return;
    }

    gameService.send("network.updated", { network: networkName });
    chestService.send("UPDATE_NETWORK", { network: networkName });
  };

  useEffect(() => {
    chestService.send("UPDATE_BUMPKIN_LEVEL", { bumpkinLevel });
  }, [bumpkinLevel]);

  if (bumpkinLevel <= 5) {
    return null;
  }

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

  const Content: React.FC = () => {
    if (chestState.matches("opened")) {
      const now = new Date();
      const nextRefreshInSeconds =
        24 * 60 * 60 -
        (now.getUTCHours() * 60 * 60 +
          now.getUTCMinutes() * 60 +
          now.getUTCSeconds());
      return (
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
          <span className="text-center mb-4">{t("reward.comeBackLater")}</span>
          <CountdownLabel timeLeft={nextRefreshInSeconds} />
        </div>
      );
    }

    if (chestState.matches("locked")) {
      return (
        <>
          <DropdownPanel<NetworkName>
            options={networkOptions}
            value={network}
            onChange={handleNetworkChange}
            placeholder={t("deposit.flower.selectNetwork")}
          />

          <div className="flex flex-col items-center px-2">
            {!hasReferralAccess && (
              <Label type="transparent" className="px-0.5 mb-2 text-base">
                {t("reward.daily.reward")}
              </Label>
            )}
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
          <Button
            onClick={() => chestService.send("UNLOCK")}
            disabled={!network}
          >
            {t("reward.unlock")}
          </Button>
        </>
      );
    }

    if (chestState.matches("unlocked")) {
      return (
        <>
          <div className="flex flex-col items-center p-2">
            {!hasReferralAccess && (
              <Label type="transparent" className="px-0.5 mb-2 text-base">
                {t("reward.daily.reward")}
              </Label>
            )}
            <img
              src={SUNNYSIDE.decorations.treasure_chest}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
              }}
            />
          </div>
          <Button onClick={reveal}>{t("reward.open")}</Button>
        </>
      );
    }

    if (chestState.matches("error")) {
      return (
        <>
          <div className="flex flex-col items-center p-2">
            <Label type="danger" className="px-0.5 mb-2 text-base">
              {t("error.wentWrong")}
            </Label>
            <img
              src={SUNNYSIDE.icons.sad}
              className="mb-2"
              style={{
                width: `${PIXEL_SCALE * 24}px`,
              }}
            />
          </div>
          <Button onClick={onClose}>{t("close")}</Button>
        </>
      );
    }

    if (chestState.matches("comingSoon")) {
      return (
        <div className="px-2 pb-2 w-full flex flex-col items-center">
          <img src={SUNNYSIDE.icons.player} className="w-1/5 mb-3" />
          <p className="text-sm">{t("reward.lvlRequirement")}</p>
        </div>
      );
    }

    if (chestState.matches("opening") && isRevealed) {
      return (
        <Revealed
          onAcknowledged={() => chestService.send("ACKNOWLEDGE")}
          streaks={true}
        />
      );
    }

    if (chestState.matches("opening")) {
      return <ChestRevealing type="Daily Reward" />;
    }

    if (chestState.matches("unlocking")) {
      return <Loading text={t("unlocking")} />;
    }

    if (chestState.matches("loading")) {
      return <Loading />;
    }

    return <></>;
  };

  return (
    <GameWallet
      action="dailyReward"
      onReady={() => {
        chestService.send("LOAD");
      }}
    >
      <Content />
    </GameWallet>
  );
};
