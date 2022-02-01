import React, { useContext, useState } from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

import * as Auth from "features/auth/lib/Provider";
import { shortAddress } from "features/hud/components/Address";
import { Farm } from "./Welcome";
import Modal from "react-bootstrap/esm/Modal";
import { CharityAddress, Donation } from "./Donation";
import { useActor } from "@xstate/react";

export const CreateFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [showDonation, setShowDonation] = useState(false);

  const create = async (charityAddress: CharityAddress, donation: number) => {
    setShowDonation(false);
    authService.send("CREATING_FARM", { charityAddress, donation });
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
      <Button onClick={() => {}} disabled className="overflow-hidden">
        Explore a friend's farm
      </Button>
    </>
  );
};
