import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { COOKABLES } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { secondsToString } from "lib/utils/time";
import React, { useState } from "react";
import { MachineInterpreter } from "../../lib/craftingMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { GameState } from "features/game/types/game";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

interface Props {
  craftingService: MachineInterpreter;
  onClose: () => void;
  isOilBoosted: boolean;
  onInstantCooked: (gems: number) => void;
  state: GameState;
}

export const InProgressInfo: React.FC<Props> = ({
  craftingService,
  onClose,
  isOilBoosted,
  onInstantCooked,
  state,
}) => {
  const { t } = useAppTranslation();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [
    {
      context: { secondsTillReady, name, readyAt },
    },
  ] = useActor(craftingService);

  if (!name || !secondsTillReady) return null;

  if (secondsTillReady <= 0) {
    onClose();
  }

  const { cookingSeconds } = COOKABLES[name];
  const { inventory } = state;

  const gems = getInstantGems({
    readyAt: readyAt ?? 0,
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
        <Button
          disabled={!inventory.Gem?.gte(gems)}
          className="w-16 h-12 mr-[6px]"
          onClick={() => setShowConfirmation(true)}
        >
          <Label
            type={inventory.Gem?.gte(gems) ? "default" : "danger"}
            icon={ITEM_DETAILS.Gem.image}
          >
            {gems}
          </Label>
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
