import React, { useContext } from "react";

import { Panel } from "components/ui/Panel";

import { Withdraw } from "./Withdraw";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameWallet } from "features/wallet/Wallet";
import { Label } from "components/ui/Label";

import withdrawIcon from "assets/icons/withdraw.png";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  farmAddress: string;
  onClose: () => void;
}

export const BankModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  return (
    <Panel className="relative">
      <GameWallet
        action="withdraw"
        wrapper={({ children }) => (
          <div>
            <Label
              type="default"
              icon={withdrawIcon}
              className="text-center m-1"
            >
              {t("withdraw")}
            </Label>
            {children}
          </div>
        )}
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <img
            src={SUNNYSIDE.icons.close}
            className="absolute cursor-pointer z-20"
            onClick={onClose}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <Withdraw onClose={onClose} />
      </GameWallet>
    </Panel>
  );
};
