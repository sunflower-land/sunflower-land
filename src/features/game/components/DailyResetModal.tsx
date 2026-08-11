import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { NPC_WEARABLES } from "lib/npcs";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { getKeys } from "lib/object";
import { useSound } from "lib/utils/hooks/useSound";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import deliveryIcon from "assets/icons/delivery.webp";
import choresIcon from "assets/icons/chores.webp";
import giftIcon from "assets/icons/gift.png";
import swordsIcon from "assets/icons/factions.webp";
import budIcon from "assets/icons/bud.png";

// Clouds stay closed through the save (`dailyResetting`) so the world only
// reveals once the new day's game state has come back from the server
const _showDailyReset = (state: MachineState) =>
  state.matches("dailyReset") || state.matches("dailyResetting");
const _isDailyResetting = (state: MachineState) =>
  state.matches("dailyResetting");
const _state = (state: MachineState) => state.context.state;

const LOADING_MESSAGES: TranslationKeys[] = [
  "dailyReset.loading.one",
  "dailyReset.loading.two",
  "dailyReset.loading.three",
  "dailyReset.loading.four",
];

// Same design widths as DynamicClouds — rendered at their normal in-game
// size (design width * PIXEL_SCALE), not stretched
const CLOUD_SPRITES = [
  { src: SUNNYSIDE.land.cloud1, width: 68 },
  { src: SUNNYSIDE.land.cloud2, width: 36 },
  { src: SUNNYSIDE.land.cloud3, width: 68 },
  { src: SUNNYSIDE.land.cloud4, width: 68 },
  { src: SUNNYSIDE.land.cloud5, width: 52 },
  { src: SUNNYSIDE.land.cloud6, width: 68 },
];

// Deterministic pseudo-random so the puff layout is stable across renders
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Individual cloud puffs scattered over the viewport at their normal in-game
// size. Each drifts in radially (away from the screen centre when hidden)
// with its own speed and delay so the cover billows in and disperses rather
// than sliding as one piece.
const CLOUD_PUFFS = Array.from({ length: 200 }, (_, i) => {
  const sprite = CLOUD_SPRITES[i % CLOUD_SPRITES.length];
  // Spread slightly past the viewport (-8%..105%) so clouds overlap and hang
  // off the edges of the screen rather than stopping at them
  const left = seeded(i, 1) * 113 - 8;
  const top = seeded(i, 2) * 113 - 8;

  // Vector pointing away from the centre of the screen
  const dx = (left - 47) * 2.2;
  const dy = (top - 47) * 2.2;

  return {
    src: sprite.src,
    left,
    top,
    width: sprite.width * PIXEL_SCALE,
    hidden: `translate(${dx}vw, ${dy}vh) scale(0.8)`,
    duration: 900 + seeded(i, 4) * 800,
    delay: seeded(i, 5) * 400,
    floatDelay: seeded(i, 6) * 3000,
  };
});

// Longest dispersal transition (max duration + max delay, with headroom) —
// the cloud layer unmounts once this has elapsed
const CLOUD_EXIT_MS = 2500;

