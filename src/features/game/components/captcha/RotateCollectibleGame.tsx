import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import type { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { randomInt } from "lib/utils/random";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { CaptchaGameProps } from "./types";

// Items with clearly asymmetric artwork so the upright orientation is obvious
const COLLECTIBLES: InventoryItemName[] = [
  "Nancy",
  "Scarecrow",
  "Kuebiko",
  "Gnome",
  "Farm Cat",
  "Farm Dog",
  "Chicken Coop",
  "Woody the Beaver",
  "Rocket Statue",
];

const STEPS = 8;
const STEP_DEGREES = 360 / STEPS;

export const RotateCollectibleGame: React.FC<CaptchaGameProps> = ({
  onSuccess,
  onFailure,
}) => {
  const { t } = useAppTranslation();

  const [item] = useState<InventoryItemName>(
    () => COLLECTIBLES[randomInt(0, COLLECTIBLES.length)],
  );
  // Cumulative rotation steps - starts off-axis so the player must fix it
  const [steps, setSteps] = useState(() => randomInt(1, STEPS));

  const submit = () => {
    const isUpright = ((steps % STEPS) + STEPS) % STEPS === 0;

    if (isUpright) {
      onSuccess();
    } else {
      onFailure();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs text-center mb-2">
        {t("captcha.rotate.instructions")}
      </p>
      <div className="flex items-center justify-center my-2">
        <Button
          className="w-12 mr-2"
          onClick={() => setSteps((prev) => prev - 1)}
        >
          <img
            src={SUNNYSIDE.icons.arrow_left}
            style={{ width: `${PIXEL_SCALE * 11}px` }}
          />
        </Button>
        <div className="flex items-center justify-center w-24 h-24">
          <img
            src={ITEM_DETAILS[item].image}
            className="w-16 h-16 object-contain transition-transform duration-200"
            style={{
              imageRendering: "pixelated",
              transform: `rotate(${steps * STEP_DEGREES}deg)`,
            }}
          />
        </div>
        <Button
          className="w-12 ml-2"
          onClick={() => setSteps((prev) => prev + 1)}
        >
          <img
            src={SUNNYSIDE.icons.arrow_right}
            style={{ width: `${PIXEL_SCALE * 11}px` }}
          />
        </Button>
      </div>
      <Button onClick={submit}>{t("submit")}</Button>
    </div>
  );
};
