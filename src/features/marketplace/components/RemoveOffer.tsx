import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { getItemId } from "../lib/offers";
import { TradeOffer } from "features/game/types/game";
import { TradeableSummary } from "./TradeableSummary";

interface Props {
  id: string;
  offer: TradeOffer;
  authToken: string;
  onClose: () => void;
}
export const RemoveOffer: React.FC<Props> = ({
  id,
  onClose,
  offer,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const confirm = async () => {
    gameService.send("marketplace.offerCancelled", {
      effect: {
        type: "marketplace.offerCancelled",
        id,
      },
      authToken,
    });

    onClose();
  };

  if (!offer || !id) {
    return null;
  }

  const itemId = getItemId({ offer });
  const display = getTradeableDisplay({ id: itemId, type: offer.collection });

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.cancelOffer")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.cancelOffer.areYouSure")}
        </p>
        <TradeableSummary display={display} sfl={offer.sfl} />
      </div>
      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("no")}
        </Button>
        <Button onClick={confirm}>{t("yes")}</Button>
      </div>
    </Panel>
  );
};
