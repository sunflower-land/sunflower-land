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

interface Props {
  craftingService: MachineInterpreter;
  onClose: () => void;
}

export const InProgressInfo: React.FC<Props> = ({
  craftingService,
  onClose,
}) => {
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

  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col mb-2">
      <p className="text-sm">{t("in.progress")}</p>
      <div className="flex">
        <Box image={ITEM_DETAILS[name].image} />
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
