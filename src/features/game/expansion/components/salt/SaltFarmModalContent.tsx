import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel, InnerPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSaltModalState, SaltModalState } from "./getSaltModalState";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];
const _state = (state: MachineState) => state.context.state;

interface Props {
  id: string;
  onClose: () => void;
}

export const SaltFarmModalContent: React.FC<Props> = ({ id, onClose }) => {
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
      now,
      saltRakes: inventory["Salt Rake"],
      isVip,
    });
  }, [node, now, inventory, isVip]);

  if (!node || !modalState) {
    return (
      <CloseButtonPanel
        onClose={onClose}
        tabs={[
          {
            id: "saltFarm",
            name: "Salt Farm",
            icon: ITEM_DETAILS.Salt.image,
          },
        ]}
        container={OuterPanel}
      >
        <InnerPanel className="p-2">
          <Label type="danger">{"Salt node not found"}</Label>
        </InnerPanel>
      </CloseButtonPanel>
    );
  }

  return (
    <SaltFarmContent
      modalState={modalState}
      isVip={isVip}
      gameService={gameService}
      id={id}
      onClose={onClose}
      now={now}
    />
  );
};

const SaltFarmContent: React.FC<{
  modalState: SaltModalState;
  isVip: boolean;
  gameService: MachineInterpreter;
  id: string;
  onClose: () => void;
  now: number;
}> = ({ modalState, isVip, gameService, id, onClose, now }) => {
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
    storedCharges,
    maxStoredCharges,
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
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        {
          id: "saltFarm",
          name: "Salt Farm",
          icon: ITEM_DETAILS.Salt.image,
        },
      ]}
      container={OuterPanel}
    >
      <InnerPanel className="p-2">
        <Label type="vibrant" icon={ITEM_DETAILS.Salt.image}>
          {`Salt Node #${id}`}
        </Label>

        <div className="mt-2 flex items-start">
          <Box image={ITEM_DETAILS.Salt.image} className="-ml-1 -mb-1 -mt-1" />
          <div>
            <Label type="default">{`Charges: ${storedCharges}/${maxStoredCharges}`}</Label>
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
                  {`Regeneration paused (${secondsToString(
                    pauseRemainingSeconds,
                    {
                      length: "medium",
                    },
                  )})`}
                </Label>
              )}
            {regenerationState === "maxed" && (
              <Label type="success">{"Charges maxed (no timer)"}</Label>
            )}
          </div>
        </div>
      </InnerPanel>

      <div className="pt-1" />

      <InnerPanel className="p-2">
        <div className="flex justify-between items-center mb-1">
          <Label type="default">{"Active Harvest Queue"}</Label>
          {readyCount > 0 && (
            <Label type="success">{`${readyCount} Ready`}</Label>
          )}
        </div>

        {activeSlots.length === 0 && (
          <p className="text-xs">{"No active harvest slots."}</p>
        )}

        {activeSlots.length > 0 && (
          <div className="space-y-1 mb-1">
            {activeSlots.map((slot, index) => {
              const secondsRemaining = Math.max(
                0,
                Math.ceil((slot.readyAt - now) / 1000),
              );
              const isReady = secondsRemaining === 0;

              return (
                <div
                  key={`${slot.startedAt}-${slot.readyAt}`}
                  className="flex justify-between text-xs"
                >
                  <span>{`Slot ${index + 1}`}</span>
                  <span>
                    {isReady
                      ? "Ready"
                      : secondsToString(secondsRemaining, { length: "medium" })}
                  </span>
                </div>
              );
            })}
          </div>
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
    </CloseButtonPanel>
  );
};
