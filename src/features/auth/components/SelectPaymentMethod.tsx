import React, { useContext } from "react";
import { Context } from "../lib/Provider";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { OuterPanel } from "components/ui/Panel";

import creditCard from "assets/icons/credit_card.png";
import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

export const SelectPaymentMethod: React.FC = () => {
  const { authService } = useContext(Context);

  return (
    <>
      <div className="flex flex-col w-full items-center space-y-1 pb-2 px-2 text-sm">
        <div className="flex w-full">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="cursor-pointer"
            onClick={() => authService.send("BACK")}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="flex items-center justify-center text-center flex-grow">
            <p className="mb-1">Select a payment method</p>
          </div>
          <div
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <p className="mr-2 mb-1">{`Total: $2.99 USD`}</p>
      </div>
      <div className="flex flex-col flex-grow items-stretch justify-around mx-3 space-y-2 sm:space-y-0 sm:space-x-5 sm:flex-row">
        <OuterPanel className="w-full flex flex-col items-center relative">
          <div className="flex w-full items-center justify-center py-4 px-2">
            <p className="mr-2 mb-1 text-xs">Cash / Card</p>
            <img
              src={creditCard}
              style={{
                height: `${PIXEL_SCALE * 13}px`,
              }}
            />
          </div>
          <Label type="info" className="mb-1">
            Temporarily Disabled
          </Label>
          <Button
            onClick={() => authService.send("SELECT_POKO")}
            disabled={true}
          >
            Pay with Cash
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
          <Button onClick={() => authService.send("SELECT_MATIC")}>
            Pay with Matic
          </Button>
        </OuterPanel>
      </div>

      <p className="text-xxs italic text-center py-2">
        *Prices exclude transaction fees.
      </p>
    </>
  );
};
