import React, { useState } from "react";
import { useConnections, useDisconnect, useSwitchChain } from "wagmi";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const RoninMigration: React.FC = () => {
  const { t } = useAppTranslation();

  const { mutateAsync: switchChain, isPending } = useSwitchChain();
  const { mutate: disconnect } = useDisconnect();
  const connections = useConnections();

  const [hasError, setHasError] = useState(false);

  const switchToPolygon = async () => {
    setHasError(false);
    try {
      await switchChain({ chainId: CONFIG.POLYGON_CHAIN_ID });
    } catch {
      // Ronin Waypoint cannot switch to Polygon - this is expected when the
      // player has not yet re-connected through the Ronin browser extension.
      setHasError(true);
    }
  };

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  return (
    <div className="flex flex-col p-2">
      <Label type="default" className="mb-2 -ml-px">
        {t("transfer.ronin.migrate.label")}
      </Label>

      <p className="text-sm mb-2">{t("transfer.ronin.migrate.title")}</p>

      <p className="text-xs mb-2">{t("transfer.ronin.migrate.deadline")}</p>

      <p className="text-xs mb-2">{t("transfer.ronin.migrate.polygon")}</p>

      <p className="text-sm mb-1">{t("transfer.ronin.migrate.howTo")}</p>

      <div className="flex items-start mb-2">
        <img src={SUNNYSIDE.ui.dot} className="h-4 mt-1 mr-2" />
        <span className="text-xs">
          {t("transfer.ronin.migrate.step1")}
          <img
            src={SUNNYSIDE.icons.roninIcon}
            className="h-5 inline-block mx-1 align-text-bottom"
            alt="Ronin Browser Extension"
          />
        </span>
      </div>

      <div className="flex items-start mb-2">
        <img src={SUNNYSIDE.ui.dot} className="h-4 mt-1 mr-2" />
        <span className="text-xs">{t("transfer.ronin.migrate.step2")}</span>
      </div>

      <div className="flex items-start mb-2">
        <img src={SUNNYSIDE.ui.dot} className="h-4 mt-1 mr-2" />
        <span className="text-xs">{t("transfer.ronin.migrate.step3")}</span>
      </div>

      <div className="flex items-start mb-2">
        <img src={SUNNYSIDE.ui.dot} className="h-4 mt-1 mr-2" />
        <span className="text-xs">{t("transfer.ronin.migrate.step4")}</span>
      </div>

      {hasError && (
        <Label
          type="danger"
          icon={SUNNYSIDE.icons.expression_alerted}
          className="mb-2"
        >
          {t("transfer.ronin.migrate.switchError")}
        </Label>
      )}

      <div className="flex flex-col sm:flex-row gap-1 -mx-2 -mb-2">
        <Button onClick={switchToPolygon} disabled={isPending}>
          {isPending
            ? t("switching.network")
            : t("transfer.ronin.migrate.switchToPolygon")}
        </Button>
        <Button onClick={onDisconnect}>{t("walletWall.disconnect")}</Button>
      </div>
    </div>
  );
};
