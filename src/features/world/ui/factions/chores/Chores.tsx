import React, { useContext, useLayoutEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { InventoryItemName, KingdomChores } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { InlineDialogue } from "../../TypingMessage";

interface Props {
  kingdomChores: KingdomChores;
  onClose: () => void;
}

const WEEKLY_CHORES = 21;
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const Chores: React.FC<Props> = ({ kingdomChores }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [isSkipping, setIsSkipping] = useState(false);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);

  const [selected, setSelected] = useState<number>(0);

  useLayoutEffect(() => {
    const chore = kingdomChores.chores[selected];
    if (!chore.completedAt && !chore.skippedAt) {
      return;
    }

    let nextChore = chores
      .slice(selected + 1)
      .find(
        ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
      );

    if (nextChore) {
      setSelected(Number(nextChore[0]));
      return;
    }

    nextChore = chores
      .slice(0, selected)
      .reverse()
      .find(
        ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
      );

    if (nextChore) {
      setSelected(Number(nextChore[0]));
      return;
    }
  }, [kingdomChores]);

  const chores = Object.entries(kingdomChores.chores);

  const activeChores = chores.filter(
    ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
  );
  const completedChores = chores.filter(([, chore]) => chore.completedAt);
  const upcomingChores = chores.filter(([, chore]) => !chore.startedAt);

  const completedCount = completedChores.length;

  const handleComplete = (index: number) => {
    gameService.send("kingdomChore.completed", { id: index });
    gameService.send("SAVE");
  };

  if (kingdomChores.chores.length === 0) {
    return (
      <InnerPanel>
        <div
          className="p-2"
          style={{
            minHeight: "65px",
          }}
        >
          <InlineDialogue
            message={"I'm sorry, no chores are available right now!"}
          />
        </div>
      </InnerPanel>
    );
  }

  const getProgress = (index: number) => {
    return (
      (bumpkin?.activity?.[kingdomChores.chores[index].activity] ?? 0) -
      (kingdomChores.chores[index].startCount ?? 0)
    );
  };

  // const handleSkip = (id: any) => {
  //   setIsSkipping(true);
  //   gameService.send("chore.skipped", { id: Number(id) });
  //   gameService.send("SAVE");
  // };
  const selectedChore = kingdomChores.chores[selected];

  const canComplete = getProgress(selected) >= selectedChore.requirement;

  if (isSkipping && autosaving) {
    return (
      <OuterPanel className="!p-2 mb-2 text-xs">
        <span className="loading text-sm">{t("skipping")}</span>
      </OuterPanel>
    );
  }

  return (
    <SplitScreenView
      panel={
        <Panel
          canComplete={canComplete}
          description={selectedChore.description}
          onComplete={() => handleComplete(selected)}
          image={selectedChore.image}
          marks={selectedChore.marks}
          resetsAt={kingdomChores.resetsAt}
        />
      }
      content={
        <>
          <div className="flex flex-col mb-2 w-full">
            {
              <div className="flex flex-row justify-between pl-1 ">
                <Label type="default" className="text-center">
                  {`Chores`}
                </Label>
                <p className="text-xxs">
                  {completedCount} {t("completed")}
                </p>
              </div>
            }
            <div className="flex mb-2 flex-wrap pl-0.5">
              {activeChores.map(([choreId, chore]) => (
                <Box
                  key={choreId}
                  onClick={() => setSelected(Number(choreId))}
                  isSelected={selected === Number(choreId)}
                  image={ITEM_DETAILS[chore.image].image}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col mb-2 w-full">
            {
              <div className="flex flex-row justify-between pl-1">
                <Label type="default" className="text-center">
                  {`Upcoming`}
                </Label>
                <p className="text-xxs">
                  {t("chores.upcoming", {
                    chores: WEEKLY_CHORES - activeChores.length,
                  })}
                </p>
              </div>
            }
            <div className="flex flex-wrap pl-0.5">
              {upcomingChores.slice(0, 3).map(([choreId, chore]) => (
                <Box
                  key={choreId}
                  onClick={() => setSelected(Number(choreId))}
                  isSelected={selected === Number(choreId)}
                  image={ITEM_DETAILS[chore.image].image}
                />
              ))}
            </div>
          </div>
        </>
      }
    />
  );
};

type PanelProps = {
  canComplete: boolean;
  image: InventoryItemName;
  description: string;
  onComplete: () => void;
  marks: number;
  resetsAt: number | undefined;
};

const Panel: React.FC<PanelProps> = ({
  canComplete,
  image: resource,
  description,
  marks,
  resetsAt,
  onComplete,
}: PanelProps) => {
  return (
    <div className="flex flex-col justify-center">
      {resetsAt ? (
        <Label
          type="info"
          className="font-secondary mb-2 whitespace-nowrap"
          icon={SUNNYSIDE.icons.stopwatch}
        >
          {"Reset: "}
          {secondsToString(Math.round((resetsAt - Date.now()) / 1000), {
            length: "medium",
            removeTrailingZeros: true,
          })}
        </Label>
      ) : null}
      <div className="flex flex-col justify-center px-1 py-1">
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          {ITEM_DETAILS[resource].image && (
            <div className="sm:mt-2">
              <SquareIcon icon={ITEM_DETAILS[resource].image} width={14} />
            </div>
          )}
          <span className="sm:text-center">{description}</span>
        </div>
        <div className="flex flex-col space-y-1 mt-2">
          <div className="flex justify-start sm:justify-center">
            <Label type="warning" className="text-center">
              {marks} {`Marks`}
            </Label>
          </div>
        </div>
      </div>

      <>
        <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
          <Button disabled={!canComplete} onClick={() => onComplete()}>
            {`Complete`}
          </Button>
        </div>
      </>
    </div>
  );
};
