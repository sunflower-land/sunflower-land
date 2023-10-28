import kraken from "assets/ui/kraken.png";
import ringDot from "assets/icons/fish_dot.png";

import React, { useRef, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishingBait } from "features/game/types/fishing";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { Panel } from "components/ui/Panel";
import { useSpring, animated } from "react-spring";
import { SensitiveButton } from "components/ui/SensitiveButton";

// Function to generate a random angle at least 150 degrees away from a given angle
function getRandomAngle(minDistance: number, existingAngle: number) {
  let randomAngle;

  do {
    randomAngle = Math.random() * 360; // Generate a random angle between 0 and 360
  } while (Math.abs(randomAngle - existingAngle) < minDistance);

  return randomAngle;
}

function getRotationAngle(element: HTMLElement): number | undefined {
  const st = window.getComputedStyle(element, null);
  const transform =
    st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "FAIL";

  if (transform === "FAIL") {
    return undefined;
  }

  const values = transform.split("(")[1].split(")")[0].split(",");
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);

  const scale = Math.sqrt(a * a + b * b);

  const sin = b / scale;
  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  return angle;
}

const extractAngle = (transformString: string) => {
  const match = transformString.match(/[-+]?\d*\.\d+|\d+/);
  if (match && match[0]) {
    return parseFloat(match[0]);
  }
  return 0; // Default value if the match fails
};

// Converts 354 -> 6
const normaliseAngle = (angle: number) => {
  return ((angle % 360) + 360) % 360;
};

type Attempt = "hit" | "miss";

function getSpeed(attempts: number) {
  if (attempts > 10) {
    return 1500;
  }

  if (attempts > 7) {
    return 2000;
  }

  if (attempts > 3) {
    return 2500;
  }

  return 3000;
}
export const FishingBar: React.FC = () => {
  const [state, setState] = useState<"idle" | "playing" | "caught" | "escaped">(
    "idle"
  );

  const [tentacleAngle, setTentacleAngle] = useState(getRandomAngle(150, 0));
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const direction = useRef<"clockwise" | "anticlockwise">("clockwise");
  const [castFrom, setCastFrom] = useState(0);
  const [castTo, setCastTo] = useState(360);

  const changeDirection = (fromDegrees: number) => {
    const to =
      direction.current === "clockwise" ? fromDegrees - 360 : fromDegrees + 360;
    setCastTo(to);
    setCastFrom(fromDegrees);
    direction.current =
      direction.current === "anticlockwise" ? "clockwise" : "anticlockwise";
  };

  const greenBarProps = useSpring({
    from: { transform: `rotate(${castFrom}deg)` },
    to: { transform: `rotate(${castTo}deg)` },
    onRest: () => changeDirection(castTo),
    config: {
      duration: getSpeed(attempts.length),
    },
    pause: state === "idle",
  });

  const misses = attempts.filter((a) => a === "miss").length;
  const hits = attempts.filter((a) => a === "hit").length;

  const tentacleProps = useSpring({
    from: { transform: `rotate(${tentacleAngle}deg)` },
    to: { transform: `rotate(${tentacleAngle}deg)` },
    config: {
      duration: 3000,
    },
    pause: true,
  });

  const barHeight = 10;

  const reel = () => {
    const greenBarAngle = extractAngle(greenBarProps.transform.get());
    const tentacleAngle = extractAngle(tentacleProps.transform.get());

    const degreeDifference = Math.abs(
      normaliseAngle(greenBarAngle) - normaliseAngle(tentacleAngle)
    );

    console.log({ greenBarAngle, tentacleAngle, degreeDifference, barHeight });

    const fishBuffer = 5;
    const hit = degreeDifference < barHeight + fishBuffer;

    setAttempts((prev) => [...prev, hit ? "hit" : "miss"]);

    if (!hit) {
      if (misses === 2) {
        setState("escaped");
      }
    } else {
      if (hits === 9) {
        setState("caught");
      }
    }

    setTentacleAngle((prev) => getRandomAngle(150, prev));

    changeDirection(greenBarAngle);
  };

  if (state === "caught") {
    return <p>Caught</p>;
  }

  if (state === "escaped") {
    return <p>Escaped</p>;
  }

  let castIndicatorColour = "#ffffff";
  if (attempts.length > 0 && attempts[attempts.length - 1] === "hit") {
    castIndicatorColour = "#63c74d";
  } else if (attempts.length > 0 && attempts[attempts.length - 1] === "miss") {
    castIndicatorColour = "#f6757a";
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full justify-center">
        <ResizableBar
          percentage={100 - (hits / 10) * 100}
          type={"error"}
          outerDimensions={{
            width: 50,
            height: 8,
          }}
        />
      </div>
      {/* Bar */}
      <div
        className="mx-auto my-2 relative pointer-events-none"
        id="fishing-ring"
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
          width="200"
          height="200"
          viewBox="0 0 200 200"
          id="fishing-bar"
          className="absolute inset-0 "
          style={greenBarProps}
          // style={{
          //   animation:
          //     state === "playing" ? `spin ${speed}s linear infinite` : "none",
          // }}
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#193c3e"
            strokeWidth="12"
          />
          <circle
            strokeDasharray={`${barHeight} ${100 - barHeight}`}
            strokeDashoffset={25 + barHeight / 2}
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#63c74d"
            strokeWidth="12"
            pathLength="100"
          />
        </animated.svg>

        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="absolute inset-0 "
          style={{
            transform: `rotate(${castFrom}deg)`,
          }}
        >
          <circle
            strokeDasharray={`${0.5} ${100 - 0.5}`}
            strokeDashoffset={25 + 0.5 / 2}
            cx="100"
            cy="100"
            r="95"
            fill="none"
            stroke={castIndicatorColour}
            strokeWidth="12"
            pathLength="100"
            strokeOpacity={castIndicatorColour === "#ffffff" ? 0.6 : 1}
          />
        </svg>

        <animated.div
          id="tentacle"
          style={{
            position: "absolute",
            width: "20px",
            height: "100px",
            top: "0px",
            left: "90px",
            transformOrigin: "bottom center",
            // transform: `rotate(${tentacleAngle}deg)`,
            ...tentacleProps,
          }}
        >
          <img
            src={ringDot}
            style={{
              position: "absolute",
              width: "24px",
              top: "1px",
              left: "2px",
              rotate: "137deg",
            }}
          />
        </animated.div>

        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50">
          <img src={kraken} width="80px" />

          <div className="flex justify-center items-center space-x-1 mt-1">
            {new Array(3).fill(null)?.map((_, index) => {
              return (
                <img
                  src={
                    misses > index ? SUNNYSIDE.icons.cancel : SUNNYSIDE.ui.dot
                  }
                  key={index}
                  className="w-3"
                />
              );
            })}
          </div>
        </div>
      </div>
      {state === "idle" && (
        <Button onClick={() => setState("playing")}>Cast</Button>
      )}

      {state === "playing" && (
        <SensitiveButton onClick={reel}>Reel</SensitiveButton>
      )}
    </div>
  );
};

// The better the bait, the larger the 'catch' zone
const BAIT_SIZE: Record<FishingBait, number> = {
  Earthworm: 10,
  Grub: 13,
  "Red Wiggler": 16,
};

interface Props {
  onClose: () => void;
}
export const KrakenMechanic: React.FC<Props> = ({ onClose }) => {
  return (
    <Panel>
      <FishingBar />
    </Panel>
  );
};
