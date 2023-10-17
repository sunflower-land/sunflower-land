import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import reelButton from "assets/ui/reel.png";
import fishingBar from "assets/ui/fishing_bar.png";
import tentacle from "assets/ui/tentacle.png";

import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";

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

  // Create a spring animation for the tentacle
  const tentacleSpring = useSpring({
    from: { translateX: 0 },
    to: async (next) => {
      while (true) {
        console.log("Enter while");
        await next({
          translateX: 100,
          config: {
            duration: 1000,
          },
        });
        console.log("Enter next while");
        await next({
          translateX: 0,
          config: {
            duration: 1000,
          },
        });
      }
    },
    config: {
      duration: animationProps.speed,
      // easing: animationProps.easing
    },
  });

  console.log({ rerender: tentacleSpring.translateX });
  // Update the difficulty level when currentDifficulty changes
  useEffect(() => {
    setAnimationProps(difficulties[currentDifficulty]);
  }, [currentDifficulty]);

  return (
    <div className="relative">
      <div className="w-full h-8 relative">
        <img src={fishingBar} className="w-full h-full" />
        <animated.img
          src={tentacle}
          className="w-8"
          style={{
            transform: tentacleSpring.translateX.to((x) => `translateX(${x}%)`),
          }}
        />
      </div>
      <div>
        {/* Add buttons or UI elements to switch between difficulty levels */}
        {difficulties.map((difficulty, index) => (
          <button key={index} onClick={() => setCurrentDifficulty(index)}>
            Difficulty {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export const KrakenMechanic: React.FC = () => {
  return (
    <Modal show centered>
      <Panel>
        <FishingBar />
        <img src={reelButton} className="w-32 cursor-pointer" />
      </Panel>
    </Modal>
  );
};
