import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { tradeToId } from "../lib/offers";
import { TradeOffer } from "features/game/types/game";
import sflIcon from "assets/icons/flower_token.webp";
import bg from "assets/ui/3x3_bg.png";
import {
  MarketplaceTradeableName,
  TRADE_INITIATION_MS,
} from "features/game/types/marketplace";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { TradeInitiated } from "./RemoveListing";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  id: string;
  offer: TradeOffer;
  authToken: string;
  onClose: () => void;
}
const _state = (state: MachineState) => state.context.state;

export const RemoveOffer: React.FC<Props> = ({
  id,
  onClose,
  offer,
  authToken,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow({ live: true });

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

  const itemId = tradeToId({ details: offer });
  const display = getTradeableDisplay({
    id: itemId,
    type: offer.collection,
    state,
  });
  const quantity = offer.items[display.name as MarketplaceTradeableName];

  const initiatedAt = offer.initiatedAt;
  const isBeingPurchased =
    !!initiatedAt && now - initiatedAt < TRADE_INITIATION_MS;

  if (isBeingPurchased) {
    return (
      <TradeInitiated
        initiatedAt={initiatedAt}
        display={display}
        quantity={
          offer.items[display.name as MarketplaceTradeableName] as number
        }
        sfl={offer.sfl}
      />
    );
  }

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.cancelOffer")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.cancelOffer.areYouSure")}
        </p>
        <div>
          <div className="flex">
            <div className="h-12 w-12 mr-2 relative">
              <img src={bg} className="w-full rounded" />
              <img
                src={display.image}
                className="w-1/2 absolute"
                style={{
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                  bottom: "50%",
                }}
              />
            </div>
            <div>
              <span className="text-sm">{`${quantity} x ${display.name}`}</span>
              <div className="flex items-center">
                <span className="text-sm">{`${offer.sfl} FLOWER`}</span>
                <img src={sflIcon} className="h-6 ml-1" />
              </div>
            </div>
          </div>
        </div>
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
