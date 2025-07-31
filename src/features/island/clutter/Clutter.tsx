import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ClutterName } from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import {
  TRASH_BIN_DAILY_LIMIT,
  TRASH_BIN_FARM_LIMIT,
} from "features/game/events/landExpansion/collectClutter";
import classNames from "classnames";

interface Props {
  id: string;
  type: ClutterName;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _dailyCollections = (state: MachineState) =>
  state.context.visitorState?.socialFarming?.dailyCollections;

export const Clutter: React.FC<Props> = ({ id, type }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const dailyCollections = useSelector(gameService, _dailyCollections);
  const isCollected = dailyCollections?.[farmId]?.clutter?.[id];

  if (isCollected) {
    return null;
  }

  const collectClutter = () => {
    gameService.send("clutter.collected", {
      id,
      visitedFarmId: farmId,
      clutterType: type,
    });
  };

  return (
    <>
      <div
        className={classNames(
          "relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center",
          {
            "opacity-50 pointer-events-none":
              getTrashBinItems(gameService.state) >= TRASH_BIN_DAILY_LIMIT,
          },
        )}
        onClick={collectClutter}
      >
        <img
          src={ITEM_DETAILS[type].image}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
      </div>
    </>
  );
};

export const useCleanFarm = () => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const dailyCollections = useSelector(gameService, _dailyCollections);

  useEffect(() => {
    const collectedClutter = Object.keys(
      dailyCollections?.[farmId]?.clutter ?? {},
    );
    const pointGivenAt = dailyCollections?.[farmId]?.pointGivenAt;
    const isPointGivenToday =
      pointGivenAt &&
      new Date(pointGivenAt).toISOString().split("T")[0] ===
        new Date().toISOString().split("T")[0];

    if (
      collectedClutter.length === TRASH_BIN_FARM_LIMIT &&
      !isPointGivenToday
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
