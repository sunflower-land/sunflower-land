import React, { useContext, useRef, useState } from "react";
import shuffle from "lodash.shuffle";

import { Button } from "components/ui/Button";
import { InnerPanel, Panel } from "components/ui/Panel";

import { Context } from "../lib/Provider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineInterpreter } from "../lib/createFarmMachine";
import classNames from "classnames";
import { Loading } from "./Loading";
import Decimal from "decimal.js-light";
import { fromWei, toBN } from "web3-utils";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "react-bootstrap";
import { AddMATIC } from "features/island/hud/components/AddMATIC";

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

  const charity = useRef(
    CHARITIES[Math.floor(Math.random() * CHARITIES.length)]
  );
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [screen, setScreen] = useState<"intro" | "create">("intro");
  const [showAddFunds, setShowAddFunds] = useState(false);

  const isLoading = createFarmState.matches("loading");
  const hasEnoughMatic = createFarmState.matches("hasEnoughMatic");

  if (isLoading) {
    return (
      <div className="h-32">
        <Loading />
      </div>
    );
  }

  const maticFee = fromWei(toBN(createFarmState.context.maticFee ?? 0));

  // $5 USD farm
  // 4% to cover gas fee of farm mint
  // 20% to cover first 5 syncs
  const maticFeePlusGas = new Decimal(maticFee)
    .mul(1.24)
    .toDecimalPlaces(2, Decimal.ROUND_UP);

  const addFunds = async () => setShowAddFunds(true);

  return (
    <>
      <div className="flex flex-col p-2">
        <p className="text-sm mb-2">
          {`To mint NFTs and claim your starter pack, you'll need MATIC tokens.`}
        </p>
        {!hasEnoughMatic && (
          <p className="text-sm mb-2">
            {`Don't worry if you don't have any yet. We offer an easy way to buy
                MATIC tokens directly within the game.`}
          </p>
        )}

        <ol className="space-y-3 text-sm">
          <li>
            <div>
              <div className="flex space-x-1 mb-2 items-center">
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
                    <p className="text-xxs italic" style={{ lineHeight: 1.1 }}>
                      Waiting for crypto to be sent to your wallet. This usually
                      takes 20-30 seconds
                      <span className="loading2" />
                    </p>
                  )}
                </>
              )}
            </div>
          </li>
        </ol>
      </div>

      <Modal show={showAddFunds} onHide={() => setShowAddFunds(false)} centered>
        <Panel>
          <AddMATIC onClose={() => setShowAddFunds(false)} />
        </Panel>
      </Modal>
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
      </Button>
    </>
  );
};
