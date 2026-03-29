import React, { useContext } from "react";
import { PortalLeaderboard } from "features/world/ui/portals/PortalLeaderboard";
import { PortalMachineState } from "../../lib/Machine";
import { PortalContext } from "../../lib/PortalProvider";
import { decodeToken } from "features/auth/actions/login";
import { useSelector } from "@xstate/react";
import { PORTAL_NAME } from "../../Constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _jwt = (state: PortalMachineState) => state.context.jwt;

export const Leaderboard: React.FC = () => {
  const { t } = useAppTranslation();
  const { portalService } = useContext(PortalContext);

  const jwt = useSelector(portalService, _jwt);

  const farmId = decodeToken(jwt as string).farmId;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto scrollable max-h-[75vh]">
      <div className="flex flex-col gap-2 px-2 pt-2">
        <p>{t(`${PORTAL_NAME}.competition.description1`)}</p>
        <p>{t(`${PORTAL_NAME}.competition.description2`)}</p>
      </div>
      <PortalLeaderboard
        isAccumulator
        name={PORTAL_NAME}
        startDate={new Date(Date.UTC(2026, 3, 5))}
        endDate={new Date(Date.UTC(2026, 3, 7))}
        farmId={Number(farmId)}
        // formatPoints={(points) => {}}
        jwt={jwt as string}
      />
    </div>
  );
};
