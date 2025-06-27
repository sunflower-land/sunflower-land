/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import fullMoon from "assets/icons/full_moon.png";

import { ZoomContext } from "components/ZoomProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { CONFIG } from "lib/config";
import { FishCaught } from "./FishCaught";
import { FishingChallenge } from "./FishingChallenge";
import { Panel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { FISH, FISH_DIFFICULTY, FishName } from "features/game/types/fishing";
import { MachineState } from "features/game/lib/gameMachine";
import { gameAnalytics } from "lib/gameAnalytics";
import { getBumpkinLevel } from "features/game/lib/level";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import classNames from "classnames";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";

type SpriteFrames = { startAt: number; endAt: number };

const FISHING_FRAMES: Record<FishingState, SpriteFrames> = {
  idle: {
    startAt: 1,
    endAt: 9,
  },
  casting: {
    startAt: 10,
    endAt: 24,
  },
  waiting: {
    startAt: 25,
    endAt: 33,
  },
  reeling: {
    startAt: 34,
    endAt: 46,
  },
  ready: {
    startAt: 34,
    endAt: 46,
  },
  caught: {
    startAt: 47,
    endAt: 56,
  },
};

type FishingState =
  | "idle"
  | "casting"
  | "ready"
  | "waiting"
  | "reeling"
  | "caught";

interface Props {
  onClick: () => void;
}

const _canFish = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) >= 5;
const _state = (state: MachineState) => state.context.state;

