import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { InventoryItemName, KingdomChores } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { InlineDialogue } from "../../TypingMessage";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  chores: KingdomChores;
  onClose: () => void;
}

const WEEKLY_CHORES = 21;
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const Chores: React.FC<Props> = ({ chores }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [isSkipping, setIsSkipping] = useState(false);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);

  const handleComplete = (id: any) => {
    gameService.send("kingdomChore.completed", { id: Number(id) });
    gameService.send("SAVE");
  };

  const numChores = getKeys(chores.chores ?? {}).length;

  if (numChores === 0) {
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

  const choreIndex = Math.min(selectedIndex, numChores - 1);
  const selected = getKeys(chores.chores)[choreIndex];
  const choreSelected = chores.chores[selected];

  console.log({ chores, selected, choreSelected });

  const getProgress = (id: number) => {
    if (!chores.activeChores[id]) return 0;

    return (
      (bumpkin?.activity?.[chores.chores[id].activity] ?? 0) -
      (chores.activeChores[id].startCount ?? 0)
    );
  };

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
          image={choreSelected.image}
          marks={choreSelected.marks}
          resetsAt={chores.resetsAt}
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
                  {chores.weeklyChoresCompleted.length} {t("completed")}
                </p>
              </div>
            }
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(chores.chores)
                .filter((choreId) => chores.activeChores[choreId] !== undefined)
                .map((choreId, i) => (
                  <Box
                    key={choreId}
                    onClick={() => setSelectedIndex(i)}
                    isSelected={selected === choreId}
                    image={ITEM_DETAILS[chores.chores[choreId].image].image}
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
                    chores: WEEKLY_CHORES - chores.weeklyChoresCompleted.length,
                  })}
                </p>
              </div>
            }
            <div className="flex mb-2 flex-wrap -ml-1.5">
              {getKeys(chores.chores)
                .filter((choreId) => chores.activeChores[choreId] === undefined)
                .slice(0, 3)
                .map((choreId, i) => (
                  <Box
                    key={choreId}
                    onClick={() => setSelectedIndex(i)}
                    isSelected={selected === choreId}
                    image={ITEM_DETAILS[chores.chores[choreId].image].image}
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
          {"Resets in "}
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
