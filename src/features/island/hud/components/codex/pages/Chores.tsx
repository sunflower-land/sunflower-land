import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/lib/gameMachine";
import { FactionName, KingdomChore } from "features/game/types/game";
import { secondsTillReset } from "features/helios/components/hayseedHank/HayseedHankV2";
import { ChoreV2 } from "features/helios/components/hayseedHank/components/ChoreV2";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import { secondsToString } from "lib/utils/time";
import React, { useContext } from "react";

import mark from "assets/icons/faction_mark.webp";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { getKingdomChoreBoost } from "features/game/events/landExpansion/completeKingdomChore";
import { KingdomChoresTimer } from "features/world/ui/factions/chores/KingdomChoresContent";

const _kingdomChores = (state: MachineState) =>
  state.context.state.kingdomChores;

interface Props {
  farmId: number;
}

export const Chores: React.FC<Props> = ({ farmId }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const { ticketTasksAreFrozen } = getSeasonChangeover({
    id: farmId,
  });

  const kingdomChores = useSelector(gameService, _kingdomChores);
  const handleReset = () => {
    gameService.send("kingdomChores.refreshed");
    gameService.send("SAVE");
  };

  return (
    <div className="scrollable overflow-y-auto max-h-[100%] overflow-x-hidden">
      {!ticketTasksAreFrozen && (
        <InnerPanel className="mb-1 w-full">
          <div className="p-1 text-xs">
            <div className="flex justify-between items-center gap-1">
              <Label type="default">{t("chores.hank")}</Label>
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {`${t("hayseedHankv2.newChoresAvailable")} ${secondsToString(
                  secondsTillReset(),
                  {
                    length: "medium",
                  },
                )}`}
              </Label>
            </div>
            <div className="my-1 space-y-1">
              <span className="w-fit">{t("chores.hank.intro")}</span>
            </div>
          </div>
        </InnerPanel>
      )}
      <ChoreV2 isReadOnly isCodex />
      {kingdomChores && (
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
      )}
    </div>
  );
};

interface KingdomChoreRowProps {
  chore: KingdomChore;
  gameService: MachineInterpreter;
}

const KingdomChoreRow: React.FC<KingdomChoreRowProps> = ({
  chore,
  gameService,
}) => {
  const { t } = useAppTranslation();

  const { faction, bumpkin } = gameService.state.context.state;

  const progress =
    (bumpkin?.activity?.[chore.activity] ?? 0) - (chore.startCount ?? 0);

  const boost = getKingdomChoreBoost(
    gameService.state.context.state,
    chore.marks,
  )[0];
  const boostedMarks = setPrecision(
    new Decimal(chore.marks + boost),
    2,
  ).toNumber();

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
              outerDimensions={{
                width: 40,
                height: 7,
              }}
            />
            <span className="text-xs ml-2 font-secondary">{`${setPrecision(
              new Decimal(progress),
            )}/${chore.requirement}`}</span>
          </div>
        </div>

        <div className="flex flex-col text-xs space-y-1">
          <div className="flex items-center justify-end space-x-1">
            <span className="mb-0.5 font-secondary">{boostedMarks}</span>
            <SquareIcon icon={mark} width={6} />
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};

const KINGDOM_CHORE_NPC: Record<FactionName, NPCName> = {
  goblins: "grizzle",
  bumpkins: "buttercup",
  nightshades: "shadow",
  sunflorians: "flora",
};
