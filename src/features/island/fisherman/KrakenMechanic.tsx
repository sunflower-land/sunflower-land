import tentacle from "assets/ui/tentacle.png";
import kraken from "assets/ui/kraken.png";

import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishingBait } from "features/game/types/fishing";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Bar } from "components/ui/ProgressBar";

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

export const FishingBar: React.FC = () => {
  const [state, setState] = useState<"idle" | "playing" | "caught" | "escaped">(
    "idle"
  );
  const [bait, setBait] = useState<FishingBait>("Earthworm");

  const [tentacleAngle, setTentacleAngle] = useState(getRandomAngle(150, 0));
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);

  const barHeight = BAIT_SIZE[bait];

  const reel = () => {
    // Usage example:
    const element = document.getElementById("fishing-bar") as HTMLElement;
    const rotationAngle = getRotationAngle(element) as number;

    const tentacleEl = document.getElementById("tentacle") as HTMLElement;
    const tentacleAngle = getRotationAngle(tentacleEl) as number;

    const degreeDifference = Math.abs(rotationAngle - tentacleAngle);

    const hit = degreeDifference < barHeight; //barStart < tentaclePosition && barEnd > tentaclePosition;

    if (!hit) {
      setMisses((prev) => prev + 1);

      if (misses === 2) {
        setState("escaped");
      }
    } else {
      setHits((prev) => prev + 1);

      if (hits === 9) {
        setState("caught");
      }
    }

    setTentacleAngle((prev) => getRandomAngle(150, prev));
  };

  const speed = 10 - hits / 2;

  if (state === "caught") {
    return <p>Caught</p>;
  }

  if (state === "escaped") {
    return <p>Escaped</p>;
  }

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
            disabled={state === "playing"}
          />
        ))}
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
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          id="fishing-bar"
          className="absolute inset-0 "
          style={{
            animation:
              state === "playing" ? `spin ${speed}s linear infinite` : "none",
          }}
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
        </svg>

        <div
          id="tentacle"
          style={{
            position: "absolute",
            width: "20px",
            height: "100px",
            top: "0px",
            left: "90px",
            transformOrigin: "bottom center",
            transform: `rotate(${tentacleAngle}deg)`,
          }}
        >
          <img
            src={tentacle}
            style={{
              position: "absolute",
              width: "16px",
              top: "-2px",
              left: "2px",
            }}
          />
        </div>

        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-50">
          <img src={kraken} width="80px" />
          <Bar percentage={100 - (hits / 10) * 100} type={"error"} />

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

      {state === "playing" && <Button onClick={reel}>Reel</Button>}
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
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={onClose}
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
