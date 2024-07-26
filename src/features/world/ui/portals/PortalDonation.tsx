import React from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { Loading } from "features/auth/components";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

import walletIcon from "assets/icons/wallet.png";
import { GameWallet } from "features/wallet/Wallet";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { MinigameName } from "features/game/types/minigames";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";

export type IPortalDonation = {
  matic: number;
  address: string;
};

interface Props {
  portalName: MinigameName;
  donation: IPortalDonation;
  onClose: () => void;
}
export const PortalDonation: React.FC<Props> = ({
  donation,
  onClose,
  portalName,
}) => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);

  const donate = () => {
    send("DONATE", {
      donation: donation.matic,
      to: donation.address,
    });
  };

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col items-center">
          <div className="p-1">
            <Label icon={walletIcon} type="default" className="mb-2">
              {portalName}
            </Label>
            <p>
              {t("donation.toPortal", {
                amount: setPrecision(new Decimal(donation.matic)),
                portalName: portalName,
              })}
            </p>
          </div>
          <Button onClick={donate}>{t("confirm")}</Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <Loading className="mb-4" text={t("donating")} />
        </div>
      )}
      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-4">{t("statements.ohNo")}</p>
        </div>
      )}
      {state.matches("confirming") && (
        <GameWallet action="donate">
          <div className="flex flex-col items-center">
            <p className="m-2">{`${setPrecision(new Decimal(donation.matic))} MATIC`}</p>
            <Button className="w-full ml-1" onClick={donate}>
              {t("confirm")}
            </Button>
          </div>
        </GameWallet>
      )}
      {state.matches("donated") && (
        <div className="flex flex-col items-center">
          <div className="p-2">{t("thank.you")}</div>
          <Button onClick={onClose}>{t("close")}</Button>
        </div>
      )}
    </>
  );
};
