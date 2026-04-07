import React, { useContext, useMemo } from "react";
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
import { useNow } from "lib/utils/hooks/useNow";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSaltModalState, SaltModalState } from "./getSaltModalState";
import { MAX_STORED_SALT_CHARGES_PER_NODE } from "features/game/types/salt";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];
const _state = (state: MachineState) => state.context.state;

export const SaltNodeModalContent: React.FC<{
  id: string;
  onClose: () => void;
}> = ({ id, onClose: _onClose }) => {
  const { gameService } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const game = useSelector(gameService, _state);
  const node = useSelector(gameService, _node(id));
  const now = useNow({ live: true });

  const modalState = useMemo(() => {
    if (!node) return undefined;

    return getSaltModalState({
      saltNode: node,
      gameState: game,
      now,
      saltRakes: inventory["Salt Rake"],
    });
  }, [node, game, now, inventory]);

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
      gameService={gameService}
      id={id}
    />
  );
};

const SaltNodeContent: React.FC<{
  modalState: SaltModalState;
  gameService: MachineInterpreter;
  id: string;
}> = ({ modalState, gameService, id }) => {
  const { t } = useAppTranslation();
  const {
    canStart,
    blockedReason,
    regenerationState,
    nextChargeInSeconds,
    storedCharges,
    availableSaltRakes,
  } = modalState;

  const sendHarvest = () => {
    if (!canStart) return;
    gameService.send("saltHarvest.harvested", { id });
  };

  return (
    <>
      <InnerPanel className="p-2">
        <div className="mt-2 flex items-start">
          <Box image={ITEM_DETAILS.Salt.image} className="-ml-1 -mb-1 -mt-1" />
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row flex-wrap gap-1 justify-between w-full">
              <Label type="default">
                {t("saltHarvest.storedCharges", {
                  count: storedCharges,
                  max: MAX_STORED_SALT_CHARGES_PER_NODE,
                })}
              </Label>
              <div className="hidden sm:block">
                {regenerationState === "charging" &&
                  nextChargeInSeconds !== undefined && (
                    <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                      {t("saltHarvest.nextChargeIn", {
                        time: secondsToString(nextChargeInSeconds, {
                          length: "medium",
                        }),
                      })}
                    </Label>
                  )}
              </div>
            </div>
            <Label type="default" icon={ITEM_DETAILS["Salt Rake"].image}>
              {t("saltHarvest.availableSaltRakes", {
                count: availableSaltRakes,
              })}
            </Label>
            <div className="block sm:hidden">
              {regenerationState === "charging" &&
                nextChargeInSeconds !== undefined && (
                  <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                    {t("saltHarvest.nextChargeIn", {
                      time: secondsToString(nextChargeInSeconds, {
                        length: "medium",
                      }),
                    })}
                  </Label>
                )}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Button disabled={!canStart} onClick={sendHarvest}>
            {t("saltHarvest.startHarvest")}
          </Button>

          {!canStart && blockedReason && (
            <Label type="danger" className="mt-1">
              {t(blockedReason)}
            </Label>
          )}
        </div>
      </InnerPanel>
    </>
  );
};
