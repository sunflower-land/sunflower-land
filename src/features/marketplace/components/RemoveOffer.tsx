import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { waitFor } from "xstate/lib/waitFor";
import { getTradeableDisplay } from "../lib/tradeables";
import { getOfferItem } from "../lib/offers";
import { TradeOffer } from "features/game/types/game";
import { TradeableSummary } from "./TradeableOffers";

interface Props {
  id: string;
  offer: TradeOffer;
  onClose: () => void;
  onDone: () => void;
}
export const RemoveOffer: React.FC<Props> = ({
  id,
  onClose,
  onDone,
  offer,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [state, setState] = useState<"idle" | "removing" | "removed" | "error">(
    "idle",
  );

  const confirm = async () => {
    setState("removing");

    try {
      gameService.send("POST_EFFECT", {
        effect: {
          type: "marketplace.offerCancelled",
          id,
        },
      });

      await waitFor(
        gameService,
        (state) => {
          if (state.matches("error")) throw new Error("Insert failed");
          return state.matches("playing");
        },
        { timeout: 60 * 1000 },
      );

      setState("removed");
    } catch {
      setState("error");
    }
  };

  if (state === "removed") {
    return (
      <Panel>
        <div className="p-2">
          <Label type="success" className="mb-2">
            {t("success")}
          </Label>
          <p className="text-sm mb-2">{t("marketplace.offerRemoved")}</p>
        </div>
        <div className="flex">
          <Button onClick={onDone}>{t("continue")}</Button>
        </div>
      </Panel>
    );
  }

  if (!offer || !id) {
    return null;
  }

  if (state === "removing") {
    return (
      <Panel>
        <Loading />
      </Panel>
    );
  }

  if (state === "error") {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm">{`Something went wrong`}</p>
        </div>
      </Panel>
    );
  }

  const itemId = getOfferItem({ offer });
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
