import { Box } from "components/ui/Box";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { COOKABLES } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { BuildingProduct, GameState } from "features/game/types/game";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import fastForward from "assets/icons/fast_forward.png";
import { useCountdown } from "lib/utils/hooks/useCountdown";

interface Props {
  cooking: BuildingProduct;
  onClose: () => void;
  isOilBoosted: boolean;
  onInstantCooked: (gems: number) => void;
  state: GameState;
}

export const InProgressInfo: React.FC<Props> = ({
  cooking,
  isOilBoosted,
  onInstantCooked,
  state,
}) => {
  const { t } = useAppTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const { totalSeconds: secondsTillReady } = useCountdown(cooking.readyAt ?? 0);

  if (!cooking.name) return null;

  const { cookingSeconds } = COOKABLES[cooking.name];
  const { inventory } = state;

  const gems = getInstantGems({
    readyAt: cooking.readyAt,
    game: state,
  });

  return (
    <div className="flex flex-col mb-2 w-full">
      <Label
        className="mr-3 ml-2 mb-1"
        icon={SUNNYSIDE.icons.stopwatch}
        type="default"
      >
        {t("in.progress")}
      </Label>
      <div className="flex items-center justify-between">
        <Box
          image={ITEM_DETAILS[cooking.name].image}
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

        <Button
          disabled={!inventory.Gem?.gte(gems)}
          className="w-36 sm:w-44 px-3 h-12 mr-[6px]"
          onClick={() => setShowConfirmation(true)}
        >
          <div className="flex items-center justify-center gap-1 mx-2">
            <img src={fastForward} className="h-5" />
            <span className="text-sm flex items-center">{gems}</span>
            <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
          </div>
        </Button>

        <ConfirmationModal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            onInstantCooked(gems);
            setShowConfirmation(false);
          }}
          messages={[
            t("instantCook.confirmationMessage"),
            t("instantCook.costMessage", { gems }),
          ]}
          confirmButtonLabel={t("instantCook.finish")}
        />
      </div>
    </div>
  );
};
