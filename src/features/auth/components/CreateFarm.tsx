import React, { useContext, useRef, useState } from "react";
import shuffle from "lodash.shuffle";

import { Button } from "components/ui/Button";
import { InnerPanel, OuterPanel } from "components/ui/Panel";

import { Context } from "../lib/Provider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Loading } from "./Loading";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import maticToken from "assets/icons/polygon-token.png";
import card from "assets/icons/credit_card.png";

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

  const [showHowTo, setShowHowTo] = useState(false);

  // const child = authService.state.children
  //   .createFarmMachine as MachineInterpreter;

  // const [createFarmState] = useActor(child);

  const charity = useRef(
    CHARITIES[Math.floor(Math.random() * CHARITIES.length)]
  );
  const [paymentConfirmed] = useState(false);
  const [screen, setScreen] = useState<"intro" | "create">("intro");
  const [showAddFunds, setShowAddFunds] = useState(false);

  // const isLoading = createFarmState.matches("loading");
  // const hasEnoughMatic = createFarmState.matches("hasEnoughMatic");

  const isLoading = false;
  const hasEnoughMatic = false;

  if (isLoading) {
    return (
      <div className="h-32">
        <Loading />
      </div>
    );
  }

  // const maticFee = fromWei(toBN(createFarmState.context.maticFee ?? 0));
  const maticFee = "0.09";

  // $5 USD farm
  // 4% to cover gas fee of farm mint
  // 20% to cover first 5 syncs
  const maticFeePlusGas = new Decimal(maticFee)
    .mul(1.24)
    .toDecimalPlaces(2, Decimal.ROUND_UP);

  const addFunds = async () => setShowAddFunds(true);

  return (
    <div className="p-1">
      <div className="flex flex-col">
        <p className="text-sm mb-2">
          {`To create an NFT, a network fee is required to secure it on the Blockchain.`}
        </p>
      </div>
      <div className="flex space-x-1 mb-2 items-center">
        <p className="text-xxs">Estimated fee:</p>
        <img
          src={maticToken}
          style={{
            width: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <span className="text-xxs">{maticFeePlusGas.toNumber()} Matic</span>
        <span className="text-xxs italic">($0.10 USD)</span>
      </div>
      <div className="flex flex-col flex-grow items-stretch justify-around space-y-2 sm:space-y-0 sm:space-x-3 sm:flex-row">
        <OuterPanel className="w-full md:w-1/2 flex flex-col items-center relative">
          <div className="flex w-full h-full items-center justify-center px-2">
            <p className="mr-2 mb-1 text-xs">Matic</p>
            <img
              src={maticToken}
              style={{
                height: `${PIXEL_SCALE * 13}px`,
                imageRendering: "pixelated",
              }}
            />
          </div>
          <Button
            className="mb-1"
            onClick={() => authService.send("SELECT_MATIC")}
          >
            Mint
          </Button>
          <a
            href="https://docs.sunflower-land.com/getting-started/how-to-start#step-2-fund-your-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white text-xxs text-center mb-1"
          >
            How do I get MATIC?
          </a>
        </OuterPanel>
        <OuterPanel className="w-full md:w-1/2 flex flex-col items-center relative">
          <div className="flex w-full h-full items-center justify-center py-2 px-2">
            <p className="mr-2 mb-1 text-xs">Card/Cash</p>
            <img
              src={card}
              style={{
                height: `${PIXEL_SCALE * 13}px`,
                imageRendering: "pixelated",
              }}
            />
          </div>
          <Button
            className="mb-1"
            onClick={() => authService.send("SELECT_MATIC")}
          >
            Pay with Card/Cash
          </Button>
          <span className="text-xxs mb-1">*Credit card fees apply</span>
        </OuterPanel>
      </div>
      <div>
        <div className="flex items-center w-full my-1">
          <img src={SUNNYSIDE.icons.heart} className="h-5 mr-1" />
          <p className="text-xs">Short on cash?</p>
        </div>
        <p className="text-xs">
          <a
            href="https://docs.sunflower-land.com/getting-started/how-to-start#step-2-fund-your-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white text-xxs text-center"
          >
            Fill in your details
          </a>{" "}
          and we will send a free NFT to play.
        </p>
      </div>

      {/* {!hasEnoughMatic && (
        <Button className="mb-2" onClick={() => setShowHowTo(true)}>
          How do I get $MATIC?
        </Button>
      )}
      <Button
        disabled={!hasEnoughMatic}
        onClick={() => {
          authService.send("CREATE_FARM", {
            charityAddress: charity.current.address,
            donation: 10,
            captcha: "0x",
          });
        }}
      >
        Start your adventure!
      </Button> */}
    </div>
  );
};
