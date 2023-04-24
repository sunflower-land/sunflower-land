import React, { useEffect } from "react";

import { widget } from "@pokopayment/widget";

export const AddMATIC: React.FC = () => {
  useEffect(() => {
    widget(
      "#poko-wrapper",
      "e90e93aa-aee4-4ab7-9b0a-301d69a5f64f",
      "staging", // staging, production
      {
        receiveWalletAddress: "0x1F3E6858Afa753a4E3939b441CdbCf9cD0a846ad", // required
        fiat: "USD",
        crypto: "MATIC-polygon",
        fiatAmount: 10,
        userData: {
          userId: "123", // required
        },
      }
    );
  }, []);

  return <div id="poko-wrapper" />;
};
