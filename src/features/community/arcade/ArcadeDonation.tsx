import { CopyAddress } from "components/ui/CopyAddress";
import React from "react";
import { ARCADE_GAMES } from "../lib/constants";

export const ArcadeDonation: React.FC = () => {
  return (
    <div className="flex flex-col mb-1 p-2 text-sm">
      <p className="my-2">
        Thank you for donating! Kindly send MATIC (via wallet provider) to the
        address of the game that you like.
      </p>
      {Object.values(ARCADE_GAMES).map(({ title, donationAddress }) => (
        <div className="my-2" key={title}>
          <p className="underline">{title}</p>
          <CopyAddress address={donationAddress} />
        </div>
      ))}
    </div>
  );
};
