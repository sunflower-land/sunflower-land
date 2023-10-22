import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

// import reelButton from "assets/ui/reel.png";
import fishingBar from "assets/ui/fishing_bar_horizontal.png";
import tentacle from "assets/ui/tentacle.png";

import React, { useState, useEffect, useRef } from "react";
import { easings } from "@react-spring/web";
import { useSpring, animated } from "react-spring";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { beachEvents } from "features/world/scenes/BeachScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishingBait } from "features/game/types/fishing";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { LifeguardNPC } from "./LifeguardNPC";

function calculateTentaclePosition(degree, radius) {
  const radians = (degree * Math.PI) / 180;
  const x = radius * Math.cos(radians);
  const y = radius * Math.sin(radians);
  return { x, y };
}

export const FishingBar: React.FC = () => {
  const [bait, setBait] = useState<FishingBait>("Earthworm");

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
  const [attempts, setAttempts] = useState<("pending" | "hit" | "miss")[]>([
    "pending",
    "pending",
    "pending",
    "pending",
  ]);

  const [direction, setDirection] = useState<"clockwise" | "anticlockwise">(
    "clockwise"
  );

  const position = calculateTentaclePosition(30, 85);
  // // Create a spring animation for the tentacle
  // const tentacleSpring = useSpring({
  //   from: { translateY: 0 },
  //   to: async (next) => {
  //     while (true) {
  //       await next({
  //         translateY: barRef.current?.height,
  //         config: {
  //           duration: 1000,
  //           easing: easings.easeInExpo,
  //         },
  //       });

  //       await next({
  //         translateY: 0,
  //         config: {
  //           duration: 1000,
  //         },
  //       });
  //     }
  //   },
  //   config: {
  //     duration: animationProps.speed,
  //     // easing: animationProps.easing,
  //   },
  // });

  // // Update the difficulty level when currentDifficulty changes
  // useEffect(() => {
  //   setAnimationProps(difficulties[currentDifficulty]);
  // }, [currentDifficulty]);

  const barHeight = BAIT_SIZE[bait];

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
    setDirection((prev) =>
      prev === "clockwise" ? "anticlockwise" : "clockwise"
    );
    // const y = calculateTentaclePositionPercentage();
    // setLastReelY(y);

    // const distanceFromCenter = Math.abs(50 - y);

    // const hit = distanceFromCenter < barHeight / 2;
    // console.log({ height: y, hit });

    const hit = true;
    setAttempts((prev) => {
      const attempt = prev.findIndex((a) => a === "pending");

      prev[attempt] = hit ? "hit" : "miss";

      return prev;
    });

    beachEvents.publish("reel");
  };

  const [state, setState] = useState<"idle" | "playing">("idle");
  const circumference = 565.48668;
  const barSize = circumference * (barHeight / 100);

  const ringRotation = useSpring({
    from: { transform: "rotate(0deg)" }, // Start with 0-degree rotation
    to: { transform: "rotate(360deg)" }, // Rotate to 360 degrees (full circle)
    config: { duration: 4000 }, // Duration of the animation in milliseconds
    reset: true, // Reset the animation when it's done
    loop: true, // Loop the animation infinitely
  });

  const ringSpring = useSpring({
    from: { rotate: 0 },
    to: async (next) => {
      let degrees = 360;
      while (true) {
        await next({ rotate: degrees });
        degrees += 360;
      }
    },
    config: { duration: 4000 }, // Duration of the animation in milliseconds
  });

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap mx-auto">
        {getKeys(BAIT_SIZE).map((name) => (
          <Box
            count={new Decimal(1)}
            key={name}
            image={ITEM_DETAILS[name].image}
            isSelected={name === bait}
            onClick={() => setBait(name)}
          />
        ))}
        <Box
          count={new Decimal(1)}
          image={SUNNYSIDE.icons.expression_confused}
        />
      </div>

      {/* Bar */}
      <div
        className="mx-auto my-2 relative"
        style={{
          width: "200px",
          height: "200px",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            border: "20px solid #193c3e",
            borderRadius: "50%",
            outline: "3px solid #fff",
            boxSizing: "border-box", // Include the border in the element's dimensions
            boxShadow: "inset 0 0 0 3px #fff", // Create an inset box shadow
          }}
        />

        <animated.svg
          className="absolute inset-0"
          width="200"
          height="200"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            animationPlayState: "paused", // Pause the animation,.
            // transform: ringSpring.rotate.to((r) => `rotate(${r}deg)`),
            transform: ringSpring.rotate.interpolate(
              (rotate) => `rotate(${rotate}deg)`
            ),
          }}
        >
          <animated.circle
            cx="100"
            cy="100"
            r="90"
            fill="transparent"
            stroke="#63c74d"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${barSize} ${circumference}`}
          ></animated.circle>
        </animated.svg>
        <img
          style={{
            position: "absolute",
            top: `calc(50% - ${position.y}px)`, // Adjust this based on your ring size
            left: `calc(50% + ${position.x}px)`, // Adjust this based on your ring size
            width: "20px", // Adjust the tentacle size
            transformOrigin: "50% 0", // Rotate from the top-center point
          }}
          src={tentacle}
        />

        {/* <div className="absolute inset-0 w-full h-full flex items-center justify-center z-50 bg-blue-300">
          <LifeguardNPC />
        </div> */}

        <div
          className="flex absolute items-center"
          style={{
            bottom: "35px",
            left: "55px",
          }}
        >
          {attempts?.map((attempt, index) => {
            let icon = SUNNYSIDE.ui.dot;

            if (attempt === "hit") {
              icon = SUNNYSIDE.icons.confirm;
            } else if (attempt === "miss") {
              icon = SUNNYSIDE.icons.cancel;
            }

            return <img key={index} src={icon} className="w-4 mr-1" />;
          })}
        </div>
      </div>
      {state === "idle" && (
        <Button onClick={() => setState("playing")}>Cast</Button>
      )}

      {state === "playing" && <Button onClick={reel}>Reel</Button>}

      {/* <div
        style={{
          height: `${PIXEL_SCALE * 100}px`,
          width: `${PIXEL_SCALE * 14}px`,
        }}
        className="relative mx-auto"
      >
        <img
          src={fishingBar}
          className="z-20 w-full absolute"
          ref={(r) => (barRef.current = r as HTMLImageElement)}
          style={{
            height: `${PIXEL_SCALE * 100}px`,
            // background: "#193c3e",
          }}
        />

        <div
          className="absolute z-0"
          style={{
            height: `${barHeight}%`,
            top: `${50 - barHeight / 2}%`,
            width: `${PIXEL_SCALE * 4}px`,
            left: `calc(50% - ${PIXEL_SCALE * 8}px)`,
            background: "#63c74d",
          }}
        />

        <div
          className="absolute z-30"
          style={{
            height: `2px`,
            width: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 0}px`,
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
            left: `${PIXEL_SCALE * -1}px`,
            top: `${PIXEL_SCALE * -8}px`,

            transform: tentacleSpring.translateY.to(
              (y) => `translateY(${y}px)`
            ),
          }}
        />
      </div> */}
      {/* UI */}
    </div>
  );
};

// The better the bait, the larger the 'catch' zone
const BAIT_SIZE: Record<FishingBait, number> = {
  Earthworm: 5,
  Grub: 10,
  "Red Wiggler": 15,
};

export const KrakenMechanic: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={() => {}}
      tabs={[
        { icon: SUNNYSIDE.icons.fish, name: "Kraken" },
        {
          icon: SUNNYSIDE.tools.fishing_rod,
          name: "Guide",
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      <FishingBar />
    </CloseButtonPanel>
  );
};
