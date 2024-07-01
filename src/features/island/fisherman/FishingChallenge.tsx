import kraken from "assets/ui/kraken.png";
import ringDot from "assets/icons/fish_dot.png";

import React, { useRef, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishName, MarineMarvelName } from "features/game/types/fishing";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { useSpring, animated } from "react-spring";
import { SensitiveButton } from "components/ui/SensitiveButton";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

// Function to generate a random angle at least 150 degrees away from a given angle
function getRandomAngle(minDistance: number, existingAngle: number) {
  let randomAngle;

  do {
    randomAngle = Math.random() * 270; // Generate a random angle between 0 and 270
  } while (Math.abs(randomAngle - existingAngle) < minDistance);

  return randomAngle;
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
  if (attempts > 20) {
    return 1300;
  }

  if (attempts > 15) {
    return 1600;
  }

  if (attempts > 10) {
    return 1900;
  }

  if (attempts > 7) {
    return 2200;
  }

  if (attempts > 3) {
    return 2500;
  }

  return 3000;
}

// Difficult to health
const FISH_HEALTH: Record<number, number> = {
  1: 10,
  2: 13,
  3: 16,
  4: 20,
  5: 25,
};

interface Props {
  onCatch: () => void;
  onMiss: () => void;
  difficulty?: number;
  fishName: FishName | MarineMarvelName;
}

export const FishingChallengeIntro: React.FC<{ onNext: () => void }> = ({
  onNext,
}) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <p className="text-sm mb-1">
          {t("fishingChallengeIntro.powerfulCatch")}
        </p>
        <p className="text-sm mb-1">{t("fishingChallengeIntro.useStrength")}</p>
        <p className="text-sm mb-1">
          {t("fishingChallengeIntro.stopGreenBar")}
        </p>
        <p className="text-sm mb-1">{t("fishingChallengeIntro.beQuick")}</p>
      </div>
      <Button onClick={onNext}>{t("next")}</Button>
    </>
  );
};

export const FishingChallengeComponent: React.FC<Props> = ({
  onCatch,
  onMiss,
  difficulty = 1,
  fishName,
}) => {
  const { t } = useAppTranslation();
  const [showIntro, setShowIntro] = useState(true);
  const [state, setState] = useState<"idle" | "playing">("idle");

  const [tentacleAngle, setTentacleAngle] = useState(getRandomAngle(150, 0));
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const direction = useRef<"clockwise" | "anticlockwise">("clockwise");
  const [castFrom, setCastFrom] = useState(0);
  const [castTo, setCastTo] = useState(360);

  const health = FISH_HEALTH[difficulty] ?? 10;

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
    onRest: () => {
      if (misses >= 2 && hits < health) {
        onMiss();
      }

      changeDirection(castTo);
      setAttempts((prev) => [...prev, "miss"]);
    },
    config: {
      duration: getSpeed(attempts.length),
      // mass: 0,
      // tension: 0,
      friction: 0,
    },
    pause: state === "idle",
  });

  const misses = attempts.filter((a) => a === "miss").length;
  const hits = attempts.filter((a) => a === "hit").length;

  const tentacleProps = useSpring({
    from: { transform: `rotate(${tentacleAngle}deg)` },
    to: { transform: `rotate(${tentacleAngle}deg)` },
    config: {
      duration: 5000,
    },
  });

  const greenBarPercentage = 10;
  // Half bar (bar angle is 10% of 360deg).
  const halfBarDegrees = 360 / greenBarPercentage / 2;
  // Add 5% tolerance to be more forgiving
  const halfBarDegreesWithTolerance = halfBarDegrees * 1.05;

  const reel = () => {
    const greenBarAngle = extractAngle(greenBarProps.transform.get());

    const tentacleAngle = extractAngle(tentacleProps.transform.get());

    const degreeDifference = Math.abs(
      ((normaliseAngle(greenBarAngle) - normaliseAngle(tentacleAngle) + 180) %
        360) -
        180,
    );

    const hit = degreeDifference < halfBarDegreesWithTolerance;

    setAttempts((prev) => [...prev, hit ? "hit" : "miss"]);

    if (!hit) {
      if (misses >= 2) {
        onMiss();
      }
    } else {
      if (hits >= health) {
        onCatch();
      }
    }

    const minimumAngle = Math.max(150 - attempts.length * 5, 50);

    setTentacleAngle((prev) => getRandomAngle(minimumAngle, prev));

    changeDirection(greenBarAngle);
  };

  if (showIntro) {
    return <FishingChallengeIntro onNext={() => setShowIntro(false)} />;
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
          percentage={100 - (hits / health) * 100}
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
          className="absolute inset-0"
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
            strokeDasharray={`${greenBarPercentage} ${
              100 - greenBarPercentage
            }`}
            strokeDashoffset={25 + greenBarPercentage / 2}
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
              left: "-1px",
              rotate: "137deg",
            }}
          />
        </animated.div>

        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50">
          <img
            src={
              fishName === "Kraken Tentacle"
                ? kraken
                : ITEM_DETAILS[fishName]?.image
            }
            width="80px"
          />

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
        <Button onClick={() => setState("playing")}>{t("start")}</Button>
      )}

      {state === "playing" && (
        <SensitiveButton onClick={reel}>{t("reel")}</SensitiveButton>
      )}
    </div>
  );
};
export const FishingChallenge = React.memo(FishingChallengeComponent);
