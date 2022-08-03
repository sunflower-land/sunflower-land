import { metamask } from "lib/blockchain/metamask";
import React, { useEffect, useState } from "react";

export const SupplyReached: React.FC = () => {
  const [supply, setSupply] = useState<number>();

  useEffect(() => {
    const load = async () => {
      const amount = await metamask.getFarm().getTotalSupply();

      setSupply(amount);
    };

    load();
  }, []);

  if (!supply) {
    return (
      <div className="flex flex-col text-center text-shadow items-center p-1">
        <p className="loading">Loading</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <p className="text-center text-xl">{supply}</p>
      <p className="text-center mb-3">Supply reached!</p>

      <p className="text-center mb-4 text-xs">
        {`We are currently in Beta and all of the spots are currently taken. We will be opening more spots soon, join us on Twitter and Discord to hear more.`}
      </p>
    </div>
  );
};
