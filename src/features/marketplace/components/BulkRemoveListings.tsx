import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  ids: string[];
  authToken: string;
  onClose: () => void;
}

export const BulkRemoveListings: React.FC<Props> = ({
  onClose,
  authToken,
  ids,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const confirm = () => {
    gameService.send("marketplace.bulkListingsCancelled", {
      effect: {
        type: "marketplace.bulkListingsCancelled",
        ids,
      },
      authToken,
    });

    onClose();
  };

  return (
    <Panel>
      <div className="p-2">
        <Label type="danger" className="mb-2">
          {t("marketplace.bulkCancelListings")}
        </Label>
        <p className="text-sm mb-2">
          {t("marketplace.bulkCancelListings.areYouSure")}
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
