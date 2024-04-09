import React, { useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { roundToOneDecimal } from "features/auth/components";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const CONTRIBUTORS = [
  "JC",
  "Kotob",
  "whaitte",
  "Ventin",
  "shinon",
  "PurpleDvrnk",
  "SFWhat",
  "Andand0",
  "Telk",
  "Neonlight",
  "Vergel",
  "Netherzapdos",
  "LittleEins",
  "Poro",
  "Mr Findlay",
  "default",
];

export const Donations: React.FC = () => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);
  const [donation, setDonation] = useState(1);
  const CHRISTMAS_EVENT_DONATION_ADDRESS = CONFIG.CHRISTMAS_EVENT_DONATION;
  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(roundToOneDecimal(Number(e.target.value)));
  };
  const incrementDonation = () => {
    setDonation((prevState) => roundToOneDecimal(prevState + 0.1));
  };

  const decrementDonation = () => {
    if (donation === 0.2) {
      setDonation(0.2);
    } else if (donation < 0.2) {
      setDonation(0.1);
    } else setDonation((prevState) => roundToOneDecimal(prevState - 0.1));
  };

  const donate = () => {
    send("DONATE", {
      donation,
      to: CHRISTMAS_EVENT_DONATION_ADDRESS,
    });
  };

  // Waiting confirmation for address
  const isComingSoon = false;

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col mb-1 p-2 text-sm">
          <p className="mb-2 text-center">{t("donation.one")}</p>

          <div className="flex flex-wrap mt-1 mb-2 justify-center">
            {CONTRIBUTORS.map((name) => (
              <Label
                key={name}
                type="chill"
                icon={SUNNYSIDE.icons.heart}
                className="mr-3 mb-1"
              >
                {name}
              </Label>
            ))}
          </div>
          <div className="flex flex-col items-center">
            <div className="flex">
              <input
                type="number"
                className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-1 text-center"
                step="0.1"
                min={0.1}
                value={donation}
                required
                onChange={onDonationChange}
                onBlur={() => {
                  if (donation < 0.1) setDonation(0.1);
                }}
              />
              <div className="flex flex-col justify-between">
                <img
                  src={SUNNYSIDE.icons.arrow_up}
                  alt="increment donation value"
                  className="cursor-pointer"
                  onClick={incrementDonation}
                />
                <img
                  src={SUNNYSIDE.icons.arrow_down}
                  alt="decrement donation value"
                  className="cursor-pointer"
                  onClick={decrementDonation}
                />
              </div>
            </div>
            <span className="text-xs text-shadow my-2">
              {t("amount.matic")}
            </span>
          </div>

          {isComingSoon && (
            <Label type="default" className="mb-2">
              {t("coming.soon")}
            </Label>
          )}

          <Button
            className="w-full ml-1"
            onClick={donate}
            disabled={isComingSoon || donation < 0.1}
          >
            <span className="text-xs whitespace-nowrap">{t("donate")}</span>
          </Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <p className="loading mb-4">{t("donating")}</p>
        </div>
      )}
      {state.matches("donated") && (
        <div className="flex flex-col items-center">
          <p className="mb-4">{t("thank.you")}</p>
        </div>
      )}
      {state.matches("error") && (
        <div className="flex flex-col items-center">
          <p className="my-4">{t("statements.ohNo")}</p>
        </div>
      )}
      {state.matches("confirming") && (
        <GameWallet action="donate">
          <p className="m-2">{`${donation} (MATIC)`}</p>
          <Button className="w-full ml-1" onClick={donate}>
            <span className="text-xs whitespace-nowrap">{t("confirm")}</span>
          </Button>
        </GameWallet>
      )}
    </>
  );
};
