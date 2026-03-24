import React, { useContext, useLayoutEffect, useRef, useState } from "react";

import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { Attempts } from "./Attempts";
import { getAttemptsLeft, isWithinRange } from "../../lib/Utils";
import { goHome } from "features/portal/lib/portalUtil";
import { PortalMachineState } from "../../lib/Machine";
import { PORTAL_NAME } from "../../Constants";
import { decodeToken } from "features/auth/actions/login";
import { getUrl } from "features/portal/actions/loadPortal";
// import { hasFeatureAccess } from "lib/flags";
// import { AchievementsList } from "./AchievementsList";

import key from "public/world/base/key.png";
import { OuterPanel } from "components/ui/Panel";
import { Controls } from "./Controls";
import { Immunities_Wearables } from "./ImmunitiesWearables";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  mode: "introduction" | "success" | "failed";
  showScore?: boolean;
  showExitButton: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
  trainingButtonText?: string;
  onTraining?: () => void;
}

const _lastScore = (state: PortalMachineState) => state.context.lastScore;
const _minigame = (state: PortalMachineState) =>
  state.context.state?.minigames.games[PORTAL_NAME];
const _jwt = (state: PortalMachineState) => state.context.jwt;

type SwapSlot = "left" | "right";

const SWAP_TRANSITION = "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)";

const useSwappablePair = () => {
  const [isSwapped, setIsSwapped] = useState(false);
  const hasSwappedRef = useRef(false);
  const slotRefs = useRef<Record<SwapSlot, HTMLDivElement | null>>({
    left: null,
    right: null,
  });
  const previousRectsRef = useRef<Partial<Record<SwapSlot, DOMRect>> | null>(
    null,
  );

  const setSlotRef =
    (slot: SwapSlot) => (element: HTMLDivElement | null) => {
      slotRefs.current[slot] = element;
    };

  const swapOnce = () => {
    if (hasSwappedRef.current) return false;

    previousRectsRef.current = {
      left: slotRefs.current.left?.getBoundingClientRect(),
      right: slotRefs.current.right?.getBoundingClientRect(),
    };

    hasSwappedRef.current = true;
    setIsSwapped((current) => !current);

    return true;
  };

  useLayoutEffect(() => {
    const previousRects = previousRectsRef.current;

    if (!previousRects) return;

    (Object.keys(slotRefs.current) as SwapSlot[]).forEach((slot) => {
      const element = slotRefs.current[slot];
      const previousRect = previousRects[slot];

      if (!element || !previousRect) return;

      const currentRect = element.getBoundingClientRect();
      const deltaX = previousRect.left - currentRect.left;
      const deltaY = previousRect.top - currentRect.top;

      if (!deltaX && !deltaY) return;

      element.style.transition = "none";
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

      void element.getBoundingClientRect();

      element.style.transition = SWAP_TRANSITION;
      element.style.transform = "";
      element.addEventListener(
        "transitionend",
        () => {
          element.style.transition = "";
        },
        { once: true },
      );
    });

    previousRectsRef.current = null;
  }, [isSwapped]);

  return {
    isSwapped,
    setSlotRef,
    swapOnce,
  };
};

