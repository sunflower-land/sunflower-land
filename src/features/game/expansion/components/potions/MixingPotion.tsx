import React, { useContext, useEffect } from "react";

import Spritesheet from "components/animation/SpriteAnimator";

import potionMasterIdleSheet from "assets/npcs/potion_master_sheet_idle.png";
import potionMasterStartMixingSheet from "assets/npcs/potion_master_sheet_start_mixing.png";
import potionMasterLoopMixingSheet from "assets/npcs/potion_master_sheet_loop_mixing.png";
import potionMasterBombSheet from "assets/npcs/potion_master_sheet_bomb.png";
import potionMasterSuccessSheet from "assets/npcs/potion_master_sheet_success.png";
import { SpringValue } from "react-spring";
import { PotionHouseMachineInterpreter } from "./lib/potionHouseMachine";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { calculateScore } from "features/game/events/landExpansion/mixPotion";
import { SpeechBubble } from "./SpeechBubble";
import { MachineState } from "features/game/lib/gameMachine";

export type DesiredAnimation =
  | "idle"
  | "startMixing"
  | "loopMixing"
  | "success"
  | "bomb";
type AnimationSettings = {
  autoplay: boolean;
  endAt: number;
  sheet: string;
  loop: boolean;
};

const SETTINGS: Record<DesiredAnimation, AnimationSettings> = {
  idle: { autoplay: true, endAt: 8, sheet: potionMasterIdleSheet, loop: true },
  startMixing: {
    autoplay: true,
    endAt: 9,
    sheet: potionMasterStartMixingSheet,
    loop: false,
  },
  loopMixing: {
    autoplay: true,
    endAt: 25,
    sheet: potionMasterLoopMixingSheet,
    loop: true,
  },
  success: {
    autoplay: true,
    endAt: 31,
    sheet: potionMasterSuccessSheet,
    loop: false,
  },
  bomb: {
    autoplay: true,
    endAt: 36,
    sheet: potionMasterBombSheet,
    loop: false,
  },
};

const getFPS = (animation: DesiredAnimation, frameNumber: number): number => {
  switch (animation) {
    case "idle":
      return Math.round(1000 / 240);
    case "startMixing":
      return Math.round(1000 / 90);
    case "loopMixing":
      return Math.round(1000 / 70);
    case "bomb":
      if (frameNumber < 10) return Math.round(1000 / 120);
      if (frameNumber === 11) return Math.round(1000 / 1000);
      return Math.round(1000 / 90);
    case "success":
      if (frameNumber < 11) return Math.round(1000 / 120);
      if (frameNumber === 11) return Math.round(1000 / 100);
      if (frameNumber === 12) return Math.round(1000 / 120);
      if (frameNumber < 15) return Math.round(1000 / 1000);
      if (frameNumber < 26) return Math.round(1000 / 120);
      return Math.round(1000 / 90);
  }
};

const _potionHouseLastAttempt = (state: MachineState) => {
  const potionHouse = state.context.state.potionHouse;
  const previousAttempts = potionHouse?.game.attempts ?? [];
  return previousAttempts[previousAttempts.length - 1] ?? [];
};

export const MixingPotion: React.FC<{
  potionHouseService: PotionHouseMachineInterpreter;
  feedbackText: string | null;
}> = ({ potionHouseService, feedbackText }) => {
  // Hack for spritesheet to display correctly
  // const [loaded, setLoaded] = useState(false);

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

  const lastAttempt = useSelector(gameService, _potionHouseLastAttempt);
  const isGuessing = lastAttempt.some((potion) => potion.status === "pending");

  useEffect(() => {
    const score = isGuessing ? null : calculateScore(lastAttempt);

    if (score === null) return;

    if (score > 0) {
      potionHouseService.send({ type: "SUCCESS" });
    } else {
      potionHouseService.send({ type: "BOMB" });
    }
  }, [isGuessing, lastAttempt, potionHouseService]);

  const handleNextAnimation = () => {
    const isGuessing = lastAttempt.some(
      (potion) => potion.status === "pending",
    );
    const score = isGuessing ? null : calculateScore(lastAttempt);

    potionHouseService.send({ type: "NEXT_ANIMATION", score });
  };

  return (
    <div className="flex flex-col items-center justify-evenly relative w-full h-full">
      <div className="min-h-[120px] sm:min-h-[80px] flex flex-col items-center">
        {feedbackText && <SpeechBubble text={feedbackText} className="w-4/5" />}
      </div>
      {currentAnimation === "idle" && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
          image={settings.sheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={0}
          steps={settings.endAt}
          fps={getFPS(currentAnimation, 0)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(currentAnimation, frame);
            if (frameFps !== spritesheet.getInfo("fps")) {
              spritesheet.setFps(frameFps);
            }
          }}
          onPause={handleNextAnimation}
          onLoopComplete={handleNextAnimation}
        />
      )}
      {currentAnimation === "startMixing" && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
          image={settings.sheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={0}
          steps={settings.endAt}
          fps={getFPS(currentAnimation, 0)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(currentAnimation, frame);
            if (frameFps !== spritesheet.getInfo("fps")) {
              spritesheet.setFps(frameFps);
            }
          }}
          onPause={handleNextAnimation}
          onLoopComplete={handleNextAnimation}
        />
      )}
      {currentAnimation === "loopMixing" && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
          image={settings.sheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={0}
          steps={settings.endAt}
          fps={getFPS(currentAnimation, 0)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(currentAnimation, frame);
            if (frameFps !== spritesheet.getInfo("fps")) {
              spritesheet.setFps(frameFps);
            }
          }}
          onPause={handleNextAnimation}
          onLoopComplete={handleNextAnimation}
        />
      )}
      {currentAnimation === "bomb" && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
          image={settings.sheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={0}
          steps={settings.endAt}
          fps={getFPS(currentAnimation, 0)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(currentAnimation, frame);
            if (frameFps !== spritesheet.getInfo("fps")) {
              spritesheet.setFps(frameFps);
            }
          }}
          onPause={handleNextAnimation}
          onLoopComplete={handleNextAnimation}
        />
      )}
      {currentAnimation === "success" && (
        <Spritesheet
          key={currentAnimation}
          className="w-full h-full"
          style={{ imageRendering: "pixelated" }}
          image={settings.sheet}
          widthFrame={100}
          heightFrame={100}
          zoomScale={new SpringValue(1)}
          startAt={0}
          steps={settings.endAt}
          fps={getFPS(currentAnimation, 0)}
          direction={`forward`}
          autoplay={settings.autoplay}
          loop={settings.loop}
          onEachFrame={(spritesheet) => {
            const frame = spritesheet.getInfo("frame");
            const frameFps = getFPS(currentAnimation, frame);
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
