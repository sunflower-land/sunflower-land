import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { TradeableItemDetails } from "features/marketplace/components/TradeableSummary";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";

const _purchasingData = (state: MachineState) =>
  state.context.data["marketplaceBuyingBulkResources"];
const _state = (state: MachineState) => state.context.state;

export const BulkPurchaseSuccess: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const {
    attemptedPurchases,
    failedPurchases,
    itemId,
    totalSpent,
    totalPurchased,
  } = useSelector(gameService, _purchasingData);
  const state = useSelector(gameService, _state);

  const display = getTradeableDisplay({
    id: itemId,
    type: "collectibles",
    state,
  });

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
          <div className="my-1">
            <TradeableItemDetails
              display={display}
              sfl={totalSpent}
              quantity={totalPurchased}
            />
          </div>
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
        <div className="my-1">
          <TradeableItemDetails
            display={display}
            sfl={totalSpent}
            quantity={totalPurchased}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="p-1.5">{getContent()}</div>
      <Button
        onClick={() => {
          gameService.send({ type: "CONTINUE" });
        }}
      >
        {t("continue")}
      </Button>
    </>
  );
};
