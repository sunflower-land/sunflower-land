import React, { useContext, useState } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { CharityAddress, Donation } from "./Donation";

export const CreateFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [showDonation, setShowDonation] = useState(false);

  const create = async (charityAddress: CharityAddress, donation: number) => {
    setShowDonation(false);
    authService.send("CREATE_FARM", { charityAddress, donation });
  };

  const explore = () => {
    authService.send("EXPLORE");
  };

  if (showDonation) return <Donation onDonate={create} />;

  return (
    <>
      <Button
        onClick={() => setShowDonation(true)}
        className="overflow-hidden mb-2"
      >
        Create a farm
      </Button>
      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
