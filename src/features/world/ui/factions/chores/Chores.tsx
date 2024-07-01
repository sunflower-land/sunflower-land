import React, { useContext, useState } from "react";
import { useActor, useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { InventoryItemName, KingdomChores } from "features/game/types/game";
import { Label } from "components/ui/Label";

interface Props {
  chores: KingdomChores | undefined;
  onClose: () => void;
}

const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const Chores: React.FC<Props> = ({ chores }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [selected, setSelected] = useState<number>(1);
  const [isSkipping, setIsSkipping] = useState(false);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);

  const handleComplete = (id: any) => {
    gameService.send("kingdomChore.completed", { id: Number(id) });
    gameService.send("SAVE");
  };

  if (chores === undefined) {
    return (
      <OuterPanel className="!p-2 mb-2 text-xs">
        <span className="text-sm">{`No chores found`}</span>
      </OuterPanel>
    );
  }

  const choreSelected = chores.chores[selected];

  const getProgress = (id: number) =>
    (bumpkin?.activity?.[chores.chores[id].activity] ?? 0) -
    chores.chores[id].startCount;

  // const handleSkip = (id: any) => {
  //   setIsSkipping(true);
  //   gameService.send("chore.skipped", { id: Number(id) });
  //   gameService.send("SAVE");
  // };

  const canComplete = getProgress(selected) >= choreSelected.requirement;

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
          description={choreSelected.description}
          onComplete={() => handleComplete(selected)}
          resource={choreSelected.resource}
          marks={choreSelected.marks}
        />
      }
      content={
        <>
          <div className="flex flex-col pl-2 mb-2 w-full">
            {
              <div className="flex flex-row justify-between">
                <Label type="default" className="text-center">
                  {`Chores`}
                </Label>
                <p className="text-xxs">
                  {chores.weeklyChoresCompleted} {t("completed")}
                </p>
              </div>
            }
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(chores.chores)
                .filter(
                  (choreId) =>
                    chores.chores[choreId].active &&
                    chores.chores[choreId].completedAt === undefined,
                )
                .map((choreId) => (
                  <Box
                    key={choreId}
                    onClick={() => {
                      setSelected(choreId);
                    }}
                    isSelected={selected === choreId}
                    image={ITEM_DETAILS[chores.chores[choreId].resource].image}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col pl-2 mb-2 w-full">
            {
              <div className="flex flex-row justify-between">
                <Label type="default" className="text-center">
                  {`Upcoming`}
                </Label>
                <p className="text-xxs">
                  {t("chores.left", {
                    chores: chores.weeklyChores - chores.weeklyChoresCompleted,
                  })}
                </p>
              </div>
            }
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(chores.chores)
                .filter((choreId) => !chores.chores[choreId].active)
                .map((choreId) => (
                  <Box
                    key={choreId}
                    onClick={() => {
                      setSelected(choreId);
                    }}
                    isSelected={selected === choreId}
                    image={ITEM_DETAILS[chores.chores[choreId].resource].image}
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
  resource: InventoryItemName;
  description: string;
  onComplete: () => void;
  marks: number;
};

const Panel: React.FC<PanelProps> = ({
  canComplete,
  resource,
  description,
  marks,
  onComplete,
}: PanelProps) => {
  return (
    <div className="flex flex-col justify-center">
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
