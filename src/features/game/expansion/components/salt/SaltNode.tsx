import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";
import {
  getNextSaltChargeInSeconds,
  getSaltChargeGenerationTime,
  getStoredSaltCharges,
  materializeSaltRegen,
} from "features/game/types/salt";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { canInstantHarvestSaltNode, getSaltNodeSprite } from "./saltNodeStage";

interface Props {
  id: string;
  visiting: boolean;
}

const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];

const _gameState = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const SaltNode: React.FC<Props> = ({ id, visiting }) => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const node = useSelector(gameService, _node(id));
  const gameState = useSelector(gameService, _gameState);
  const inventory = useSelector(gameService, _inventory);
  const [showNextChargePanel, setShowNextChargePanel] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const now = useNow({ live: true });

  const chargeIntervalMs = getSaltChargeGenerationTime({ gameState });
  const availableRakes = Math.floor(inventory["Salt Rake"]?.toNumber() ?? 0);

  const storedCharges = node
    ? getStoredSaltCharges(node, now, { chargeIntervalMs })
    : 0;

  const materialized = node
    ? materializeSaltRegen(node.salt, now, { chargeIntervalMs })
    : null;
  const nextChargeInSeconds = materialized
    ? getNextSaltChargeInSeconds({
        nextChargeAt: materialized.nextChargeAt,
        now,
      })
    : 0;

  useEffect(() => {
    if (storedCharges > 0) {
      setTimeout(() => {
        setShowNextChargePanel(false);
      }, 0);
    }
  }, [storedCharges]);

  useEffect(() => {
    if (!showNextChargePanel) return;

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setShowNextChargePanel(false);
    };

    document.addEventListener("mousedown", onPointerDown, true);
    return () => document.removeEventListener("mousedown", onPointerDown, true);
  }, [showNextChargePanel]);

  if (!node) return null;

  const saltNodeSprite = getSaltNodeSprite(storedCharges);

  const canHarvest = canInstantHarvestSaltNode({
    visiting,
    storedCharges,
    availableRakes,
  });

  return (
    <div ref={rootRef} className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onClick={() => {
          if (canHarvest) {
            setShowNextChargePanel(false);
            gameService.send("saltHarvest.harvested", { id });
            return;
          }

          if (storedCharges === 0) {
            setShowNextChargePanel((open) => !open);
          }
        }}
      >
        {storedCharges === 0 && (
          <div
            className="flex justify-center absolute w-full pointer-events-none z-30"
            style={{
              top: `${PIXEL_SCALE * -10}px`,
            }}
          >
            <TimeLeftPanel
              text={t("saltHarvest.nextChargeIn")}
              timeLeft={nextChargeInSeconds}
              showTimeLeft={showNextChargePanel}
            />
          </div>
        )}
        {storedCharges > 0 && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className={showAnimations ? "ready" : ""}
              style={{ width: `${PIXEL_SCALE * 4}px` }}
            />
          </div>
        )}
        <img src={saltNodeSprite} width={PIXEL_SCALE * 18} />
      </div>
    </div>
  );
};
