import React, { useEffect, useState } from "react";

import { QuickSelect } from "features/greenhouse/QuickSelect";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { GreenHouseCropSeedName } from "features/game/types/crops";
import { getOilUsage } from "features/game/events/landExpansion/plantGreenhouse";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { GameBridge, QuickSelectRequest } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";
import { playSound } from "../core/sounds";

/**
 * Greenhouse overlay chrome [greenhouse/GreenhousePot.tsx]: the quick-select
 * seed discs over an empty pot when no plantable seed is selected. The pots,
 * oil machine and their clicks are Phaser; this hosts the one React widget.
 */

const GreenhouseQuickSelect: React.FC<{
  bridge: GameBridge;
  anchorId: string;
  potId: string;
}> = ({ bridge, anchorId, potId }) => {
  const { t } = useAppTranslation();
  const rect = useWorldAnchor(anchorId);
  if (!rect?.visible) return null;

  const boxCss = 28 * PIXEL_SCALE; // the pot box the DOM anchors against

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: 0,
        height: 0,
        transform: `scale(${rect.width / boxCss})`,
        transformOrigin: "0 0",
      }}
    >
      {/* [GreenhousePot.tsx] discs float above the pot: top-[-200%] left-1/2 */}
      <div
        className="flex absolute z-40 shadow-md"
        style={{ top: `${-boxCss * 2}px`, left: `${boxCss / 2}px` }}
      >
        <QuickSelect
          options={[
            { name: "Grape Seed", icon: "Grape", showSecondaryImage: true },
            { name: "Rice Seed", icon: "Rice", showSecondaryImage: true },
            { name: "Olive Seed", icon: "Olive", showSecondaryImage: true },
          ]}
          onClose={() => bridge.quickSelect.set(null)}
          onSelected={(seed) => {
            // [GreenhousePot.tsx plantSeed] the oil guard also applies here;
            // an insufficient-oil pick closes the picker, and the next pot
            // click surfaces the oil warning.
            const game = bridge.select((state) => state.context.state);
            const { usage } = getOilUsage({
              seed: seed as GreenHouseCropSeedName,
              game,
            });
            if (usage <= game.greenhouse.oil) {
              bridge.dispatch("greenhouse.planted", {
                id: Number(potId),
                seed: seed as GreenHouseCropSeedName,
              });
              playSound("plant");
            }
            bridge.quickSelect.set(null);
          }}
          type={t("quickSelect.greenhouseSeeds")}
          showExpanded
        />
      </div>
    </div>
  );
};

export const GreenhouseUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [request, setRequest] = useState<QuickSelectRequest>(
    bridge.quickSelect.get(),
  );
  useEffect(() => bridge.quickSelect.subscribe(setRequest), [bridge]);

  if (!request) return null;
  return (
    <GreenhouseQuickSelect
      bridge={bridge}
      anchorId={request.anchorId}
      potId={request.patchId}
    />
  );
};
