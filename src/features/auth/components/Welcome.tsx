import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import Modal from "react-bootstrap/Modal";

import * as Auth from "features/auth/lib/Provider";

import { Panel } from "components/ui/Panel";
import { CharityAddress, Donation } from "./Donation";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import { createFarm } from "../actions/createFarm";

import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import curly from "assets/npcs/curly_hair.png";

type Farm = {
  id: number;
  sessionId: string;
  address: string;
};

export const Welcome: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const [isLoading, setIsLoading] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [farm, setFarm] = useState<Farm>();

  useEffect(() => {
    const load = async () => {
      const farmAccounts = await metamask.getFarm()?.getFarms();
      if (farmAccounts?.length === 0) {
        setIsLoading(false);
        return;
      }

      console.log({ farmAccounts });

      // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
      const farmAccount = farmAccounts[0];

      const sessionId = await metamask
        .getSunflowerLand()
        .getSessionId(farmAccount.tokenId);

      setIsLoading(false);
      setFarm({
        id: farmAccount.tokenId,
        sessionId,
        address: farmAccount.account,
      });
    };

    load();
  }, []);

  const start = () => {
    authService.send("START", {
      farmId: farm?.id,
      sessionId: farm?.sessionId,
    });
  };

  const create = async (charityAddress: CharityAddress, donation: number) => {
    await createFarm(charityAddress, donation);
    send("FARM_CREATED");
  };

  const donate = async (charityAddress: CharityAddress, donation: number) => {
    // TODO: implement donation logic
    setShowDonation(false);
    await create(charityAddress, donation);
  };

  return (
    <div className="relative">
      <div className="relative w-full h-full">
        <img
          id="curly"
          src={curly}
          className="absolute w-54 -top-1 right-4 -z-10 scale-[4]"
        />
      </div>
      <img src={jumpingGoblin} className="absolute w-52 -top-11 -z-10" />
      <Panel className="p-1 mt-10">
        {isLoading && (
          <span className="text-shadow">Loading your farms...</span>
        )}
        {!isLoading && (
          <div className="p-1">
            {farm && (
              <>
                <span className="text-shadow text-xs">{farm?.address}</span>
                <Button onClick={start} className="overflow-hidden">
                  Lets go!
                </Button>
              </>
            )}
            <Button
              onClick={() => setShowDonation(true)}
              className="overflow-hidden mb-2"
            >
              Create a farm
            </Button>
            <Button onClick={() => {}} disabled className="overflow-hidden">
              Explore a friend's farm
            </Button>
          </div>
        )}
      </Panel>

      <Modal centered show={showDonation} backdrop={false}>
        <Donation onDonate={donate} />
      </Modal>
    </div>
  );
};
