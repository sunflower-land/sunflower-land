import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import reelButton from "assets/ui/reel.png";
import fishingBar from "assets/ui/fishing_bar_horizontal.png";
import tentacle from "assets/ui/tentacle.png";

import React, { useState, useEffect, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { beachEvents } from "features/world/scenes/BeachScene";
import { SUNNYSIDE } from "assets/sunnyside";

export const FishingBar: React.FC = () => {
  const difficulties = [
    // Difficulty 1
    {
      speed: 2000,
      easing: "linear",
      slowAreas: [],
    },
    // Difficulty 2
    {
      speed: 1800,
      easing: "easeInOutCubic" as any,
      slowAreas: [0.4, 0.6],
    },
    // Add more difficulty levels as needed
  ];

  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const [animationProps, setAnimationProps] = useState(difficulties[0]);
  const [lastReelY, setLastReelY] = useState<number>();
  const barRef = useRef<HTMLImageElement>();
  const tentacleRef = useRef<HTMLImageElement>();
  const [attempts, setAttempts] = useState<boolean[]>();

  // Create a spring animation for the tentacle
  const tentacleSpring = useSpring({
    from: { translateY: 0 },
    to: async (next) => {
      while (true) {
        await next({
          translateY: barRef.current?.height,
          config: {
            duration: 1000,
          },
        });

        await next({
          translateY: 0,
          config: {
            duration: 1000,
          },
        });
      }
    },
    config: {
      duration: animationProps.speed,
      // easing: animationProps.easing,
    },
  });

  // Update the difficulty level when currentDifficulty changes
  useEffect(() => {
    setAnimationProps(difficulties[currentDifficulty]);
  }, [currentDifficulty]);

  const barHeight = 20;

  const calculateTentaclePositionPercentage = () => {
    const tentacleHeight = tentacleRef.current?.getBoundingClientRect().height;
    console.log({ tentacleHeight });
    const tentacleTop = tentacleSpring.translateY.get() + tentacleHeight / 2; // Get the current translateY value
    const barHeight = barRef.current?.getBoundingClientRect().height;

    if (tentacleTop !== undefined && barHeight !== undefined) {
      const percentage = (tentacleTop / barHeight) * 100;
      return percentage;
    }
    return 0; // Return 0 if the elements are not available
  };

  const reel = () => {
    const y = calculateTentaclePositionPercentage();
    setLastReelY(y);

    const distanceFromCenter = Math.abs(50 - y);

    const hit = distanceFromCenter < barHeight / 2;
    console.log({ height: y, hit });

    setAttempts((prev) => [...(prev ?? []), hit]);

    beachEvents.publish("reel");
  };

  return (
    <>
      <div
        style={{
          height: `${PIXEL_SCALE * 100}px`,
        }}
        className="relative flex flex-col items-center"
      >
        <img
          src={fishingBar}
          className="z-10"
          ref={(r) => (barRef.current = r as HTMLImageElement)}
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            height: `${PIXEL_SCALE * 100}px`,
            // background: "#193c3e",
          }}
        />

        <div
          className="absolute"
          style={{
            height: `${barHeight}%`,
            top: `${50 - barHeight / 2}%`,
            width: `${PIXEL_SCALE * 4}px`,
            left: `calc(50% - ${PIXEL_SCALE * 6}px)`,
            background: "#63c74d",
          }}
        />

        <div
          className="absolute"
          style={{
            height: `2px`,
            width: `${PIXEL_SCALE * 4}px`,
            top: `${lastReelY}%`,
            background: "red",
          }}
        />

        <animated.img
          src={tentacle}
          className="absolute z-20"
          ref={(r) => (tentacleRef.current = r as HTMLImageElement)}
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            left: `${PIXEL_SCALE * 14}px`,
            top: `${PIXEL_SCALE * -8}px`,

            transform: tentacleSpring.translateY.to(
              (y) => `translateY(${y}px)`
            ),
          }}
        />
      </div>
      <img src={reelButton} onClick={reel} className="w-32 cursor-pointer" />
      <div className="flex h-8">
        {attempts?.map((attempt, index) => (
          <img
            key={index}
            src={attempt ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.cancel}
            className="h-6 mr-1"
          />
        ))}
      </div>
    </>
  );
};

export const KrakenMechanic: React.FC = () => {
  return (
    <Panel
      className="absolute flex flex-col justify-center items-center"
      style={{
        bottom: `${PIXEL_SCALE * 20}px`,
        right: `${PIXEL_SCALE * 20}px`,
      }}
    >
      <FishingBar />
    </Panel>
  );
};
