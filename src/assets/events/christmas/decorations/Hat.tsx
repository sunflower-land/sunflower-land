import React from "react";

import hat from "assets/decorations/hat.png";
import { easterEgg } from "lib/blockchain/EasterEgg";
import { wallet } from "lib/blockchain/wallet";
import Web3 from "web3";

interface Props {
  bumpkinId: number;
}
export const Hat: React.FC<Props> = ({ bumpkinId }) => {
  const onClick = () => {
    easterEgg({
      bumpkinId,
      web3: wallet.web3Provider as Web3,
      account: wallet.myAccount as string,
    });
  };
  return (
    <img
      src={hat}
      className="absolute cursor-pointer"
      onClick={onClick}
      style={{
        top: "1294px",
        left: "850px",
        width: "29px",
      }}
    />
  );
};
