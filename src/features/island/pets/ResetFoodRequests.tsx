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
import { useNow } from "lib/utils/hooks/useNow";

function getGemCost(resets: number) {
  const baseCost = 50;
  const nextPrice = baseCost * Math.pow(2, resets);
  return Math.round(nextPrice);
}

type Props = {
  petData: Pet | PetNFT;
  inventory: Inventory;
  todayDate: string;
  handleResetRequests: () => void;
  onAcknowledged: () => void;
  onBack: () => void;
  PanelWrapper?: React.ComponentType<
    React.PropsWithChildren<{ className?: string }>
  >;
};

export function useTimeUntilUTCReset() {
  const now = useNow({ live: true });
  const nowDate = new Date(now);
  // Get UTC date components
  const utcYear = nowDate.getUTCFullYear();
  const utcMonth = nowDate.getUTCMonth();
  const utcDate = nowDate.getUTCDate();
  // Create a new Date at 00:00 UTC tomorrow
  const tomorrowUTC = new Date(
    Date.UTC(utcYear, utcMonth, utcDate + 1, 0, 0, 0, 0),
  );

  return getTimeUntil(tomorrowUTC);
}

const _resettingPetRequests = (state: MachineState) =>
  state.matches("resettingPetRequests");
const _resettingPetRequestsSuccess = (state: MachineState) =>
  state.matches("resettingPetRequestsSuccess");

export const ResetFoodRequests: React.FC<Props> = ({
  petData,
  inventory,
  todayDate,
  handleResetRequests,
  onAcknowledged,
  onBack,
  PanelWrapper = InnerPanel,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isResettingPetRequestsState = useSelector(
    gameService,
    _resettingPetRequests,
  );
  const isResettingPetRequestsSuccessState = useSelector(
    gameService,
    _resettingPetRequestsSuccess,
  );

  const resetGemCost = getGemCost(petData.requests.resets?.[todayDate] ?? 0);
  const hasEnoughGem = inventory.Gem?.gte(resetGemCost);

  const timeUntilUTCReset = useTimeUntilUTCReset();

  if (isResettingPetRequestsState) {
    return (
      <PanelWrapper>
        <Loading text={t("pets.loadingFoodRequests")} />
      </PanelWrapper>
    );
  }

  if (isResettingPetRequestsSuccessState) {
    return (
      <PanelWrapper>
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
      </PanelWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Label type="default">
        {t("pets.getNewRequests", { pet: petData.name })}
      </Label>
      <PanelWrapper className="flex flex-col gap-2">
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
              {t("pets.nextRequestsIn", { time: timeUntilUTCReset })}
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
      </PanelWrapper>
    </div>
  );
};
