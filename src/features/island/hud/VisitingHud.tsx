import React, { useContext, useState } from "react";

import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { InnerPanel } from "components/ui/Panel";
import { BumpkinProfile } from "./components/BumpkinProfile";
import { Settings } from "./components/Settings";
import { PIXEL_SCALE } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { useNavigate } from "react-router";
import { MachineState } from "features/game/lib/gameMachine";
import { NPCIcon } from "../bumpkin/components/NPC";
import cheer from "assets/icons/cheer.webp";
import { Label } from "components/ui/Label";
import { getTrashBinItems, hasCleanedToday } from "../clutter/Clutter";
import {
  getCollectedGarbage,
  TRASH_BIN_FARM_LIMIT,
} from "features/game/events/visiting/collectClutter";
import garbageBin from "assets/sfts/garbage_bin.webp";
import socialPointsIcon from "assets/icons/social_score.webp";
import loadingIcon from "assets/icons/timer.gif";
import saveIcon from "assets/icons/save.webp";
import choreIcon from "assets/icons/chores.webp";
import { VisitorGuide } from "./components/VisitorGuide";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { FarmCleaned } from "./components/FarmCleaned";
import { BinGuide } from "./components/BinGuide";
import { getBinLimit } from "features/game/events/landExpansion/increaseBinLimit";

const _cheers = (state: MachineState) => {
  return state.context.visitorState?.inventory["Cheer"] ?? new Decimal(0);
};
const _socialPoints = (state: MachineState) => {
  return state.context.state.socialFarming?.points ?? 0;
};
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _hasUnsavedProgress = (state: MachineState) =>
  state.context.actions.length > 0;

