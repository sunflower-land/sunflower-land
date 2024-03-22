import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import React, { useContext } from "react";
import { PortalContext } from "../lib/PortalProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}
export const CropBoomFinish: React.FC<Props> = ({ onClose }) => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);
  const { t } = useAppTranslation();

  const claim = async () => {
    portalService.send("CLAIM");
    onClose();
  };

  if (portalState.matches("claiming")) {
    return <span className="loading">{t("loading")}</span>;
  }

  return (
    <ClaimReward
      onClaim={claim}
      reward={{
        id: "x",
        createdAt: 0,
        items: { "Arcade Token": 1 },
        wearables: {},
        sfl: 0,
        coins: 0,
      }}
    />
  );
};
