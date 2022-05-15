import React, { useContext, useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { getOnChainState } from "features/game/actions/onchain";
import { Inventory } from "features/game/types/game";

import { Button } from "components/ui/Button";

import alert from "assets/icons/expression_alerted.png";
import { useActor } from "@xstate/react";
import { Panel } from "components/ui/Panel";
import goblinFence from "assets/land/goblin_fence.png";

export const GoblinVillageModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const goToGoblinTown = () => {
    window.location.href = `${window.location.pathname}#/goblins`;
  };

  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Inventory>({});
  const [balance, setBalance] = useState<Decimal>(new Decimal(0));
  const [showSyncCaptcha, setShowCaptcha] = useState(false);
  const localInventory = JSON.stringify(
    game.context.state.inventory,
    Object.keys(game.context.state.inventory).sort()
  );
  const chainInventory = JSON.stringify(
    inventory,
    Object.keys(inventory).sort()
  );
  let inventoriesMatch = false;

  const localBalance = game.context.state.balance;
  const chainBalance = balance;
  let balancesMatch = false;

  if (localInventory == chainInventory) inventoriesMatch = true;
  if (localBalance.equals(chainBalance)) balancesMatch = true;

  const farmSynced = inventoriesMatch && balancesMatch;

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      const { game: state } = await getOnChainState({
        id: game.context.state.id as number,
        farmAddress: game.context.state.farmAddress as string,
      });

      setInventory(state.inventory);
      setBalance(state.balance);
      setIsLoading(false);
    };

    load();
  }, []);

  const onCaptchaSolved = async (captcha: string | null) => {
    await new Promise((res) => setTimeout(res, 1000));
    gameService.send("SYNC", { captcha });
    onClose();
  };

  const preGoblinTownSync = () => {
    setShowCaptcha(true);
  };

  if (isLoading) {
    return (
      <Panel>
        <span className="text-shadow loading">Loading</span>
      </Panel>
    );
  }

  if (showSyncCaptcha) {
    return (
      <Panel>
        <ReCAPTCHA
          sitekey="6Lfqm6MeAAAAAFS5a0vwAfTGUwnlNoHziyIlOl1s"
          onChange={onCaptchaSolved}
          onExpired={() => setShowCaptcha(false)}
          className="w-full m-4 flex items-center justify-center"
        />
        <p className="text-xxs p-1 m-1 text-center">
          Any unsaved progress will be lost.
        </p>
      </Panel>
    );
  }

  return (
    <Panel>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-2 text-center">
            Do you want to visit Goblin Village?
          </h1>
          <img src={goblinFence} alt="goblin fence" className="w-48" />
        </div>

        <p className="mb-4 text-sm block">
          Goblin Village offers rare items and{" "}
          <span className="underline">on-chain</span> gameplay.
        </p>
        <p className="mb-4 text-sm">
          If you transact with a greedy goblin be careful. They will steal any
          SFL, resources & crops that are not synced to the blockchain.
        </p>
        <p className="mb-2 text-sm">
          If you have any un-synced items it is recommended you{" "}
          <span className="underline">sync on chain</span> before entering.
        </p>
      </div>
      <div
        className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-error"
        hidden={farmSynced}
      >
        <img src={alert} alt="alert" className="mr-2 w-6" />
        <span className="text-xs">
          You may lose SFL or resources from your farm if they have not been
          synced to the blockchain
        </span>
      </div>
      <div hidden={farmSynced}>
        <Button className="my-2" onClick={preGoblinTownSync}>
          SYNC
        </Button>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          Close
        </Button>
        <Button className="ml-1" onClick={goToGoblinTown}>
          Continue
        </Button>
      </div>
    </Panel>
  );
};
