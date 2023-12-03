import { ClaimReward } from "features/game/expansion/components/Airdrop";
import React, { useContext } from "react";
import { PortalContext } from "../lib/PortalProvider";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}
export const CropBoomFinish: React.FC<Props> = ({ onClose }) => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const claim = async () => {
    portalService.send("CLAIM");
    onClose();
  };

  if (portalState.matches("claiming")) {
    return <span className="loading">Loading</span>;
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
      }}
    />
  );
};
