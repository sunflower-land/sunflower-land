import React, { ChangeEvent, useState } from "react";

import { donationMachine } from "features/community/merchant/lib/donationMachine";
import { useMachine } from "@xstate/react";
import { Loading } from "features/auth/components";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const VALID_INTEGER = new RegExp(/^\d+$/);
const VALID_FOUR_DECIMAL_NUMBER = new RegExp(/^\d*(\.\d{0,4})?$/);
const INPUT_MAX_CHAR = 10;
const MAX_NON_VIP_LISTINGS = 1;
const MAX_SFL = 150;

import walletIcon from "assets/icons/wallet.png";
import classNames from "classnames";
import { setPrecision } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";

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

export const CommunityDonations: React.FC = () => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);
  const [donation, setDonation] = useState(new Decimal(1));
  const CHRISTMAS_EVENT_DONATION_ADDRESS = CONFIG.CHRISTMAS_EVENT_DONATION;
  const onDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If keyboard input "" convert to 0
    // Typed input validation will happen in onBlur
    setDonation(setPrecision(Number(e.target.value), 1));
  };
  const incrementDonation = () => {
    setDonation((prevState) => setPrecision(prevState.add(0.1), 1));
  };

  const decrementDonation = () => {
    if (donation.lessThan(0.1)) {
      setDonation(new Decimal(0.1));
    } else setDonation((prevState) => setPrecision(prevState.minus(0.1), 1));
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
                value={donation.toNumber()}
                required
                onChange={onDonationChange}
                onBlur={() => {
                  if (donation.lessThan(0.1)) setDonation(new Decimal(0.1));
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
            <span className="text-xs font-secondary my-2">
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
            disabled={isComingSoon || donation.lessThan(0.1)}
          >
            <span className="text-xs whitespace-nowrap">{t("donate")}</span>
          </Button>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <Loading className="mb-4" text={t("donating")} />
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

/**
 * A wallet address managed by the donatee in Porto Alegre
 * Funds will be converted to FIAT and distributed
 */
const RS_DONATEE_WALLET = "0x0BFa1450E49B3ad61F9Cc30E37ace13F5aF8ae61";

export const SpecialEventDonations: React.FC = () => {
  const { t } = useAppTranslation();

  const [state, send] = useMachine(donationMachine);
  const [quantityDisplay, setQuantityDisplay] = useState("1");

  const donation = Number(quantityDisplay);

  const donate = () => {
    send("DONATE", {
      donation,
      to: RS_DONATEE_WALLET,
    });
  };

  return (
    <>
      {state.matches("idle") && (
        <div className="flex flex-col mb-1 p-2 text-sm">
          <Label icon={SUNNYSIDE.icons.heart} type="chill" className="mb-2">
            {t("donation.specialEvent")}
          </Label>

          <p className="mb-2 text-sm">{t("donation.rioGrandeDoSul.one")}</p>

          <p className="mb-3 text-sm">{t("donation.rioGrandeDoSul.two")}</p>

          <div className="flex justify-between items-center mb-2">
            <Label type="default" icon={walletIcon}>
              {t("donation.matic")}
            </Label>
            {donation < 1 && (
              <Label type="danger">{t("donation.minimum")}</Label>
            )}
          </div>

          <input
            style={{
              boxShadow: "#b96e50 0px 1px 1px 1px inset",
              border: "2px solid #ead4aa",
            }}
            type="number"
            placeholder="1"
            min={1}
            value={quantityDisplay}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // Strip the leading zero from numbers
              if (
                /^0+(?!\.)/.test(e.target.value) &&
                e.target.value.length > 1
              ) {
                e.target.value = e.target.value.replace(/^0/, "");
              }

              if (e.target.value === "") {
                setQuantityDisplay(""); // Reset to 0 if input is empty
              } else if (VALID_INTEGER.test(e.target.value)) {
                const amount = e.target.value.slice(0, INPUT_MAX_CHAR);
                setQuantityDisplay(amount);
              }
            }}
            className={classNames(
              "mb-2 text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10 placeholder-error",
            )}
          />

          <Button
            className="w-full mb-1"
            onClick={donate}
            disabled={donation < 0.1}
          >
            <span className="text-xs whitespace-nowrap">{t("donate")}</span>
          </Button>
          <p className="text-xxs italic text-center">{t("donation.airdrop")}</p>
        </div>
      )}
      {state.matches("donating") && (
        <div className="flex flex-col items-center">
          <Loading className=" mb-4" text={t("donating")} />
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
