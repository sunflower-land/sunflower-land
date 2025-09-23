import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import { Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Pet, PetNFT } from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

function getGemCost(resets: number) {
  const baseCost = 40;
  const nextPrice = baseCost * Math.pow(1.5, resets);
  return Math.round(nextPrice);
}

export const ResetFoodRequests: React.FC<{
  petData: Pet | PetNFT;
  inventory: Inventory;
  todayDate: string;
  resetRequests: () => Promise<void>;
  setShowResetRequests: (showResetRequests: boolean) => void;
  isRevealedState: boolean;
  isRevealing: boolean;
  onAcknowledged: () => void;
  setIsRevealing: (isRevealing: boolean) => void;
  isPicking: boolean;
  isRevealingState: boolean;
}> = ({
  petData,
  inventory,
  todayDate,
  resetRequests,
  setShowResetRequests,
  isRevealedState,
  isRevealing,
  onAcknowledged,
  setIsRevealing,
  isPicking,
  isRevealingState,
}) => {
  const { t } = useAppTranslation();
  const [showResetRequestsConfirmation, setShowResetRequestsConfirmation] =
    useState(false);
  const resetGemCost = getGemCost(petData.requests.resets?.[todayDate] ?? 0);
  const hasEnoughGem = inventory.Gem?.gte(resetGemCost);

  if (isPicking || (isRevealingState && isRevealing)) {
    return (
      <InnerPanel>
        <Loading text={t("pets.loadingFoodRequests")} />
      </InnerPanel>
    );
  }

  if (isRevealedState && isRevealing) {
    return (
      <InnerPanel>
        <Label type="warning">{t("pets.requestsReset")}</Label>
        <p className="text-sm p-1">
          {t("pets.requestsResetDescription", { pet: petData.name })}
        </p>
        <Button
          onClick={() => {
            onAcknowledged();
            setIsRevealing(false);
            setShowResetRequests(false);
          }}
        >
          {t("continue")}
        </Button>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-6 cursor-pointer"
            onClick={() => setShowResetRequests(false)}
          />
          <Label type="default">
            {t("pets.getNewRequests", { pet: petData.name })}
          </Label>
        </div>
        <Label type="info" secondaryIcon={ITEM_DETAILS.Gem.image}>
          {`${resetGemCost} ${t("gems")}`}
        </Label>
      </div>
      <p className="text-xs px-1">
        {t("pets.requestsResetedAt", { pet: petData.name })}
      </p>
      <p className="text-xs px-1">
        {t("pets.requestsResetedAtDescription", { pet: petData.name })}
      </p>
      <div className="flex flex-row gap-2 items-center justify-between">
        <Button
          onClick={() => {
            if (showResetRequestsConfirmation) {
              resetRequests();
              setShowResetRequestsConfirmation(false);
            } else {
              setShowResetRequestsConfirmation(true);
            }
          }}
          disabled={!hasEnoughGem}
        >
          {showResetRequestsConfirmation
            ? t("confirm")
            : t("pets.resetRequests")}
        </Button>
        {showResetRequestsConfirmation && (
          <Button onClick={() => setShowResetRequestsConfirmation(false)}>
            {t("cancel")}
          </Button>
        )}
      </div>
    </InnerPanel>
  );
};
