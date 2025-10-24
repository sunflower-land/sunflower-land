import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const _purchasingData = (state: MachineState) =>
  state.context.data["marketplaceBuyingBulkResources"] ?? {
    totalSpent: 0,
    totalPurchased: 0,
    attemptedPurchases: 0,
    successfulPurchases: 0,
    failedPurchases: 0,
  };

export const BulkPurchaseSuccess: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const { attemptedPurchases, failedPurchases } = useSelector(
    gameService,
    _purchasingData,
  );

  const getContent = () => {
    if (failedPurchases === 0) {
      return (
        <>
          <Label type="success" className="mb-2">
            {t("success")}
          </Label>
          <p className="text-sm mb-2">
            {t("marketplace.buying.bulk.resources.success")}
          </p>
        </>
      );
    }

    if (attemptedPurchases === failedPurchases) {
      return (
        <>
          <Label type="warning" className="mb-2">
            {t("there.was.a.problem")}
          </Label>
          <p className="text-sm mb-2">
            {t("marketplace.buying.bulk.resources.allFailed")}
          </p>
        </>
      );
    }

    return (
      <>
        <Label type="warning" className="mb-2">
          {t("partial.success")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.buying.bulk.resources.someSuccess")}
        </p>
      </>
    );
  };

  return (
    <>
      <div className="p-1.5">{getContent()}</div>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
