import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { KingdomChoresTimer } from "./KingdomChoresContent";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { ResizableBar } from "components/ui/ProgressBar";
import { SquareIcon } from "components/ui/SquareIcon";
import { getKingdomChoreBoost } from "features/game/events/landExpansion/completeKingdomChore";
import { FactionName, KingdomChore } from "features/game/types/game";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { formatNumber } from "lib/utils/formatNumber";
import mark from "assets/icons/faction_mark.webp";

const _kingdomChores = (state: MachineState) =>
  state.context.state.kingdomChores;

export const KingdomChores: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const kingdomChores = useSelector(gameService, _kingdomChores);
  const handleReset = () => {
    gameService.send({ type: "kingdomChores.refreshed" });
    gameService.send({ type: "SAVE" });
  };
  return (
    <div className="mt-3">
      <InnerPanel className="mb-1 w-full">
        <div className="p-1 text-xs">
          <div className="flex justify-between items-center gap-1">
            <Label type="default">{t("chores.kingdom")}</Label>
            <KingdomChoresTimer
              resetsAt={kingdomChores.resetsAt}
              onReset={handleReset}
            />
          </div>
          <div className="my-1 space-y-1">
            <span className="w-fit">{t("chores.kingdom.intro")}</span>
          </div>
        </div>
      </InnerPanel>
      <div className="flex flex-col pb-1 space-y-1">
        {kingdomChores.chores
          .filter(
            (chore) =>
              chore.startedAt && !chore.completedAt && !chore.skippedAt,
          )
          .map((chore, i) => (
            <KingdomChoreRow
              key={`chore-${i}`}
              chore={chore}
              gameService={gameService}
            />
          ))}
      </div>
    </div>
  );
};

const KINGDOM_CHORE_NPC: Record<FactionName, NPCName> = {
  goblins: "grizzle",
  bumpkins: "buttercup",
  nightshades: "shadow",
  sunflorians: "flora",
};

interface KingdomChoreRowProps {
  chore: KingdomChore;
  gameService: MachineInterpreter;
}

const KingdomChoreRow: React.FC<KingdomChoreRowProps> = ({
  chore,
  gameService,
}) => {
  const { faction, farmActivity } = gameService.getSnapshot().context.state;

  const progress =
    (farmActivity[chore.activity] ?? 0) - (chore.startCount ?? 0);

  const boost = getKingdomChoreBoost(
    gameService.getSnapshot().context.state,
    chore.marks,
  )[0];
  const boostedMarks = chore.marks + boost;

  return (
    <InnerPanel className="flex flex-col w-full">
      <div className={"flex space-x-1 p-1 pb-0 pl-0"}>
        {faction && (
          <div className="pb-1 relative">
            <NPCIcon parts={NPC_WEARABLES[KINGDOM_CHORE_NPC[faction.name]]} />
          </div>
        )}

        <div className={`text-xxs flex-1 space-y-1.5 mb-0.5`}>
          <p>{chore.description}</p>
          <div className="flex items-center">
            <ResizableBar
              percentage={(progress / chore.requirement) * 100}
              type="progress"
              outerDimensions={{ width: 40, height: 7 }}
            />
            <span className="text-xs ml-2 font-secondary">{`${formatNumber(progress)}/${formatNumber(chore.requirement)}`}</span>
          </div>
        </div>

        <div className="flex flex-col text-xs space-y-1">
          <div className="flex items-center justify-end space-x-1">
            <span className="mb-0.5 font-secondary">
              {formatNumber(boostedMarks)}
            </span>
            <SquareIcon icon={mark} width={6} />
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};