const _showCleanedModal = (state: MachineState) => {
  // If all 5 collected, pop up modal
  const collectedClutter = getCollectedGarbage({
    game: state.context.visitorState!,
    farmId: state.context.farmId,
  });

  if (state.matches("cleaningFarm")) {
    return false;
  }

  return collectedClutter === TRASH_BIN_FARM_LIMIT && !hasCleanedToday(state);
};

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const VisitingHud: React.FC = () => {
  const { gameService, shortcutItem, selectedItem, fromRoute } =
    useContext(Context);

  const [showVisitorGuide, setShowVisitorGuide] = useState(true);
  const [showBinGuide, setShowBinGuide] = useState(false);
  const [gameState] = useActor(gameService);
  const cheers = useSelector(gameService, _cheers);
  const socialPoints = useSelector(gameService, _socialPoints);
  const saving = useSelector(gameService, _autosaving);
  const hasUnsavedProgress = useSelector(gameService, _hasUnsavedProgress);
  const showCleanedModal = useSelector(gameService, _showCleanedModal);

  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const trashBinItems = getTrashBinItems(gameState);

  // If all 5 collected, pop up modal
  const collectedClutter = getCollectedGarbage({
    game: gameState.context.visitorState!,
    farmId: gameState.context.farmId,
  });

  const handleEndVisit = () => {
    navigate(fromRoute ?? "/");
    gameService.send("END_VISIT");
  };

  const displayId =
    gameState.context.state.username ?? gameState.context.farmId;

  const binLimit = getBinLimit({
    game: gameState.context.visitorState!,
  });

  return (
    <HudContainer>
      <Modal show={showVisitorGuide} onHide={() => setShowVisitorGuide(false)}>
        <CloseButtonPanel
          bumpkinParts={gameState.context.state.bumpkin?.equipped}
        >
          <VisitorGuide onClose={() => setShowVisitorGuide(false)} />
        </CloseButtonPanel>
      </Modal>
      <Modal show={showCleanedModal}>
        <CloseButtonPanel
          bumpkinParts={gameState.context.state.bumpkin?.equipped}
        >
          <FarmCleaned />
        </CloseButtonPanel>
      </Modal>
      <Modal show={showBinGuide} onHide={() => setShowBinGuide(false)}>
        <BinGuide onClose={() => setShowBinGuide(false)} />
      </Modal>
      {!gameState.matches("landToVisitNotFound") && (
        <InnerPanel className="absolute px-2 pt-1 pb-2 bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-row">
          <div className="flex flex-col p-0.5">
            <div className="flex items-center space-x-1">
              <NPCIcon
                parts={gameState.context.state.bumpkin?.equipped}
                width={20}
              />
              <span className="text-xs whitespace-nowrap">
                {t("visiting.farmId", { farmId: displayId })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <img src={cheer} style={{ width: `16px`, margin: `2px` }} />
              <span className="text-xxs">{`${cheers.toString()} Cheers Available`}</span>
            </div>
          </div>
          <div className="w-px h-[36px] bg-gray-300 mx-3 self-center" />
          <div className="flex flex-col sm:flex-row items-center space-x-1">
            <span className="text-md">{`${collectedClutter}/${TRASH_BIN_FARM_LIMIT}`}</span>
            <img src={garbageBin} style={{ width: `20px`, margin: `2px` }} />
          </div>
        </InnerPanel>
      )}
      <div className="absolute right-0 top-0 p-2.5">
        <Balances
          sfl={gameState.context.state.balance}
          coins={gameState.context.state.coins}
          gems={gameState.context.state.inventory["Gem"] ?? new Decimal(0)}
        />
      </div>

      <div className="absolute right-0 top-16 p-2.5">
        <RoundButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowVisitorGuide(true);
          }}
        >
          <img
            src={choreIcon}
            className="absolute group-active:translate-y-[2px]"
            style={{
              top: `${PIXEL_SCALE * 4}px`,
              left: `${PIXEL_SCALE * 4}px`,
              width: `${PIXEL_SCALE * 14}px`,
            }}
          />
        </RoundButton>
      </div>
      <div className="absolute right-0 top-32 p-2.5">
        <RoundButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowBinGuide(true);
          }}
        >
          <img
            src={garbageBin}
            className="absolute group-active:translate-y-[2px]"
            style={{
              top: `${PIXEL_SCALE * 4.5}px`,
              left: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
          <div className="w-full absolute -bottom-3 left-0 flex items-center justify-center">
            <Label type={trashBinItems >= binLimit ? "danger" : "default"}>
              {`${trashBinItems}/${binLimit}`}
            </Label>
          </div>
        </RoundButton>
      </div>
      <BumpkinProfile />
      <div className="absolute p-2 left-0 top-24 flex flex-col space-y-2.5">
        <Label type="chill" icon={socialPointsIcon}>
          {socialPoints === 1
            ? t("socialPoint")
            : t("socialPoints", { points: socialPoints })}
        </Label>
      </div>
      <div className="absolute bottom-0 p-2 right-0 flex flex-col space-y-2.5">
        <RoundButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            gameService.send("SAVE");
          }}
        >
          {saving ? (
            <img
              src={loadingIcon}
              className="absolute group-active:translate-y-[2px]"
              style={{
                top: `${PIXEL_SCALE * 5}px`,
                left: `${PIXEL_SCALE * 7}px`,
                width: `${PIXEL_SCALE * 8}px`,
              }}
            />
          ) : (
            <img
              src={saveIcon}
              className="absolute group-active:translate-y-[2px]"
              style={{
                top: `${PIXEL_SCALE * 4}px`,
                left: `${PIXEL_SCALE * 5}px`,
                width: `${PIXEL_SCALE * 12}px`,
              }}
            />
          )}
        </RoundButton>
        <Settings isFarming={false} />
      </div>
      <div className="absolute bottom-0 p-2.5 left-0 flex flex-col space-y-2.5">
        <RoundButton
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleEndVisit();
          }}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            alt="End visit"
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 12}px`,
              left: `${PIXEL_SCALE * 5}px`,
              top: `${PIXEL_SCALE * 4}px`,
            }}
          />
        </RoundButton>
      </div>
    </HudContainer>
  );
};
