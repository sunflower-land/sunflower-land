import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { CRUSTACEANS, CrustaceanName } from "features/game/types/crustaceans";
import confetti from "canvas-confetti";

const _state = (state: MachineState) => state.context.state;

interface Props {
  collectedCatch: { item: CrustaceanName; amount: number } | undefined;
  onClose: () => void;
}

export const CrustaceanCaught: React.FC<Props> = ({
  collectedCatch,
  onClose,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();

  const caughtItem = collectedCatch?.item;
  const caughtAmount = collectedCatch?.amount;
  const newCatch =
    caughtItem &&
    caughtItem in CRUSTACEANS &&
    (state.farmActivity[`${caughtItem} Caught`] ?? 0) === caughtAmount;

  useEffect(() => {
    if (newCatch && showAnimations) {
      confetti();
    }
  }, [newCatch, showAnimations]);

  if (!caughtItem) {
    return null;
  }

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="flex flex-col gap-2">
        <div className="p-2">
          <div className="flex flex-col justify-center items-center">
            {newCatch && (
              <Label
                type="warning"
                className="mb-2"
                icon={SUNNYSIDE.icons.search}
              >
                {t("waterTrap.newCrustacean")}
              </Label>
            )}
            <span className="text-sm mb-2">{caughtItem}</span>
            <img
              src={ITEM_DETAILS[caughtItem].image}
              className="h-12 mb-2"
              alt=""
            />
            <span className="text-xs text-center mb-2">
              {ITEM_DETAILS[caughtItem].description}
            </span>
          </div>
        </div>
        <Button onClick={onClose} className="w-full">
          {t("ok")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
