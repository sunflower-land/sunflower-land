import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  MarketplaceAuthGate,
  useNeedsMarketplaceStepUp,
} from "./MarketplaceAuthGate";

interface Props {
  ids: string[];
  authToken: string;
  type: "listings" | "offers";
  onClose: () => void;
}

export const BulkRemoveTrades: React.FC<Props> = ({
  onClose,
  authToken,
  ids,
  type,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [pendingCancel, setPendingCancel] = useState(false);
  const needsStepUp = useNeedsMarketplaceStepUp();

  const dispatchCancel = (token: string) => {
    if (type === "listings") {
      gameService.send("marketplace.bulkListingsCancelled", {
        effect: {
          type: "marketplace.bulkListingsCancelled",
          ids,
        },
        authToken: token,
      });
    } else {
      gameService.send("marketplace.bulkOffersCancelled", {
        effect: {
          type: "marketplace.bulkOffersCancelled",
          ids,
        },
        authToken: token,
      });
    }

    onClose();
  };

  const confirm = () => {
    if (needsStepUp) {
      setPendingCancel(true);
      return;
    }
    dispatchCancel(authToken);
  };

  if (pendingCancel) {
    return (
      <Panel>
        <MarketplaceAuthGate
          onProceed={(token) => {
            setPendingCancel(false);
            dispatchCancel(token);
          }}
          onCancel={() => setPendingCancel(false)}
        />
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.bulkCancel.label", { type })}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.bulkCancel.areYouSure", { type })}
        </p>
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
