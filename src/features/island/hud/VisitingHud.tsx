import React, { useContext, useEffect, useState } from "react";

import { Balances } from "components/Balances";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { InnerPanel, OuterPanel } from "components/ui/Panel";
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
import { Label } from "components/ui/Label";

import socialPointsIcon from "assets/icons/social_score.webp";
import loadingIcon from "assets/icons/timer.gif";
import saveIcon from "assets/icons/save.webp";
import choreIcon from "assets/icons/chores.webp";
import { VisitorGuide } from "./components/VisitorGuide";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  getHelpRequired,
  hasHitHelpLimit,
} from "features/game/types/monuments";
import { Feed } from "features/social/Feed";
import { WorldFeedButton } from "features/social/components/WorldFeedButton";
import classNames from "classnames";
import { isMobile } from "mobile-device-detect";

const _socialPoints = (state: MachineState) => {
  return state.context.state.socialFarming?.points ?? 0;
};
const _autosaving = (state: MachineState) => state.matches("autosaving");

/**
 * Heads up display - a concept used in games for the small overlaid display of information.
 * Balances, Inventory, actions etc.
 */
export const VisitingHud: React.FC = () => {
  const { gameService, fromRoute } = useContext(Context);
  const [gameState] = useActor(gameService);

  const helpRequired = getHelpRequired({
    game: gameState.context.state,
  });

  const [helpRequiredOnLoad] = useState({
    farm: helpRequired.tasks.farm.count,
    home: helpRequired.tasks.home.count,
    petHouse: helpRequired.tasks.petHouse.count,
  });

  const [showVisitorGuide, setShowVisitorGuide] = useState(() => {
    const hasHitLimit = hasHitHelpLimit({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      game: gameState.context.visitorState!,
      totalHelpedToday: gameState.context.totalHelpedToday ?? 0,
    });

    if (hasHitLimit) return true;

    // Check if user has already acknowledged the visitor guide
    const hasAcknowledged =
      localStorage.getItem("visitorGuideAcknowledged") === "true";
    return !hasAcknowledged;
  });
  const [showFeed, setShowFeed] = useState(false);
  const socialPoints = useSelector(gameService, _socialPoints);
  const saving = useSelector(gameService, _autosaving);

  const { t } = useAppTranslation();
  const navigate = useNavigate();

  const handleEndVisit = () => {
    gameService.send({ type: "END_VISIT" });

    const target =
      fromRoute &&
      !fromRoute.includes("visit") &&
      !fromRoute.includes("home") &&
      !fromRoute.includes("barn") &&
      !fromRoute.includes("hen-house") &&
      !fromRoute.includes("greenhouse") &&
      !fromRoute.includes("pet-house")
        ? fromRoute
        : "/";

    navigate(target, { replace: true });
  };

  const displayId =
    gameState.context.state.username ?? gameState.context.farmId;

  const handleCloseVisitorGuide = () => {
    // Store acknowledgment in local storage
    localStorage.setItem("visitorGuideAcknowledged", "true");
    setShowVisitorGuide(false);
    gameService.send({ type: "SAVE" });
  };

  useEffect(() => {
    window.addEventListener("popstate", handleEndVisit);

    return () => {
      window.removeEventListener("popstate", handleEndVisit);
    };
  }, []);

  const showDesktopFeed = showFeed && !isMobile;
  const hideDesktopFeed = !showFeed && !isMobile;

  return (
    <HudContainer>
      <Feed type="world" showFeed={showFeed} setShowFeed={setShowFeed} />
      <Modal show={showVisitorGuide} onHide={handleCloseVisitorGuide}>
        <CloseButtonPanel
          bumpkinParts={gameState.context.state.bumpkin?.equipped}
          container={OuterPanel}
        >
          <VisitorGuide
            onClose={handleCloseVisitorGuide}
            farmHelpRequired={helpRequiredOnLoad.farm}
            homeHelpRequired={helpRequiredOnLoad.home}
            petHouseHelpRequired={helpRequiredOnLoad.petHouse}
          />
        </CloseButtonPanel>
      </Modal>

      {!gameState.matches("landToVisitNotFound") && (
        <InnerPanel className="absolute px-2 pt-1 pb-2 bottom-2 left-1/2 -translate-x-1/2 z-50 flex flex-row">
          <div className="flex flex-col p-0.5 items-center justify-center">
            <div className="flex items-center space-x-1">
              <NPCIcon
                parts={gameState.context.state.bumpkin?.equipped}
                width={20}
              />
              <span className="text-xs">
                {t("visiting.farmId", { farmId: displayId })}
              </span>
            </div>
          </div>
          <div className="w-px h-[36px] bg-gray-300 mx-3 self-center" />
          {(gameState.context.hasHelpedPlayerToday ?? false) ? (
            <div className="flex justify-center items-center flex-grow">
              <img src={SUNNYSIDE.icons.confirm} className="w-5" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center space-x-1">
              <span className="text-md">{`${helpRequired.totalCount}`}</span>
              <img src={choreIcon} style={{ width: `20px`, margin: `2px` }} />
            </div>
          )}
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
            gameService.send({ type: "SAVE" });
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
      <div
        className={classNames(
          "absolute bottom-0 p-2.5 left-0 flex flex-col space-y-2.5 transition-transform",
          {
            "translate-x-0": hideDesktopFeed,
            "translate-x-[320px]": showDesktopFeed,
          },
        )}
      >
        <WorldFeedButton showFeed={showFeed} setShowFeed={setShowFeed} />
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
