import React, { useContext, useEffect, useState } from "react";

import Spritesheet from "components/animation/SpriteAnimator";

import potionMasterSheet from "assets/npcs/potion_master_sheet.png";
import { SpringValue } from "react-spring";
import { PotionHouseMachineInterpreter } from "./lib/potionHouseMachine";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { calculateScore } from "features/game/events/landExpansion/mixPotion";
import { SpeechBubble } from "./SpeechBubble";

export type DesiredAnimation =
  | "idle"
  | "startMixing"
  | "loopMixing"
  | "success"
  | "bomb";
type AnimationSettings = {
  autoplay: boolean;
  startAt: number;
  endAt: number;
  loop: boolean;
};

const SETTINGS: Record<DesiredAnimation, AnimationSettings> = {
  idle: {
    autoplay: true,
    startAt: 0,
    endAt: 8,
    loop: true,
  },
  startMixing: {
    autoplay: true,
    startAt: 9,
    endAt: 18,
    loop: false,
  },
  loopMixing: {
    autoplay: true,
    startAt: 19,
    endAt: 44,
    loop: true,
  },
  success: {
    autoplay: true,
    startAt: 82,
    endAt: 113,
    loop: false,
  },
  bomb: {
    autoplay: true,
    startAt: 45,
    endAt: 81,
    loop: false,
  },
};

const getFPS = (frameNumber: number): number => {
  if (frameNumber < 9) return Math.round(1000 / 240);
  if (frameNumber < 19) return Math.round(1000 / 90);
  if (frameNumber < 45) return Math.round(1000 / 70);
  if (frameNumber < 55) return Math.round(1000 / 120);
  if (frameNumber < 56) return Math.round(1000 / 1000);
  if (frameNumber < 82) return Math.round(1000 / 90);
  if (frameNumber < 93) return Math.round(1000 / 120);
  if (frameNumber < 94) return Math.round(1000 / 100);
  if (frameNumber < 95) return Math.round(1000 / 120);
  if (frameNumber < 97) return Math.round(1000 / 1000);
  if (frameNumber < 108) return Math.round(1000 / 120);

  return Math.round(1000 / 90);
};

export const MixingPotion: React.FC<{
  potionHouseService: PotionHouseMachineInterpreter;
  feedbackText: string | null;
}> = ({ potionHouseService, feedbackText }) => {
  // Hack for spritesheet to display correctly
  const [loaded, setLoaded] = useState(false);

  const { gameService } = useContext(Context);
  const [potionState] = useActor(potionHouseService);

  const getCurrentAnimation = (): DesiredAnimation => {
    if (potionState.matches("playing.idle")) return "idle";
    if (potionState.matches("playing.startMixing")) return "startMixing";
    if (potionState.matches("playing.loopMixing")) return "loopMixing";
    if (potionState.matches("playing.success")) return "success";
    if (potionState.matches("playing.bomb")) return "bomb";

    return "idle";
  };

  const currentAnimation = getCurrentAnimation();
  const settings = SETTINGS[currentAnimation];

  const potionHouse = gameService.state.context.state.potionHouse;
  const previousAttempts = potionHouse?.game.attempts ?? [];
  const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];

  const isGuessing = lastAttempt.some((potion) => potion.status === "pending");

  useEffect(() => {
    const score = isGuessing ? null : calculateScore(lastAttempt);

    if (score === null) return;

    if (score > 0) {
      potionHouseService.send("SUCCESS");
    } else {
      potionHouseService.send("BOMB");
    }
  }, [isGuessing]);

  const handleNextAnimation = () => {
    const potionHouse = gameService.state.context.state.potionHouse;
    const previousAttempts = potionHouse?.game.attempts ?? [];
    const lastAttempt = previousAttempts[previousAttempts.length - 1] ?? [];

    const isGuessing = lastAttempt.some(
      (potion) => potion.status === "pending"
    );
    const score = isGuessing ? null : calculateScore(lastAttempt);

    potionHouseService.send("NEXT_ANIMATION", { score });
  };

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-evenly relative w-full h-full">
      <div className="min-h-[120px] sm:min-h-[80px] flex flex-col items-center">
        {feedbackText && <SpeechBubble text={feedbackText} className="w-4/5" />}
      </div>
      {loaded && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{
            imageRendering: "pixelated",
          }}
          image={potionMasterSheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={settings.startAt}
          endAt={settings.endAt}
          steps={113}
          fps={getFPS(settings.startAt)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(frame);
            if (frameFps !== spritesheet.getInfo("fps")) {
              spritesheet.setFps(frameFps);
            }
          }}
          onPause={handleNextAnimation}
          onLoopComplete={handleNextAnimation}
        />
      )}
    </div>
  );
};
