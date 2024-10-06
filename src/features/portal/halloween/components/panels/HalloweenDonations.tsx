import React, { useState } from "react";

import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { ITEM_DETAILS } from "features/game/types/images";
import { NumberInput } from "components/ui/NumberInput";
import Decimal from "decimal.js-light";
import { donate } from "features/portal/lib/portalUtil";

const CONTRIBUTORS = [""];

export const HalloweenDonations: React.FC = () => {
  const { t } = useAppTranslation();

  const [donation, setDonation] = useState(new Decimal(1));
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
    donate({
      matic: donation.toNumber(),
      address: CONFIG.PORTAL_DONATION_ADDRESS,
    });
  };

  // waiting confirmation for address
  const isComingSoon = false;

  return (
    <div className="flex flex-col mb-1 p-2 text-sm">
      <p className="mb-2 text-center">{t("halloween.donationDescription")}</p>

      <div className="flex flex-wrap mt-1 mb-4 gap-x-3 gap-y-1 justify-center">
        {CONTRIBUTORS.map((name) => (
          <Label key={name} type="chill" icon={ITEM_DETAILS["Tree"].image}>
            <span className="pl-1">{name}</span>
          </Label>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex">
          <Button className="w-12" onClick={decrementDonation}>
            {"-"}
          </Button>
          <div className="flex items-center w-24 mx-2 mt-1">
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
        <span className="text-xs font-secondary my-2">{t("amount.pol")}</span>
      </div>

      {isComingSoon && (
        <Label type="default" className="mb-2">
          {t("coming.soon")}
        </Label>
      )}

      <Button
        className="w-full ml-1"
        onClick={handleDonate}
        disabled={isComingSoon || donation.lessThan(0.1)}
      >
        <span className="whitespace-nowrap">{t("donate")}</span>
      </Button>
    </div>
  );
};
