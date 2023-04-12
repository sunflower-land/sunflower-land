import React, { useContext, useState } from "react";
import shuffle from "lodash.shuffle";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";

import { Context } from "../lib/Provider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineInterpreter } from "../lib/createFarmMachine";
import classNames from "classnames";
import { Loading } from "./Loading";
import Decimal from "decimal.js-light";
import { fromWei, toBN } from "web3-utils";
import { sequence } from "0xsequence";
import { OpenWalletIntent } from "@0xsequence/provider";
import { SEQUENCE_CONNECT_OPTIONS } from "../lib/sequence";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";

export const roundToOneDecimal = (number: number) =>
  Math.round(number * 10) / 10;

export enum CharityAddress {
  TheWaterProject = "0xBCf9bf2F0544252761BCA9c76Fe2aA18733C48db",
  PCF = "0x8c6A1870D922279dB6F91CB6798592c7A7133BBD",
}

interface Charity {
  name: string;
  info: string;
  url: string;
  address: CharityAddress;
}

const CHARITIES: Charity[] = shuffle([
  {
    name: "The Water Project",
    info: "Providing clean, safe and reliable water.",
    url: "https://thewaterproject.org/donate-ethereum",
    address: CharityAddress.TheWaterProject,
  },
  {
    name: "Purple Community Fund",
    info: "Strengthening communities and changing lives.",
    url: "https://www.p-c-f.org/",
    address: CharityAddress.PCF,
  },
]);

interface CharityDetailProps extends Charity {
  selected: boolean;
  onClick: () => void;
}

const CharityDetail = ({
  url,
  name,
  info,
  selected,
  onClick,
}: CharityDetailProps) => {
  return (
    <InnerPanel
      className={classNames(
        "flex flex-col items-center w-full justify-between",
        {
          "img-highlight": selected,
        }
      )}
    >
      <div className="w-full p-1 space-y-2 cursor-pointer" onClick={onClick}>
        <a
          href={url}
          className="underline text-xs hover:text-blue-500 mb-2 text-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
        <p className="text-xs mb-1">{info}</p>
      </div>
    </InnerPanel>
  );
};

export const CreateFarm: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const child = authService.state.children
    .createFarmMachine as MachineInterpreter;

  const [createFarmState] = useActor(child);

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [charity, setCharity] = useState<CharityAddress | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [screen, setScreen] = useState<"intro" | "create">("intro");

  const isLoading = createFarmState.matches("loading");
  const hasEnoughMatic = createFarmState.matches("hasEnoughMatic");
  const hasCharitySelected = charity !== null;

  if (isLoading) {
    return <Loading />;
  }

  const maticFee = fromWei(toBN(createFarmState.context.maticFee ?? 0));

  // $5 USD farm
  // 4% to cover gas fee of farm mint
  // 20% to cover first 5 syncs
  const maticFeePlusGas = new Decimal(maticFee)
    .mul(1.24)
    .toDecimalPlaces(2, Decimal.ROUND_UP);

  const onCaptchaSolved = async (token: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    authService.send("CREATE_FARM", {
      charityAddress: charity,
      donation: 10,
      captcha: token,
    });
  };

  const addFunds = async () => {
    // Temporarily link to sequence when adding funds. Until Wyre is ready.
    if (authState.context.user.web3?.wallet === "SEQUENCE") {
      const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "mumbai";

      const sequenceWallet = await sequence.initWallet(network);

      const intent: OpenWalletIntent = {
        type: "openWithOptions",
        options: SEQUENCE_CONNECT_OPTIONS,
      };

      const path = "wallet/add-funds";
      sequenceWallet.openWallet(path, intent);
    } else {
      window.open(
        "https://docs.sunflower-land.com/getting-started/web3-wallets#usdmatic",
        "_blank"
      );
    }

    // await onramp(
    //   {
    //     token: authService.state.context.rawToken as string,
    //     transactionId: randomID(),
    //   },
    //   () => setPaymentConfirmed(true)
    // );
  };

  if (showCaptcha) {
    return (
      <ReCAPTCHA
        sitekey={CONFIG.RECAPTCHA_SITEKEY}
        onChange={onCaptchaSolved}
        onExpired={() => setShowCaptcha(false)}
        className="w-full flex items-center justify-center min-h-[78px]"
      />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center mb-1">Getting Started</h1>
      <img
        src={CROP_LIFECYCLE.Sunflower.crop}
        className="my-1"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
        }}
      />
      {screen === "intro" && (
        <>
          <div className="flex flex-col space-y-2 text-xs p-2 pt-1 mb-2">
            <p>
              {`Sunflower Land is powered by the Polygon blockchain and requires
              Polygon's Matic token to play.`}
            </p>
            <p>
              {`Creating an account requires ${maticFeePlusGas.toNumber()} Matic (~$5 USD). 50 cents will
              be donated to a charity of your choice.`}
            </p>
            <p>You will also receive a free Bumpkin NFT (worth $5 USD).</p>
            <p>This Bumpkin will be your guide in Sunflower Land.</p>
          </div>
          <Button onClick={() => setScreen("create")}>Continue</Button>
        </>
      )}

      {screen === "create" && (
        <>
          <ol className="p-2 space-y-3 text-sm">
            <li>
              <div>
                <div className="flex space-x-1 mb-2 items-center">
                  {!hasEnoughMatic && <span>1.</span>}
                  {hasEnoughMatic && (
                    <img
                      src={SUNNYSIDE.icons.confirm}
                      style={{
                        width: `${PIXEL_SCALE * 6}px`,
                      }}
                    />
                  )}
                  <span>
                    Add Matic ({maticFeePlusGas.toNumber()} Matic required)
                  </span>
                </div>
                {!hasEnoughMatic && (
                  <>
                    <Button disabled={paymentConfirmed} onClick={addFunds}>
                      Buy Matic
                    </Button>
                    {paymentConfirmed && (
                      <p
                        className="text-xxs italic"
                        style={{ lineHeight: 1.1 }}
                      >
                        Waiting for crypto to be sent to your wallet. This
                        usually takes 20-30 seconds
                        <span className="loading2" />
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
            <li>
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-1 mb-1 items-center">
                  {!hasCharitySelected && <span>2.</span>}
                  {hasCharitySelected && (
                    <img
                      src={SUNNYSIDE.icons.confirm}
                      style={{
                        width: `${PIXEL_SCALE * 6}px`,
                      }}
                    />
                  )}
                  <span>Pick your charity</span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-evenly">
                  {CHARITIES.map((_charity) => (
                    <CharityDetail
                      {..._charity}
                      selected={charity === _charity.address}
                      onClick={() => setCharity(_charity.address)}
                      key={_charity.address}
                    />
                  ))}
                </div>
              </div>
            </li>

            <li>
              <div className="flex flex-col space-y-2">
                <span>3. Create your account</span>
                <Button
                  disabled={!hasEnoughMatic || !hasCharitySelected}
                  onClick={() => setShowCaptcha(true)}
                >
                  Start your adventure!
                </Button>
              </div>
            </li>
          </ol>
        </>
      )}
    </div>
  );
};
