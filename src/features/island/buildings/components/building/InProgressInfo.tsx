import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { COOKABLES } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import React from "react";
import { MachineInterpreter } from "../../lib/craftingMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  craftingService: MachineInterpreter;
  onClose: () => void;
  isOilBoosted: boolean;
}

export const InProgressInfo: React.FC<Props> = ({
  craftingService,
  onClose,
  isOilBoosted,
}) => {
  const { t } = useAppTranslation();

  const [
    {
      context: { secondsTillReady, name },
    },
  ] = useActor(craftingService);

  if (!name || !secondsTillReady) return null;

  if (secondsTillReady <= 0) {
    onClose();
  }

  const { cookingSeconds } = COOKABLES[name];

  return (
    <div className="flex flex-col mb-2">
      <Label
        className="mr-3 ml-2 mb-1"
        icon={SUNNYSIDE.icons.stopwatch}
        type="default"
      >
        {t("in.progress")}
      </Label>
      <div className="flex">
        <Box
          image={ITEM_DETAILS[name].image}
          // alternateIcon={isOilBoosted ? ITEM_DETAILS["Oil"].image : null}
          secondaryImage={isOilBoosted ? ITEM_DETAILS["Oil"].image : null}
        />
        <div
          className="relative flex flex-col w-full"
          style={{
            marginTop: `${PIXEL_SCALE * 3}px`,
            marginBottom: `${PIXEL_SCALE * 2}px`,
          }}
          id="progress-bar"
        >
          <span className="text-xs mb-1">
            {secondsToString(secondsTillReady, { length: "medium" })}
          </span>
          <ResizableBar
            percentage={(1 - secondsTillReady / cookingSeconds) * 100}
            type="progress"
          />
        </div>
      </div>
    </div>
  );
};
