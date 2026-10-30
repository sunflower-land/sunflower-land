import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getCaveDigAllGems } from "features/game/lib/cave";
import { CAVE_PATCH_TILE_COUNT } from "features/game/types/caveRecipes";
import type { CaveBatch } from "features/game/types/game";

import { ConfirmButton } from "components/ui/ConfirmButton";
import { InnerPanel } from "components/ui/Panel";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _game = (state: MachineState) => state.context.state;

interface Props {
  machineId: string;
  batch: CaveBatch;
  now: number;
  /** Called once the patch is dug, e.g. to close the popover. */
  onDug?: () => void;
}

/**
 * Dig every tile left in a ready patch at once: one Sand Shovel per tile and
 * Gems for the Beetles and Mushrooms still buried (Mud is free), confirmed
 * with a second tap.
 */
export const CaveDigAll: React.FC<Props> = ({
  machineId,
  batch,
  now,
  onDug,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _game);

  const tiles = CAVE_PATCH_TILE_COUNT - Object.keys(batch.dug ?? {}).length;
  const gems = getCaveDigAllGems({ batch, game, now });
  const shovelBalance = game.inventory["Sand Shovel"] ?? new Decimal(0);
  const gemBalance = game.inventory.Gem ?? new Decimal(0);
  const canAfford = shovelBalance.gte(tiles) && gemBalance.gte(gems);

  return (
    <InnerPanel className="mt-1">
      <p className="text-xs ml-1 mb-1">{t("cave.dig.digAllDescription")}</p>
      <div className="flex flex-wrap gap-2 p-1">
        <RequirementLabel
          type="item"
          item="Sand Shovel"
          balance={shovelBalance}
          requirement={new Decimal(tiles)}
        />
        {gems > 0 && (
          <RequirementLabel
            type="item"
            item="Gem"
            balance={gemBalance}
            requirement={new Decimal(gems)}
          />
        )}
      </div>
      <ConfirmButton
        disabled={!canAfford}
        onConfirm={() => {
          gameService.send({ type: "cave.dugAll", machineId });
          onDug?.();
        }}
      >
        {t("cave.dig.digAll")}
      </ConfirmButton>
    </InnerPanel>
  );
};
