import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PortalMachineState } from "../../lib/Machine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PORTAL_NAME } from "../../Constants";

import cardboard from "public/world/portal/images/cardboard.png";

const _score = (state: PortalMachineState) => state.context.score;

export const Score: React.FC = () => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const score = useSelector(portalService, _score);

  return (
    <>
      <div className="text-white flex flex-col text-shadow rounded-md relative w-[115px]">
        <img src={cardboard} />
        <div className="flex flex-col w-full h-full items-center justify-center absolute">
          <span className="text-xs">{t(`${PORTAL_NAME}.scoreTitle`)}</span>
          <div className="flex items-center">
            <span className="text-lg">{Math.round(score)}</span>
          </div>
        </div>
      </div>
    </>
  );
};