export const Mission: React.FC<Props> = ({
  mode,
  showScore,
  showExitButton,
  confirmButtonText,
  onConfirm,
  trainingButtonText,
  onTraining,
}) => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const lastScore = useSelector(portalService, _lastScore);
  const minigame = useSelector(portalService, _minigame);
  const jwt = useSelector(portalService, _jwt);

  const farmId = !getUrl() ? 0 : decodeToken(jwt as string).farmId;
  const attemptsLeft = getAttemptsLeft(minigame, farmId);

  const dateKey = new Date().toISOString().slice(0, 10);

  const [page, setPage] = React.useState<
    "main" | "achievements" | "guide" | "controls"
  >("main");
  const [isConfirming, setIsConfirming] = useState(false);

  const topPair = useSwappablePair();
  const bottomPair = useSwappablePair();

  const formattedLastScore = () => lastScore;
  const formattedBestToday = () => minigame?.history[dateKey]?.highscore;
  const formattedBestAllTime = () =>
    Object.entries(minigame?.history ?? {}).reduce((acc, [date, entry]) => {
      if (!isWithinRange(date)) return acc;
      return Math.max(acc, entry.highscore);
    }, 0);

  // const hasBetaAccess = state
  //   ? hasFeatureAccess(state, "")
  //   : false;

  const triggerSwap =
    (swapOnce: () => boolean) => (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      if (!swapOnce()) return;

      event.preventDefault();
      event.stopPropagation();
    };

  return (
    <>
      {page === "main" && (
        <div className="px-2">
          <div>
            <div className="w-full relative flex justify-between gap-1 items-center pt-1">
              <div
                ref={topPair.setSlotRef("left")}
                style={{
                  order: topPair.isSwapped ? 1 : 0,
                  willChange: "transform",
                }}
              >
                <Attempts attemptsLeft={attemptsLeft} />
              </div>
              <div
                className="gap-1"
                ref={topPair.setSlotRef("right")}
                onClickCapture={triggerSwap(topPair.swapOnce)}
                style={{
                  order: topPair.isSwapped ? 0 : 1,
                  willChange: "transform",
                }}
              >
                <Button
                  className="whitespace-nowrap capitalize w-32 p-0"
                  onClick={() => setPage("controls")}
                >
                  <div className="flex flex-row gap-1 justify-center items-center">
                    <img src={key} className="h-5 mt-1" />
                    {t(`${PORTAL_NAME}.controls`)}
                  </div>
                </Button>
              </div>
            </div>

            <div className="w-full mt-1 mb-3 flex flex-col gap-2">
              <p>{t(`${PORTAL_NAME}.intro.description1`)}</p>
              <p>{t(`${PORTAL_NAME}.intro.description2`)}</p>
            </div>

            <div className="w-full flex flex-col gap-1 mb-3">
              <OuterPanel className="w-full flex flex-col items-center">
                <Label type="info">{t("leaderboard.score")}</Label>
                <div>{formattedLastScore()}</div>
              </OuterPanel>
              <div className="flex gap-1">
                <OuterPanel className="w-full flex flex-col items-center">
                  <Label type="default">{t(`${PORTAL_NAME}.bestToday`)}</Label>
                  <div>{formattedBestToday()}</div>
                </OuterPanel>
                <OuterPanel className="w-full flex flex-col items-center">
                  <Label type="default">
                    {t(`${PORTAL_NAME}.bestAllTime`)}
                  </Label>
                  <div>{formattedBestAllTime()}</div>
                </OuterPanel>
              </div>
              <OuterPanel className="w-full flex flex-col items-center">
                <Label type="default">
                  {t(`${PORTAL_NAME}.Immunity`)}
                </Label>
                <Immunities_Wearables />
              </OuterPanel>
            </div>
          </div>

          {trainingButtonText ? (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1">
                <div
                  className="w-full"
                  ref={bottomPair.setSlotRef("left")}
                  onClickCapture={triggerSwap(bottomPair.swapOnce)}
                  style={{
                    order: bottomPair.isSwapped ? 1 : 0,
                    willChange: "transform",
                  }}
                >
                  <Button
                    className="whitespace-nowrap capitalize"
                    onClick={onTraining}
                  >
                    {trainingButtonText}
                  </Button>
                </div>
                {confirmButtonText && (
                  <div
                    className="w-full"
                    ref={bottomPair.setSlotRef("right")}
                    style={{
                      order: bottomPair.isSwapped ? 0 : 1,
                      willChange: "transform",
                    }}
                  >
                    <Button
                      className="whitespace-nowrap capitalize"
                      onClick={() => setIsConfirming(true)}
                    >
                      {confirmButtonText}
                    </Button>
                  </div>
                )}
              </div>
              {showExitButton && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={goHome}
                >
                  {t("exit")}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex mt-1 space-x-1">
              {showExitButton && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={goHome}
                >
                  {t("exit")}
                </Button>
              )}
              {confirmButtonText && (
                <Button
                  className="whitespace-nowrap capitalize"
                  onClick={() => setIsConfirming(true)}
                >
                  {confirmButtonText}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {/* {page === "achievements" && (
        <AchievementsList onBack={() => setPage("main")} />
      )} */}
      {page === "controls" && <Controls onBack={() => setPage("main")} />}

      <ModalOverlay
        show={isConfirming}
        onBackdropClick={() => setIsConfirming(false)}
      >
        <CloseButtonPanel onClose={() => setIsConfirming(false)}>
          <div className="flex flex-col items-center p-2">
            <span className="text-center mb-2 mt-5">
              {t("april-fools.confirm.message")}
            </span>
            <div className="flex w-full space-x-1 mt-2">
              <Button onClick={onConfirm}>
                {t("april-fools.confirm.yes")}
              </Button>
              <Button onClick={onConfirm}>
                {t("april-fools.confirm.yes")}
              </Button>
            </div>
          </div>
        </CloseButtonPanel>
      </ModalOverlay>
    </>
  );
};
