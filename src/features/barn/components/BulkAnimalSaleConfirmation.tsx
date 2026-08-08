import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { getBulkAnimalSaleSummary } from "features/game/events/landExpansion/bulkSellAnimal";

const _state = (state: MachineState) => state.context.state;

interface Props {
  show: boolean;
  sales: { requestId: string; animalId: string }[];
  onCancel: () => void;
  onConfirm: () => void;
}

export const BulkAnimalSaleConfirmation: React.FC<Props> = ({
  show,
  sales,
  onCancel,
  onConfirm,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const [isConfirming, setIsConfirming] = useState(false);

  const summary = getBulkAnimalSaleSummary({ state, sales });

  const handleConfirm = () => {
    setIsConfirming(true);
    try {
      gameService.send("animals.bulkSold", { sales });
    } finally {
      setIsConfirming(false);
      onConfirm();
    }
  };

  return (
    <ConfirmationModal
      show={show}
      onHide={onCancel}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      confirmButtonLabel={t("bounties.confirmSell")}
      disabled={isConfirming || summary.totalAnimals === 0}
      messages={[
        t("bounties.bulkSell.summaryTitle"),
        t("bounties.bulkSell.summaryCount", { count: summary.totalAnimals }),
      ]}
      bodyContent={
        <div className="flex flex-col gap-1 w-full mt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {summary.coins > 0 && (
              <Label type="warning" icon={SUNNYSIDE.ui.coinsImg}>
                {summary.coins}
              </Label>
            )}
            {getKeys(summary.items).map((name) => (
              <Label key={name} type="warning" icon={ITEM_DETAILS[name].image}>
                {`x ${summary.items[name]} ${name}`}
              </Label>
            ))}
          </div>
          {summary.mutantReadyCount > 0 && (
            <Label type="vibrant" className="mt-1">
              {t("bounties.bulkSell.mutantSummaryWarning", {
                count: summary.mutantReadyCount,
              })}
            </Label>
          )}
          {summary.sickAnimalCount > 0 && (
            <Label type="danger" className="mt-1">
              {t("bounties.bulkSell.sickWarning", {
                count: summary.sickAnimalCount,
              })}
            </Label>
          )}
          {summary.skipped.length > 0 && (
            <Label type="danger" className="mt-1">
              {t("bounties.bulkSell.skippedWarning", {
                count: summary.skipped.length,
              })}
            </Label>
          )}
        </div>
      }
    />
  );
};