export const DailyResetModal: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const isDailyReset = useSelector(gameService, _showDailyReset);
  const isDailyResetting = useSelector(gameService, _isDailyResetting);
  const state = useSelector(gameService, _state);

  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [loadingDots, setLoadingDots] = useState("");

  const { play: playRooster } = useSound("morning_rooster");
  const wasShowing = useRef(false);
  const wasResetting = useRef(false);

  // The cloud layer (200 animated sprites) only exists around the reset:
  // mounted on entry, kept through the dispersal, then removed so it isn't
  // sitting in the DOM animating for the rest of the session
  const [cloudsShown, setCloudsShown] = useState(false);
  const [cloudsExited, setCloudsExited] = useState(true);
  const cloudsMounted = isDailyReset || !cloudsExited;

  useEffect(() => {
    if (isDailyReset) {
      // Let the hidden positions paint for a frame so the roll-in transitions
      let showFrame: number | undefined;
      const paintFrame = requestAnimationFrame(() => {
        showFrame = requestAnimationFrame(() => {
          setCloudsShown(true);
          setCloudsExited(false);
        });
      });

      return () => {
        cancelAnimationFrame(paintFrame);
        if (showFrame !== undefined) cancelAnimationFrame(showFrame);
      };
    }

    const exitFrame = requestAnimationFrame(() => setCloudsShown(false));
    const unmountTimeout = setTimeout(
      () => setCloudsExited(true),
      CLOUD_EXIT_MS,
    );

    return () => {
      cancelAnimationFrame(exitFrame);
      clearTimeout(unmountTimeout);
    };
  }, [isDailyReset]);

  // Crow as the new day fades in
  useEffect(() => {
    if (!wasShowing.current && isDailyReset) {
      playRooster();
    }
    wasShowing.current = isDailyReset;
  }, [isDailyReset, playRooster]);

  // Crow again as the clouds part — once the save has come back
  useEffect(() => {
    if (wasResetting.current && !isDailyResetting) {
      playRooster();
    }
    wasResetting.current = isDailyResetting;
  }, [isDailyResetting, playRooster]);

  // Rotate through the flavour messages (with animated dots) while the new
  // day is saving
  useEffect(() => {
    if (!isDailyResetting) return;

    const messageInterval = setInterval(() => {
      setLoadingMessageIndex((index) => index + 1);
    }, 1600);

    const dotsInterval = setInterval(() => {
      setLoadingDots((dots) => (dots.length >= 3 ? "" : `${dots}.`));
    }, 400);

    return () => {
      clearInterval(messageInterval);
      clearInterval(dotsInterval);
    };
  }, [isDailyResetting]);

  // Only show deliveries/chores if one has been completed and is waiting
  // to be replaced by the reset
  const hasCompletedDelivery = state.delivery.orders.some(
    (order) => !!order.completedAt,
  );
  const hasCompletedChore = Object.values(state.choreBoard.chores).some(
    (chore) => !!chore?.completedAt,
  );
  const hasBud = getKeys(state.buds ?? {}).length > 0;

  const items = [
    ...(hasCompletedDelivery
      ? [{ text: t("dailyReset.deliveries"), icon: deliveryIcon }]
      : []),
    ...(hasCompletedChore
      ? [{ text: t("dailyReset.chores"), icon: choresIcon }]
      : []),
    { text: t("dailyReset.fishing"), icon: SUNNYSIDE.icons.fish_icon },
    {
      text: t("dailyReset.digging"),
      icon: ITEM_DETAILS["Sand Shovel"].image,
    },
    { text: t("dailyReset.dailyChest"), icon: giftIcon },
    { text: t("dailyReset.minigames"), icon: swordsIcon },
    ...(hasBud ? [{ text: t("dailyReset.budBox"), icon: budIcon }] : []),
  ];

  const handleContinue = () => {
    gameService.send({ type: "daily.reset" });
    gameService.send({ type: "CONTINUE" });
  };

  const transitionStyle = (duration: number, delay: number) => ({
    transition: `transform ${Math.round(duration)}ms ease-in-out ${Math.round(
      delay,
    )}ms, opacity ${Math.round(duration)}ms ease-in-out ${Math.round(delay)}ms`,
  });

  return (
    <>
      {/* Clouds cover the screen while the modal is open and disperse to
          reveal the new day when the player continues. Portalled so they
          overlay everything; mounted only from entry until the dispersal
          finishes. */}
      {cloudsMounted &&
        createPortal(
          <div
            className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
            aria-hidden
          >
            {/* Night falls first: fade to black, then the sky lightens to white
              as the clouds roll over the top. On the way out only the white
              layer fades, so the reveal is a clean sky clearing. */}
            <div
              className="absolute inset-0 bg-black"
              style={{
                transition: cloudsShown
                  ? "opacity 2000ms ease-in-out"
                  : "opacity 0ms",
                opacity: cloudsShown ? 1 : 0,
              }}
            />
            <div
              className="absolute inset-0 bg-white"
              style={{
                transition: cloudsShown
                  ? "opacity 1200ms ease-in-out 2200ms"
                  : "opacity 1000ms ease-in-out",
                opacity: cloudsShown ? 1 : 0,
              }}
            />
            {CLOUD_PUFFS.map((puff, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  left: `${puff.left}%`,
                  top: `${puff.top}%`,
                  width: `${puff.width}px`,
                  // Entry waits for dusk to settle in; exit disperses right away
                  ...transitionStyle(
                    puff.duration,
                    cloudsShown ? puff.delay + 1000 : puff.delay,
                  ),
                  transform: cloudsShown ? "translate(0, 0)" : puff.hidden,
                  opacity: cloudsShown ? 1 : 0,
                }}
              >
                <img
                  src={puff.src}
                  className={classNames("w-full", {
                    "animate-float": showAnimations,
                  })}
                  style={{ animationDelay: `${Math.round(puff.floatDelay)}ms` }}
                />
              </div>
            ))}
          </div>,
          document.body,
        )}

      <Modal show={isDailyReset} backdrop={false}>
        <Panel bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}>
          {isDailyResetting ? (
            <div className="flex flex-col items-center p-2">
              <Label
                type="vibrant"
                icon={SUNNYSIDE.icons.stopwatch}
                className="mb-2"
              >
                {t("dailyReset.title")}
              </Label>
              <p className="text-xs mb-1">
                {`${t(
                  LOADING_MESSAGES[
                    loadingMessageIndex % LOADING_MESSAGES.length
                  ],
                )}${loadingDots}`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col p-1">
                <Label
                  type="vibrant"
                  icon={SUNNYSIDE.icons.stopwatch}
                  className="mb-2"
                >
                  {t("dailyReset.title")}
                </Label>
                <p className="text-xs mb-2">{t("dailyReset.greeting")}</p>
                <p className="text-xs mb-2">{t("dailyReset.activities")}</p>
                <NoticeboardItems items={items} />
              </div>
              <Button onClick={handleContinue}>{t("continue")}</Button>
            </>
          )}
        </Panel>
      </Modal>
    </>
  );
};
