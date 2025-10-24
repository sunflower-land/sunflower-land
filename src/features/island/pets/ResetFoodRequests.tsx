import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Pet, PetNFT } from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTimeUntil } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";

function getGemCost(resets: number) {
  const baseCost = 40;
  const nextPrice = baseCost * Math.pow(1.5, resets);
  return Math.round(nextPrice);
}

type Props = {
  petData: Pet | PetNFT;
  inventory: Inventory;
  todayDate: string;
  handleResetRequests: () => void;
  onAcknowledged: () => void;
  onBack: () => void;
};

export function getTimeUntilUTCReset() {
  const now = new Date();
  // Get UTC date components
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();
  // Create a new Date at 00:00 UTC tomorrow
  const tomorrowUTC = new Date(
    Date.UTC(utcYear, utcMonth, utcDate + 1, 0, 0, 0, 0),
  );

  return getTimeUntil(tomorrowUTC);
}

const _revealing = (state: MachineState) => state.matches("revealing");
const _revealed = (state: MachineState) => state.matches("revealed");

export const ResetFoodRequests: React.FC<Props> = ({
  petData,
  inventory,
  todayDate,
  handleResetRequests,
  onAcknowledged,
  onBack,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isRevealingState = useSelector(gameService, _revealing);
  const isRevealedState = useSelector(gameService, _revealed);

  const resetGemCost = getGemCost(petData.requests.resets?.[todayDate] ?? 0);
  const hasEnoughGem = inventory.Gem?.gte(resetGemCost);

  if (isRevealingState) {
    return (
      <InnerPanel>
        <Loading text={t("pets.loadingFoodRequests")} />
      </InnerPanel>
    );
  }

  if (isRevealedState) {
    return (
      <InnerPanel>
        <Label type="success">{t("pets.requestsReset")}</Label>
        <p className="text-xs py-2 px-1">
          {t("pets.requestsResetDescription", { pet: petData.name })}
        </p>
        <Button
          onClick={() => {
            onAcknowledged();
            onBack();
          }}
        >
          {t("continue")}
        </Button>
      </InnerPanel>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label type="default">
        {t("pets.getNewRequests", { pet: petData.name })}
      </Label>
      <InnerPanel className="flex flex-col gap-2">
        {!showConfirmation && (
          <div className="flex justify-between items-center">
            <img
              src={SUNNYSIDE.icons.arrow_left}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
              onClick={onBack}
            />
            <Label
              type="info"
              icon={SUNNYSIDE.icons.stopwatch}
              className="-mb-1"
            >
              {t("pets.nextRequestsIn", { time: getTimeUntilUTCReset() })}
            </Label>
          </div>
        )}
        {!showConfirmation && (
          <div className="flex flex-col gap-1 p-1">
            <p className="text-xs">{t("pets.requestsResetAt")}</p>
            <p className="text-xs">{t("pets.requestsResetAtDescription")}</p>
          </div>
        )}
        {showConfirmation && (
          <div className="flex flex-col gap-1 p-1">
            <p className="text-xs">
              {t("pets.resetConfirmation", { resetGemCost })}
            </p>
          </div>
        )}
        <div className="relative flex flex-row gap-1 items-center justify-between">
          {showConfirmation && (
            <Button onClick={() => setShowConfirmation(false)}>
              {t("cancel")}
            </Button>
          )}
          <Button
            onClick={() => {
              if (showConfirmation) {
                handleResetRequests();
                setShowConfirmation(false);
              } else {
                setShowConfirmation(true);
              }
            }}
            disabled={!hasEnoughGem}
            className="relative"
          >
            {!showConfirmation && (
              <Label
                type="info"
                secondaryIcon={ITEM_DETAILS.Gem.image}
                className="absolute right-1.5 -top-4"
              >
                {`Cost: ${resetGemCost}`}
              </Label>
            )}
            {showConfirmation ? t("confirm") : t("pets.resetRequests")}
          </Button>
        </div>
      </InnerPanel>
    </div>
  );
};
