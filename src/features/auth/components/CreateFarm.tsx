import React, { useContext, useState } from "react";
import { Carousel, CarouselItem } from "react-bootstrap";
import shuffle from "lodash.shuffle";
import ReCAPTCHA from "react-google-recaptcha";

import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";

import leftArrow from "assets/icons/arrow_left.png";
import rightArrow from "assets/icons/arrow_right.png";
import confirm from "assets/icons/confirm.png";

import { Context } from "../lib/Provider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineInterpreter } from "../lib/createFarmMachine";
import { onramp } from "../actions/onramp";
import { randomID } from "lib/utils/random";
import classNames from "classnames";

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

const CharityDetail = ({
  url,
  name,
  info,
  selected,
}: Charity & { selected: boolean }) => {
  return (
    <InnerPanel
      className={classNames(
        "flex-col inline-flex items-center justify-center w-full",
        { "img-highlight": selected }
      )}
    >
      <div className="flex flex-col items-center whitespace-normal w-full">
        <h5 className="text-xs underline mb-3 text-center">{name}</h5>
        <p className="text-xxs mb-1">{info}</p>
      </div>

      <div className="flex w-full z-10">
        {/* <Button
          className="w-full"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onAboutClick(url), e.preventDefault();
          }}
        >
          <span className="text-xs">About</span>
        </Button> */}
      </div>
    </InnerPanel>
  );
};

export const CreateFarm: React.FC = () => {
  const [activeIdx, setActiveIndex] = useState(0);
  const { authService } = useContext(Context);

  const child = authService.state.children
    .createFarmMachine as MachineInterpreter;

  const [createFarmState] = useActor(child);

  const [showCaptcha, setShowCaptcha] = useState(false);
  const [charity, setCharity] = useState<CharityAddress | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const onCaptchaSolved = async (token: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));

    authService.send("CREATE_FARM", {
      charityAddress: charity,
      donation: 10,
      captcha: token,
    });
  };

  const onDonateAndPlayClick = (charityAddress: CharityAddress) => {
    setCharity(charityAddress);
    setShowCaptcha(true);
  };

  const updateActiveIndex = (newIdx: number) => {
    if (newIdx < 0) {
      setActiveIndex(0);
    }

    if (newIdx > CHARITIES.length - 1) {
      setActiveIndex(CHARITIES.length - 1);
      return;
    }

    setActiveIndex(newIdx);
  };

  const addFunds = async () => {
    const env = CONFIG.NETWORK === "mainnet" ? "prod" : "test";

    const { reservation } = await onramp({
      token: authService.state.context.rawToken as string,
      transactionId: randomID(),
    });

    const wyre = new (window as any).Wyre({
      env,
      reservation,
      operation: {
        type: "debitcard-hosted-dialog",
      },
    });

    wyre.on("paymentSuccess", (event: any) => {
      setPaymentConfirmed(true);
    });

    wyre.open();
  };

  if (showCaptcha) {
    return (
      <ReCAPTCHA
        sitekey={CONFIG.RECAPTCHA_SITEKEY}
        onChange={onCaptchaSolved}
        onExpired={() => setShowCaptcha(false)}
        className="w-full m-4 flex items-center justify-center"
      />
    );
  }

  return (
    <div>
      <h1 className="text-center">Getting Started</h1>
      <div className="flex flex-col space-y-2 text-xs p-2 mb-3">
        <p>
          Buying land costs $5 USD. Included with your purchase is a Bumpkin NFT
          (worth $5 USD) who will be your guide in Sunflower Land.
        </p>
        <p>50 cents will be donated to a charity of your choice.</p>
      </div>
      <div className="text-xs">
        <ol className="p-2 space-y-2">
          <li>
            <div>
              <div className="flex space-x-1 mb-2 items-center">
                {createFarmState.matches("notEnoughMatic") && <span>1.</span>}
                {createFarmState.matches("hasEnoughMatic") && (
                  <img
                    src={confirm}
                    style={{
                      width: `${PIXEL_SCALE * 6}px`,
                    }}
                  />
                )}
                <span>Add Funds (We recommend $10 USD)</span>
              </div>
              {createFarmState.matches("notEnoughMatic") && (
                <Button disabled={paymentConfirmed} onClick={addFunds}>
                  Buy Matic
                </Button>
              )}
            </div>
          </li>
          {createFarmState.matches("hasEnoughMatic") && (
            <li>
              <div className="flex flex-col space-y-2">
                <p>2. Pick your charity</p>
                <div className="flex space-x-2">
                  {CHARITIES.map((_charity) => (
                    <div
                      key={_charity.address}
                      onClick={() => setCharity(_charity.address)}
                    >
                      <CharityDetail
                        {..._charity}
                        selected={charity === _charity.address}
                      />
                    </div>

                    // <button
                    //   key={charity.address}
                    //   onClick={() => setCharity(charity.address)}
                    // >
                    //   {charity.name}
                    // </button>
                  ))}
                </div>
              </div>
            </li>
          )}
          <li>
            {createFarmState.matches("hasEnoughMatic") && charity !== null && (
              <Button onClick={() => setShowCaptcha(true)}>Create Farm</Button>
            )}
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <form className="mb-4 relative">
      <div className="flex flex-col items-center">
        <h2 className="text-base mb-2">$5 USD to play</h2>
        <p className="text-xs mb-3 text-center">
          To play Sunflower Land, you first need to mint an Account NFT for $5
          USD (paid in MATIC)
        </p>
        <p className="text-xs mb-3 text-center">
          10% of this fee will be donated to a charity of your choice.
        </p>
      </div>
      <p className="text-center mb-3 mt-10">Select a charity</p>
      <Carousel
        activeIndex={activeIdx}
        onSelect={updateActiveIndex}
        prevIcon={
          <img
            src={leftArrow}
            alt="left-arrow"
            className="absolute cursor-pointer"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
            onClick={() => updateActiveIndex(activeIdx - 1)}
          />
        }
        nextIcon={
          <img
            src={rightArrow}
            alt="right-arrow"
            className="absolute cursor-pointer"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
            onClick={() => updateActiveIndex(activeIdx + 1)}
          />
        }
      >
        {CHARITIES.map((props: Charity) => (
          <CarouselItem key={props.url}>
            <CharityDetail
              {...props}
              onDonateAndPlayClick={onDonateAndPlayClick}
            />
          </CarouselItem>
        ))}
      </Carousel>
    </form>
  );
};