export const FishermanNPC: React.FC<Props> = ({ onClick }) => {
  const { t } = useAppTranslation();
  const spriteRef = useRef<SpriteSheetInstance>();
  const didRefresh = useRef(false);

  const [showReelLabel, setShowReelLabel] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showCaughtModal, setShowCaughtModal] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeDifficulty, setChallengeDifficulty] = useState(1);

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const canFish = useSelector(gameService, _canFish);

  const { fishing, farmActivity } = state;

  // Catches cases where players try reset their fishing challenge
  useEffect(() => {
    didRefresh.current = !!fishing.wharf.caught;
  }, []);

  useEffect(() => {
    if (
      fishing.wharf.caught &&
      (spriteRef.current?.getInfo("frame") ?? 0) <= FISHING_FRAMES.casting.endAt
    ) {
      onWaitFinish();
    }
  }, [fishing.wharf.caught]);

  let initialState: FishingState = "idle";
  if (fishing.wharf.caught || fishing.wharf.castedAt) {
    initialState = "waiting";
  }

  const { scale } = useContext(ZoomContext);

  const onIdleFinish = () => {
    // CAST
    if (fishing.wharf.castedAt && !fishing.wharf.caught) {
      spriteRef.current?.setStartAt(FISHING_FRAMES.casting.startAt);
      spriteRef.current?.setEndAt(FISHING_FRAMES.casting.endAt);
    }
  };

  const onCastFinish = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.waiting.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.waiting.endAt);

    // TESTING
    if (!CONFIG.API_URL) {
      setTimeout(() => {
        fishing.wharf = { castedAt: 10000, caught: { Anchovy: 1 } };
      }, 1000);
    }
  };

  const onWaitFinish = () => {
    if (fishing.wharf.caught) {
      spriteRef.current?.setStartAt(FISHING_FRAMES.reeling.startAt);
      spriteRef.current?.setEndAt(FISHING_FRAMES.reeling.endAt);
      setShowReelLabel(true);
    }
  };

  const onCaughtFinish = () => {
    setShowCaughtModal(true);

    spriteRef.current?.setStartAt(FISHING_FRAMES.idle.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.idle.endAt);
  };

  const fish = getKeys(fishing.wharf.caught ?? {}).find((fish) => fish in FISH);

  const reelIn = () => {
    const fishDifficulty = FISH_DIFFICULTY[fish as FishName];

    // TEMP: The reelin state is sometimes not showing automatically and players need to refresh
    // Right no they are losing resources, so comment this
    // Remove comments in future so players don't refresh minigame
    // if (fishDifficulty && didRefresh.current) {
    //   // Player refreshed during challenge
    //   // onChallengeLost();
    // } else

    if (fishDifficulty) {
      // Show fishing challenge
      setChallengeDifficulty(fishDifficulty);
      setShowChallenge(true);
    } else {
      // Instantly reel in
      spriteRef.current?.setStartAt(FISHING_FRAMES.caught.startAt);
      spriteRef.current?.setEndAt(FISHING_FRAMES.caught.endAt);
    }

    setShowReelLabel(false);
    didRefresh.current = false;
  };

  const onChallengeWon = () => {
    setShowChallenge(false);
    spriteRef.current?.setStartAt(FISHING_FRAMES.caught.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.caught.endAt);
  };

  const onChallengeLost = () => {
    setShowChallenge(false);
    spriteRef.current?.setStartAt(FISHING_FRAMES.caught.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.caught.endAt);

    gameService.send("fish.missed");
    gameService.send("SAVE");
  };

  const claim = () => {
    if (fishing.wharf.caught) {
      const state = gameService.send("rod.reeled");

      const totalFishCaught = getKeys(FISH).reduce(
        (total, name) =>
          total + (state.context.state.farmActivity[`${name} Caught`] ?? 0),
        0,
      );

      if (totalFishCaught === 1) {
        gameAnalytics.trackMilestone({
          event: "Tutorial:Fishing:Completed",
        });
      }
    }
  };

  const close = () => {
    setShowCaughtModal(false);
  };

  const handleClick = () => {
    if (!canFish) {
      setShowLockedModal(true);
      return;
    }

    if (showReelLabel) {
      reelIn();
      return;
    }

    if (fishing.wharf.castedAt) {
      return;
    }

    onClick();
  };

  return (
    <>
      <div
        className={classNames("absolute w-full h-full", {
          "cursor-pointer hover:img-highlight": !fishing.wharf.castedAt,
        })}
        onClick={handleClick}
      >
        {!canFish && (
          <>
            <img
              className="absolute pointer-events-none z-50"
              src={SUNNYSIDE.icons.fish_icon}
              style={{
                width: `${PIXEL_SCALE * 18}px`,
                right: `${PIXEL_SCALE * 1}px`,
                top: `${PIXEL_SCALE * 9}px`,
              }}
            />

            <img
              className="absolute pointer-events-none z-50"
              src={SUNNYSIDE.icons.lock}
              style={{
                width: `${PIXEL_SCALE * 12}px`,
                right: `${PIXEL_SCALE * 10}px`,
                top: `${PIXEL_SCALE * 7}px`,
              }}
            />
          </>
        )}

        {!showReelLabel && canFish && (
          <>
            {isFishFrenzy(state) && (
              <img
                src={lightning}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  left: `${PIXEL_SCALE * 5}px`,
                  top: `${PIXEL_SCALE * -19}px`,

                  imageRendering: "pixelated",
                }}
                className="absolute pointer-events-none"
              />
            )}
            {isFullMoon(state) && (
              <img
                src={fullMoon}
                style={{
                  width: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 3}px`,
                  top: `${PIXEL_SCALE * -19}px`,

                  imageRendering: "pixelated",
                }}
                className="absolute pointer-events-none"
              />
            )}
          </>
        )}

        {showReelLabel && (
          <React.Fragment>
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              style={{
                width: `${PIXEL_SCALE * 4}px`,
                left: `${PIXEL_SCALE * 7}px`,
                top: `${PIXEL_SCALE * -15}px`,

                imageRendering: "pixelated",
              }}
              className="absolute"
            />
            <img
              src={SUNNYSIDE.ui.reel}
              style={{
                width: `${PIXEL_SCALE * 39}px`,
                left: `${PIXEL_SCALE * 16}px`,
                top: `${PIXEL_SCALE * 36}px`,

                imageRendering: "pixelated",
              }}
              className="absolute z-10 cursor-pointer"
            />
          </React.Fragment>
        )}

        {canFish && (
          <Spritesheet
            className="absolute z-50 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 58}px`,
              left: `${PIXEL_SCALE * -10}px`,
              top: `${PIXEL_SCALE * -14}px`,

              imageRendering: "pixelated",
            }}
            getInstance={(spritesheet) => {
              spriteRef.current = spritesheet;
            }}
            image={SUNNYSIDE.npcs.fishing_sheet}
            widthFrame={58}
            heightFrame={50}
            zoomScale={scale}
            fps={14}
            steps={56}
            startAt={FISHING_FRAMES[initialState].startAt}
            endAt={FISHING_FRAMES[initialState].endAt}
            direction={`forward`}
            autoplay
            loop
            onEnterFrame={[
              {
                frame: FISHING_FRAMES.idle.endAt - 1,
                callback: onIdleFinish,
              },
              {
                frame: FISHING_FRAMES.casting.endAt - 1,
                callback: onCastFinish,
              },
              {
                frame: FISHING_FRAMES.waiting.endAt - 1,
                callback: onWaitFinish,
              },
              {
                frame: FISHING_FRAMES.caught.endAt - 1,
                callback: onCaughtFinish,
              },
            ]}
          />
        )}
      </div>

      <Modal show={showLockedModal} onHide={() => setShowLockedModal(false)}>
        <CloseButtonPanel onClose={() => setShowLockedModal(false)}>
          <div className="flex flex-col items-center">
            <Label className="mt-2" icon={SUNNYSIDE.icons.lock} type="danger">
              {t("warning.level.required", { lvl: 5 })}
            </Label>
            <img src={ITEM_DETAILS.Rod.image} className="w-10 mx-auto my-2" />
            <p className="text-sm text-center mb-2">
              {t("statements.visit.firePit")}
            </p>
          </div>
        </CloseButtonPanel>
      </Modal>

      <Modal show={showCaughtModal} onHide={close} onExited={claim}>
        <CloseButtonPanel
          onClose={close}
          bumpkinParts={NPC_WEARABLES["reelin roy"]}
        >
          <FishCaught
            caught={fishing.wharf.caught ?? {}}
            onClaim={close}
            farmActivity={farmActivity}
          />
        </CloseButtonPanel>
      </Modal>

      <Modal show={showChallenge}>
        <Panel>
          <FishingChallenge
            difficulty={challengeDifficulty}
            onCatch={onChallengeWon}
            onMiss={onChallengeLost}
            fishName={fish as FishName}
          />
        </Panel>
      </Modal>
    </>
  );
};
