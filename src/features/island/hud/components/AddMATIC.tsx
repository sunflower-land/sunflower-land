import React from "react";

import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AddMATIC: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const pokoUrl =
    CONFIG.NETWORK === "mumbai"
      ? "https://stg.onramp.pokoapp.xyz"
      : "https://onramp.pokoapp.xyz";
  const crypto = "MATIC-polygon";
  const cryptoAmount = 10;

  return (
    <>
      <div className="flex text-center">
        <div
          className="flex-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />

        <div className="grow mb-3 text-lg">Add Matic</div>
        <div className="flex-none">
          <img
            src={SUNNYSIDE.icons.close}
            className="cursor-pointer"
            onClick={onClose}
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
      </div>
      <iframe
        src={`${pokoUrl}?crypto=${crypto}&cryptoAmount=${cryptoAmount}&receiveWalletAddress=${wallet.myAccount}&userId=${wallet.myAccount}&apiKey=${CONFIG.POKO_API_KEY}&cryptoList=${crypto}`}
        height="650px"
        className="w-full"
        title="Poko widget"
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </>
  );
};
