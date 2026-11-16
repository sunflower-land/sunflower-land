import Switch from "components/ui/Switch";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  hasExperiment,
  type ExperimentName,
} from "features/game/types/experiments";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { useVisiting } from "lib/utils/visitUtils";

const _gameState = (state: MachineState) => state.context.state;

interface Props {
  experiment: ExperimentName;
  /** What the experiment does, in the player's words. */
  description: string;
  /** Label beside the switch, e.g. "Enable saved layouts". */
  toggleLabel: string;
  /** Shown above the switch when the experiment can lose the player work. */
  disclaimer?: string;
}

/**
 * One experiment's settings screen: a description and the switch that stores
 * the player's choice on their farm. Every experiment page is this shape, so
 * a new one only needs its copy (see types/experiments.ts).
 */
export const ExperimentToggle: React.FC<Props> = ({
  experiment,
  description,
  toggleLabel,
  disclaimer,
}) => {
  const { gameService } = useContext(GameContext);
  const { isVisiting } = useVisiting();
  const gameState = useSelector(gameService, _gameState);

  const enabled = hasExperiment(gameState, experiment);

  return (
    <div className="flex flex-col gap-3 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">{description}</p>
      <div className="rounded-md border-2 border-amber-800/70 bg-stone-950/35 p-3 space-y-3">
        {disclaimer && (
          <p className="text-xxs text-start leading-snug text-amber-100/95 italic">
            {disclaimer}
          </p>
        )}
        <Switch
          checked={enabled}
          onChange={() =>
            gameService.send({
              type: "experiment.toggled",
              experiment,
              enabled: !enabled,
            })
          }
          disabled={isVisiting}
          label={toggleLabel}
        />
      </div>
    </div>
  );
};
