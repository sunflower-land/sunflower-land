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
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _inventory = (state: MachineState) => state.context.state.inventory;
const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];
const _state = (state: MachineState) => state.context.state;

type Props = {
  id: string;
  onClose: () => void;
};

export const SaltNodeModalContent: React.FC<Props> = ({ id, onClose }) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const node = useSelector(gameService, _node(id));
  const game = useSelector(gameService, _state);

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
    canHarvest,
    blockedReason,
    regenerationState,
    nextChargeInSeconds,
    storedCharges,
    availableSaltRakes,
    maxCharges,
  } = modalState;

  const sendHarvest = () => {
    if (!canHarvest) return;
    gameService.send("salt.harvested", { id });
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
                  max: maxCharges,
                })}
              </Label>
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
            <Label type="default" icon={ITEM_DETAILS["Salt Rake"].image}>
              {t("saltHarvest.availableSaltRakes", {
                count: availableSaltRakes,
              })}
            </Label>
          </div>
        </div>
        <div className="mt-2">
          <Button disabled={!canHarvest} onClick={sendHarvest}>
            {t("saltHarvest.startHarvest")}
          </Button>

          {!canHarvest && blockedReason && (
            <Label type="danger" className="mt-1">
              {t(blockedReason)}
            </Label>
          )}
        </div>
      </InnerPanel>
    </>
  );
};
