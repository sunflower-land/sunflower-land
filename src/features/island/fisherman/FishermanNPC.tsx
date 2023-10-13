import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import reel from "assets/ui/reel.png";

import { ZoomContext } from "components/ZoomProvider";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";

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

export const FishermanNPC: React.FC<Props> = ({ onClick }) => {
  const spriteRef = useRef<SpriteSheetInstance>();

  const [showReelLabel, setShowReelLabel] = useState(false);
  const [showCaughtModal, setShowCaughtModal] = useState(false);

  const { gameService } = useContext(Context);
  // TODO selectors
  const [
    {
      context: {
        state: { fishing },
      },
    },
  ] = useActor(gameService);

  let initialState: FishingState = "idle";
  if (fishing.wharf.caught) {
    initialState = "caught";
  } else if (fishing.wharf.castedAt) {
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
        fishing.wharf = { castedAt: 10000, caught: { Gold: 2 } };
      }, 1000);
    }
  };

  const onWaitFinish = () => {
    if (fishing.wharf.caught) {
      console.log("SET THE REEEEEEL");
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

  const reelIn = () => {
    spriteRef.current?.setStartAt(FISHING_FRAMES.caught.startAt);
    spriteRef.current?.setEndAt(FISHING_FRAMES.caught.endAt);
    setShowReelLabel(false);
  };

  const claim = () => {
    gameService.send("rod.reeled");
    setShowCaughtModal(false);
  };

  console.log("Re-render");

  return (
    <>
      <Modal centered show={showCaughtModal} onHide={claim}>
        <CloseButtonPanel
          onClose={claim}
          bumpkinParts={NPC_WEARABLES["reelin roy"]}
        >
          <p>Congrats</p>
          {getKeys(fishing.wharf.caught ?? {}).map((name) => (
            <div className="flex" key={name}>
              <img src={ITEM_DETAILS[name]?.image} className="h-6" />
              <span className="text-sm">{name}</span>
            </div>
          ))}
          <Button onClick={claim}>Ok</Button>
        </CloseButtonPanel>
      </Modal>

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
            src={reel}
            onClick={reelIn}
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
      <Spritesheet
        className={classNames("absolute  z-50", {
          "hover:img-highlight cursor-pointer": !fishing.wharf.castedAt,
        })}
        style={{
          width: `${PIXEL_SCALE * 58}px`,
          left: `${PIXEL_SCALE * -10}px`,
          top: `${PIXEL_SCALE * -14}px`,

          imageRendering: "pixelated",
        }}
        onClick={() => {
          if (fishing.wharf.castedAt) {
            return;
          }
          onClick();
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
    </>
  );
};
