import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  ClutterName,
  FARM_GARBAGE,
  FARM_PEST,
} from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import {
  TRASH_BIN_DAILY_LIMIT,
  TRASH_BIN_FARM_LIMIT,
} from "features/game/events/landExpansion/collectClutter";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  id: string;
  type: ClutterName;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _dailyCollections = (state: MachineState) =>
  state.context.visitorState?.socialFarming?.dailyCollections;
const _caughtPests = (state: MachineState) =>
  state.context.visitorState?.socialFarming?.caughtPests;

export const Clutter: React.FC<Props> = ({ id, type }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const dailyCollections = useSelector(gameService, _dailyCollections);
  const caughtPests = useSelector(gameService, _caughtPests);
  const isCollected = dailyCollections?.[farmId]?.clutter?.[id];
  const isCaught = caughtPests?.[farmId]?.includes(id);
  const [showEquipTool, setShowEquipTool] = useState(false);

  if (isCollected || isCaught) {
    return null;
  }

  const collectClutter = () => {
    if (type in FARM_PEST) {
      return gameService.send("pest.caught", {
        id,
        visitedFarmId: farmId,
        pestName: type,
      });
    }

    gameService.send("clutter.collected", {
      id,
      visitedFarmId: farmId,
      clutterType: type,
    });
  };

  const disableCollection =
    (getTrashBinItems(gameService.state) >= TRASH_BIN_DAILY_LIMIT &&
      type in FARM_GARBAGE) ||
    (type in FARM_PEST &&
      gameService.state.context.visitorState?.inventory["Pest Net"]?.lt(1));

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() =>
        disableCollection ? setShowEquipTool(true) : undefined
      }
      onMouseLeave={() => setShowEquipTool(false)}
    >
      <div
        className={classNames(
          "relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center",
          {
            "pointer-events-none cursor-not-allowed": disableCollection,
          },
        )}
        onClick={collectClutter}
      >
        <img
          src={ITEM_DETAILS[type].image}
          alt={`clutter-${type}`}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
      </div>
      {showEquipTool && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -14}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="text-xs mx-1 p-1">
              <span>
                {type in FARM_GARBAGE
                  ? t("clutter.trashBinFull")
                  : `${t("craft")} Pest Net`}
              </span>
            </div>
          </InnerPanel>
        </div>
      )}
    </div>
  );
};

export function hasCleanedToday(state: MachineState) {
  const dailyCollections = _dailyCollections(state);
  const farmId = _farmId(state);
  const pointGivenAt = dailyCollections?.[farmId]?.pointGivenAt;
  const isPointGivenToday =
    pointGivenAt &&
    new Date(pointGivenAt).toISOString().split("T")[0] ===
      new Date().toISOString().split("T")[0];

  return isPointGivenToday;
}

export const useCleanFarm = () => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const dailyCollections = useSelector(gameService, _dailyCollections);

  useEffect(() => {
    const collectedClutter = Object.keys(
      dailyCollections?.[farmId]?.clutter ?? {},
    );

    if (
      collectedClutter.length === TRASH_BIN_FARM_LIMIT &&
      !hasCleanedToday(gameService.state)
    ) {
      gameService.send("farm.cleaned", {
        effect: { type: "farm.cleaned", visitedFarmId: farmId },
      });
    }
  }, [dailyCollections, farmId, gameService]);
};

export const getTrashBinItems = (state: MachineState) => {
  const allClutter = Object.keys(_dailyCollections(state) ?? {});
  const trashBinItems = allClutter.reduce((acc: number, farm: string) => {
    return (
      acc +
      Object.keys(_dailyCollections(state)?.[Number(farm)]?.clutter ?? {})
        .length
    );
  }, 0);

  return trashBinItems;
};
