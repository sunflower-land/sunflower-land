import React from "react";

import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
  crypto: "MATIC-polygon" | "SFL-polygon";
}

export const PokoOnRamp: React.FC<Props> = ({ onClose, crypto }) => {
  const pokoUrl =
    CONFIG.NETWORK === "amoy"
      ? "https://stg.onramp.pokoapp.xyz"
      : "https://onramp.pokoapp.xyz";
  const cryptoAmount = crypto === "MATIC-polygon" ? 10 : 100;
  const fiatList = crypto === "SFL-polygon" ? "BRL,PHP,INR" : undefined;
  const title = crypto === "SFL-polygon" ? "Add SFL" : "Add SFL";

  return (
    <>
      <div className="flex text-center">
        <div
          className="flex-none"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />

        <div className="grow mb-3 text-lg">{title}</div>
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
        src={`${pokoUrl}?crypto=${crypto}&cryptoAmount=${cryptoAmount}&receiveWalletAddress=${
          wallet.myAccount
        }&userId=${wallet.myAccount}&apiKey=${
          CONFIG.POKO_API_KEY
        }&cryptoList=${crypto}${fiatList ? `&fiatList=${fiatList}` : ""}`}
        height="650px"
        className="w-full"
        title="Poko widget"
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </>
  );
};
