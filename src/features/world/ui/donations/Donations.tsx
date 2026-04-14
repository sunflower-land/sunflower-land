import React, { useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { Loading } from "features/auth/components";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NumberInput } from "components/ui/NumberInput";
import { formatNumber } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";

interface Props {
  contributors: string[];
  donationAddress: string;
  isComingSoon?: boolean;
  onClose: () => void;
}

export const Donations: React.FC<Props> = ({
  contributors,
  donationAddress,
  isComingSoon,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);

  const [donation, setDonation] = useState(new Decimal(5));

  const onDonationChange = (value: Decimal) => {
    setDonation(value);
  };

  const incrementDonation = () => {
    setDonation((value) => value.add(0.1));
  };

  const decrementDonation = () => {
    setDonation((value) => {
      if (value.lessThanOrEqualTo(0.1)) return new Decimal(0.1);
      return value.minus(0.1);
    });
  };

  const handleDonate = () => {
    send("DONATE", {
      donation,
      to: donationAddress,
    });
  };

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col">
          <div className="flex flex-col mb-1 p-2">
            <p className="mb-2 text-center">{t("donation.one")}</p>

            <div className="flex flex-wrap mt-1 mb-4 gap-x-3 gap-y-1 justify-center">
              {contributors.map((name) => (
                <Label key={name} type="chill" icon={SUNNYSIDE.icons.heart}>
                  <span className="pl-1">{name}</span>
                </Label>
              ))}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex">
                <Button className="w-12" onClick={decrementDonation}>
                  {"-"}
                </Button>
                <div className="flex items-center w-24 mx-2">
                  <NumberInput
                    value={donation}
                    maxDecimalPlaces={1}
                    isOutOfRange={donation.lessThan(0.1)}
                    onValueChange={onDonationChange}
                  />
                </div>
                <Button className="w-12" onClick={incrementDonation}>
                  {"+"}
                </Button>
              </div>
              <span className="text-xs font-secondary my-2">
                {t("amount.pol")}
              </span>
            </div>

            {isComingSoon && (
              <Label type="default" className="mb-2">
                {t("coming.soon")}
              </Label>
            )}
          </div>
          <Button
            onClick={handleDonate}
            disabled={isComingSoon || donation.lessThan(0.1)}
          >
            <span className="whitespace-nowrap">{t("donate")}</span>
          </Button>
        </div>
      )}

      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <Loading className="my-2" text={t("donating")} />
        </div>
      )}

      {state.matches("confirming") && (
        <GameWallet action="donate">
          <div className="flex flex-col items-center">
            <p className="m-2">{`${formatNumber(donation)} POL`}</p>
            <Button onClick={handleDonate}>{t("confirm")}</Button>
          </div>
        </GameWallet>
      )}

      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-2">{t("statements.ohNo")}</p>
        </div>
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
