import React, { useContext, useState } from "react";
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
import { TRASH_BIN_FARM_LIMIT } from "features/game/events/landExpansion/collectClutter";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FarmCleaned } from "../hud/components/FarmCleaned";
import { getBinLimit } from "features/game/events/landExpansion/increaseBinLimit";
import sparkle from "public/world/sparkle2.gif";
import { isHelpComplete } from "features/game/types/monuments";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  id: string;
  type: ClutterName;
}

const _farmId = (state: MachineState) => state.context.farmId;
const _dailyCollections = (state: MachineState) =>
  state.context.visitorState?.socialFarming?.dailyCollections;
const _caughtPests = (state: MachineState) =>
  state.context.visitorState?.socialFarming?.caughtPests;
const _inventory = (state: MachineState) =>
  state.context.visitorState?.inventory;

export const Clutter: React.FC<Props> = ({ id, type }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const dailyCollections = useSelector(gameService, _dailyCollections);
  const caughtPests = useSelector(gameService, _caughtPests);
  const inventory = useSelector(gameService, _inventory);
  const isCollected = dailyCollections?.[farmId]?.clutter?.[id];
  const isCaught = caughtPests?.[farmId]?.includes(id);
  const [showEquipTool, setShowEquipTool] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

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

    if (
      hasFeatureAccess(gameService.state.context.visitorState!, "CHEERS_V2")
    ) {
      handleHelpFarm();
      return;
    }

    gameService.send("clutter.collected", {
      id,
      visitedFarmId: farmId,
      clutterType: type,
    });

    const currentClutter =
      gameService.state.context.visitorState?.socialFarming?.dailyCollections;

    // If all 5 collected, pop up modal
    const collectedClutter = Object.keys(
      currentClutter?.[farmId]?.clutter ?? {},
    );

    if (
      collectedClutter.length === TRASH_BIN_FARM_LIMIT &&
      !hasCleanedToday(gameService.state)
    ) {
      setShowComplete(true);
    }
  };

  // V2 - local only event
  const handleHelpFarm = async () => {
    gameService.send("garbage.collected", {
      id,
      visitedFarmId: farmId,
    });

    if (isHelpComplete({ game: gameService.getSnapshot().context.state })) {
      gameService.send("farm.helped", {
        effect: {
          type: "farm.helped",
          farmId: gameService.getSnapshot().context.farmId,
        },
      });
    }
  };

  const binLimit = getBinLimit({
    game: gameService.state.context.visitorState!,
  });

  const disableCollection =
    (getTrashBinItems(gameService.state) >= binLimit && type in FARM_GARBAGE) ||
    (type in FARM_PEST &&
      (!inventory?.["Pest Net"] || inventory?.["Pest Net"]?.lt(1)));

  return (
    <>
      <Modal show={showComplete}>
        <CloseButtonPanel
          bumpkinParts={gameService.state.context.state.bumpkin.equipped}
        >
          <FarmCleaned />
        </CloseButtonPanel>
      </Modal>
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

          <img
            src={sparkle}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 6}px`,
              top: `${PIXEL_SCALE * 6}px`,
              left: `${PIXEL_SCALE * 7}px`,
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
    </>
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
