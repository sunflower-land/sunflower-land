import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { InnerPanel } from "components/ui/Panel";
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
  position: "top" | "bottom" | "left" | "right" | undefined;
}

const _node = (id: string) => (state: MachineState) =>
  state.context.state.saltFarm.nodes[id];

const _gameState = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const SaltNode: React.FC<Props> = ({ id, visiting, position }) => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const node = useSelector(gameService, _node(id));
  const gameState = useSelector(gameService, _gameState);
  const inventory = useSelector(gameService, _inventory);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
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

  const showNextChargePanel = showInfoPanel && storedCharges === 0;
  const showNoRakesPanel =
    showInfoPanel && !visiting && storedCharges > 0 && availableRakes === 0;

  if (!node) return null;

  const saltNodeSprite = getSaltNodeSprite(storedCharges);

  const canHarvest = canInstantHarvestSaltNode({
    visiting,
    storedCharges,
    availableRakes,
  });

  const getStyle = (): React.CSSProperties | undefined => {
    switch (position) {
      case "top":
        return {
          top: `${PIXEL_SCALE * -25}px`,
        };
      case "bottom":
        return {
          bottom: `${PIXEL_SCALE * -1}px`,
        };
      case "left":
        return {
          left: `${PIXEL_SCALE * -32}px`,
        };
      case "right":
        return {
          right: `${PIXEL_SCALE * -32}px`,
        };
      default:
        return undefined;
    }
  };
  const style = getStyle();

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full cursor-pointer hover:img-highlight"
        onMouseEnter={() => setShowInfoPanel(true)}
        onMouseLeave={() => setShowInfoPanel(false)}
        onClick={() => {
          if (canHarvest) {
            gameService.send("salt.harvested", { id });
          }
        }}
      >
        {(storedCharges === 0 ||
          (!visiting && storedCharges > 0 && availableRakes === 0)) && (
          <div
            className="flex justify-center absolute w-full pointer-events-none z-30"
            style={style}
          >
            {storedCharges === 0 && (
              <TimeLeftPanel
                text={t("saltHarvest.nextChargeIn")}
                timeLeft={nextChargeInSeconds}
                showTimeLeft={showNextChargePanel}
              />
            )}
            {!visiting && storedCharges > 0 && availableRakes === 0 && (
              <InnerPanel
                className={classNames(
                  "absolute transition-opacity w-fit z-[999] pointer-events-none",
                  {
                    "opacity-100": showNoRakesPanel,
                    "opacity-0": !showNoRakesPanel,
                  },
                )}
                style={{ width: `${PIXEL_SCALE * 40}px` }}
              >
                <p className="text-xxs p-1">
                  {t("saltHarvest.blockedReason.notEnoughSaltRakes")}
                </p>
              </InnerPanel>
            )}
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
