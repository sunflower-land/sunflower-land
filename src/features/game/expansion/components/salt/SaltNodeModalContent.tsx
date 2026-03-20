import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getSaltModalState, SaltModalState } from "./getSaltModalState";
import { SaltHarvestInProgress } from "./SaltHarvestInProgress";
import { SaltHarvestQueue } from "./SaltHarvestQueue";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];
const _state = (state: MachineState) => state.context.state;

export const SaltNodeModalContent: React.FC<{
  id: string;
  onClose: () => void;
}> = ({ id, onClose }) => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const game = useSelector(gameService, _state);
  const node = useSelector(gameService, _node(id));
  const now = useNow({ live: true });
  const isVip = hasVipAccess({ game, now });

  const modalState = useMemo(() => {
    if (!node) return undefined;

    return getSaltModalState({
      saltNode: node,
      gameState: game,
      now,
      saltRakes: inventory["Salt Rake"],
      isVip,
    });
  }, [node, game, now, inventory, isVip]);

  if (!node || !modalState) {
    return (
      <InnerPanel className="p-2">
        <Label type="danger">{"Salt node not found"}</Label>
      </InnerPanel>
    );
  }

  return (
    <SaltNodeContent
      modalState={modalState}
      isVip={isVip}
      gameService={gameService}
      id={id}
      now={now}
      onClose={onClose}
    />
  );
};

const SaltNodeContent: React.FC<{
  modalState: SaltModalState;
  isVip: boolean;
  gameService: MachineInterpreter;
  id: string;
  now: number;
  onClose: () => void;
}> = ({ modalState, isVip, gameService, id, now, onClose }) => {
  const { t } = useAppTranslation();
  const {
    canStart,
    canClaim,
    blockedReason,
    primaryAction,
    regenerationState,
    nextChargeInSeconds,
    pauseRemainingSeconds,
    activeSlots,
    readySlots,
    availableSaltRakes,
    maxRakes,
    displayCharges,
    maxStoredCharges,
    inProgressDisplaySlot,
    queueGridSlots,
    queueGridCapacity,
  } = modalState;

  const [selectedRakes, setSelectedRakes] = useState(1);

  const clampedSelectedRakes = isVip
    ? maxRakes > 0
      ? Math.min(maxRakes, Math.max(1, selectedRakes))
      : 1
    : 1;

  const sendStart = () => {
    if (!canStart) return;
    gameService.send("saltHarvest.started", {
      id,
      rakes: clampedSelectedRakes,
    });
  };

  const sendClaim = () => {
    if (!canClaim) return;
    gameService.send("saltHarvest.claimed", { id });
  };

  const readyCount = readySlots.length;
  const startAmount = clampedSelectedRakes;

  return (
    <>
      <InnerPanel className="p-2">
        <Label type="vibrant" icon={ITEM_DETAILS.Salt.image}>
          {`Salt Node #${id}`}
        </Label>

        <div className="mt-2 flex items-start">
          <Box image={ITEM_DETAILS.Salt.image} className="-ml-1 -mb-1 -mt-1" />
          <div className="flex flex-col gap-1">
            <Label type="default">{`Charges: ${displayCharges}/${maxStoredCharges}`}</Label>
            {regenerationState === "charging" &&
              nextChargeInSeconds !== undefined && (
                <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                  {`Next charge in ${secondsToString(nextChargeInSeconds, {
                    length: "medium",
                  })}`}
                </Label>
              )}
            {regenerationState === "paused" &&
              pauseRemainingSeconds !== undefined && (
                <Label type="warning" icon={SUNNYSIDE.icons.stopwatch}>
                  {`Regeneration restarts in ${secondsToString(
                    pauseRemainingSeconds,
                    { length: "medium" },
                  )}`}
                </Label>
              )}
            {regenerationState === "maxed" && (
              <Label type="success">{"Charges maxed"}</Label>
            )}
          </div>
        </div>
      </InnerPanel>

      <div className="pt-1" />

      <InnerPanel className="p-2">
        {activeSlots.length === 0 && (
          <p className="text-xs">{t("salt.noActiveHarvestSlots")}</p>
        )}

        {inProgressDisplaySlot && (
          <SaltHarvestInProgress slot={inProgressDisplaySlot} />
        )}

        {isVip && queueGridCapacity > 0 && activeSlots.length > 0 && (
          <SaltHarvestQueue
            queueGridSlots={queueGridSlots}
            queueGridCapacity={queueGridCapacity}
            now={now}
            onCloseModal={onClose}
          />
        )}
      </InnerPanel>

      <div className="pt-1" />

      <InnerPanel className="p-2">
        <div className="flex justify-between items-center mb-1">
          <Label type="default" icon={ITEM_DETAILS["Salt Rake"].image}>
            {"Salt Rakes"}
          </Label>
          <Label type="default">{availableSaltRakes.toString()}</Label>
        </div>

        {isVip ? (
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs">{"Rakes to place"}</span>
            <div className="flex items-center gap-1">
              <Button
                className="w-7 h-7"
                disabled={clampedSelectedRakes <= 1}
                onClick={() =>
                  setSelectedRakes((value) => Math.max(1, value - 1))
                }
              >
                {"-"}
              </Button>
              <Label type="default">{clampedSelectedRakes.toString()}</Label>
              <Button
                className="w-7 h-7"
                disabled={maxRakes <= 0 || clampedSelectedRakes >= maxRakes}
                onClick={() =>
                  setSelectedRakes((value) => Math.min(maxRakes, value + 1))
                }
              >
                {"+"}
              </Button>
            </div>
          </div>
        ) : (
          <Label type="default" className="mb-2">
            {"Non-VIP: 1 rake per start"}
          </Label>
        )}

        {primaryAction === "claim" && (
          <Button onClick={sendClaim}>{`Claim Salt (${readyCount})`}</Button>
        )}

        {primaryAction !== "claim" && (
          <Button
            disabled={!canStart}
            onClick={sendStart}
          >{`Start Harvest (${startAmount})`}</Button>
        )}

        {!canStart && blockedReason && (
          <Label type="danger" className="mt-1">
            {blockedReason}
          </Label>
        )}
      </InnerPanel>
    </>
  );
};
