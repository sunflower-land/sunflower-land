import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import ticket from "assets/icons/block_buck_detailed.png";
import creditCard from "assets/icons/credit_card.png";
import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";
import { MachineState } from "features/game/lib/gameMachine";

const API_URL = CONFIG.API_URL;

interface PaypalProps {
  amount: number;
  farmId: number;
}

// These selectors return primitives, class instances can cause re-renders
const selectFarmId = (gameState: MachineState) => gameState.context.state.id;
const selectBlockBucks = (gameState: MachineState) =>
  (
    gameState.context.state.inventory["Block Buck"] ?? new Decimal(0)
  ).toNumber();

interface Props {
  onClose: () => void;
}
export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, selectFarmId);
  const count = useSelector(gameService, selectBlockBucks);
  const [amount, setAmount] = useState<1 | 5 | undefined>(undefined);
  const [purchasing, setPurchasing] = useState<boolean>(false);

  useEffect(() => {
    gameService.send("SAVE");
  }, []);

  const canBuyMore = count === 0;

  const onCreditCardBuy = (amount: 1 | 5) => {
    setPurchasing(true);
  };

  const onMaticBuy = (amount: 1 | 5) => {
    gameService.send("SYNC", { captcha: "", blockBucks: amount });
    onClose();
  };

  const clearPurchase = () => {
    setAmount(undefined);
    setPurchasing(false);
  };

  const onBack = amount ? () => clearPurchase() : undefined;
  const title = amount ? "Confirm Purchase" : "Buy Block Bucks";

  const Content = () => {
    if (purchasing) {
      return (
        <PayPalScriptProvider
          options={{
            "client-id":
              "AcRTiAwOgs-9_UTDuM9PBLBLCJNa3Kn8HWa_rxWOD_fkGlKkDrlSG4sa0B-41QMtwF7VBGMWLr41ZfAD",
          }}
        >
          <div className="p-2 bg-white rounded">
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                async function createOrder() {
                  const response = await window.fetch(
                    `${API_URL}/payments/createOrder`,
                    {
                      method: "POST",
                      headers: {
                        "content-type": "application/json;charset=UTF-8",
                        "X-Transaction-ID": randomID(),
                      },
                      body: JSON.stringify({
                        paymentMethod: data.paymentSource,
                        purchase: {
                          type: "BLOCK_BUCKS",
                          amount,
                          farmId,
                        },
                      }),
                    }
                  );

                  const { orderId } = await response.json();

                  return orderId;
                }

                return createOrder();
              }}
              onApprove={(data, actions) => {
                return (
                  actions.order?.capture().then((details) => {
                    alert(
                      "Transaction completed by " +
                        details?.payer?.name?.given_name
                    );
                  }) ?? Promise.resolve()
                );
              }}
            />
          </div>
        </PayPalScriptProvider>
      );
    }

    if (amount) {
      const total = amount === 5 ? "$0.75" : "$0.10";

      return (
        <>
          <div className="flex flex-col w-full items-center space-y-1 pb-2 px-2">
            <div className="flex items-center">
              <p className="mr-2 mb-1">Item: {amount} x</p>
              <img
                src={ticket}
                style={{
                  height: `${PIXEL_SCALE * 13}px`,
                }}
              />
            </div>
            <p className="mr-2 mb-1">{`Total: ${total} USD`}</p>
          </div>
          <div className="flex flex-grow items-stretch justify-around mx-3 space-x-5">
            <OuterPanel className="w-full flex flex-col items-center relative">
              <div className="flex w-full items-center justify-center py-4 px-2">
                <p className="mr-2 mb-1 text-xs">Credit / Debit Card</p>
                <img
                  src={creditCard}
                  style={{
                    height: `${PIXEL_SCALE * 13}px`,
                  }}
                />
              </div>
              <Button
                disabled={!canBuyMore}
                onClick={() => onCreditCardBuy(amount)}
              >
                Pay with Card
              </Button>
            </OuterPanel>
            <OuterPanel className="w-full flex flex-col items-center relative">
              <div className="flex w-full h-full items-center justify-center py-4 px-2">
                <p className="mr-2 mb-1 text-xs">Matic</p>
                <img
                  src={matic}
                  style={{
                    height: `${PIXEL_SCALE * 13}px`,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
              <Button disabled={!canBuyMore} onClick={() => onMaticBuy(amount)}>
                Pay with Matic
              </Button>
            </OuterPanel>
          </div>

          <p className="text-xs text-center pt-2">
            Game progress will be stored on Blockchain.
          </p>
          <p className="text-xxs italic text-center py-2">
            *Prices exclude Blockchain transaction fees.
          </p>
        </>
      );
    }

    return (
      <>
        {!canBuyMore && (
          <p className="text-xs text-center mb-4 leading-none">
            {`You have ${count} Block Bucks. You must use these before purchasing more.`}
          </p>
        )}

        <div className="flex justify-around mx-3 space-x-5">
          <OuterPanel className="w-full h-full flex flex-col items-center relative">
            <div className="flex w-full items-center justify-center py-4 px-2">
              <p className="mr-2 mb-1">1 x</p>
              <img
                src={ticket}
                style={{
                  width: `${PIXEL_SCALE * 19}px`,
                }}
              />
            </div>
            <Button disabled={!canBuyMore} onClick={() => setAmount(1)}>
              $0.10 USD
            </Button>
          </OuterPanel>
          <OuterPanel className="w-full h-full flex flex-col items-center relative">
            <div className="h-10 absolute" style={{ top: "-20px" }}>
              <Label type="info">Recommended</Label>
            </div>
            <div className="flex w-full items-center justify-center py-4 px-2">
              <p className="mr-2 mb-1">5 x</p>
              <img
                src={ticket}
                style={{
                  width: `${PIXEL_SCALE * 19}px`,
                }}
              />
            </div>
            <Button disabled={!canBuyMore} onClick={() => setAmount(5)}>
              $0.75 USD
            </Button>
          </OuterPanel>
        </div>

        <p className="text-xs text-center pt-2">
          Game progress will be stored on Blockchain.
        </p>
        <p className="text-xxs italic text-center py-2">
          *Prices exclude Blockchain transaction fees.
        </p>
      </>
    );
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      onBack={onBack}
      title={title}
      bumpkinParts={{
        body: "Light Brown Farmer Potion",
        hair: "White Long Hair",
        shirt: "Fancy Top",
        pants: "Fancy Pants",
        tool: "Farmer Pitchfork",
      }}
    >
      <Content />
    </CloseButtonPanel>
  );
};
