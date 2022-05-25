import { Panel } from "components/ui/Panel";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

import secure from "assets/npcs/synced.gif";
import idle from "assets/npcs/idle.gif";

import * as AuthProvider from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { harvestMutantCrop } from "features/game/actions/harvestMutantCrop";
import { CropName } from "features/game/types/crops";
import { useActor } from "@xstate/react";

interface Props {
  crop: CropName;
  fieldIndex: number;
  onCollected: () => void;
}

export const MutantReward: React.FC<Props> = ({
  crop,
  onCollected,
  fieldIndex,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [state, setState] = useState<
    "idle" | "searching" | "rewarded" | "empty"
  >("idle");

  const search = async () => {
    setState("searching");

    const rewarded = await harvestMutantCrop({
      crop,
      farmId: authState.context.farmId as number,
      token: authState.context.rawToken as string,
      fieldIndex,
    });

    setState(rewarded ? "rewarded" : "empty");
  };

  // Harvest the crop and close
  const close = () => {
    gameService.send("item.harvested", { fieldIndex });
    onCollected();
  };

  const Content = () => {
    if (state === "idle") {
      return (
        <>
          <span className="text-center mb-2">
            It looks like something strange is there!
          </span>
          <Button>Search</Button>
        </>
      );
    }
    if (state === "searching") {
      return <span className="loading">Searching</span>;
    }

    if (state === "rewarded") {
      return (
        <div>
          <span className="text-center mb-2">
            Woohoo! You found a mutant crop!
          </span>
          <span>
            This has been sent to your farm's address. Sync on chain for it to
            appear in your inventory.
          </span>
          <Button>Continue</Button>
        </div>
      );
    }

    if (state === "empty") {
      return (
        <div>
          <span>Whatever strange item was there has disappeared</span>
          <span>I wonder what it was?</span>
        </div>
      );
    }
  };
  return (
    <Modal centered show={true}>
      <Panel>
        <div className="flex flex-col items-center justify-between h-52">
          {Content()}
        </div>
      </Panel>
    </Modal>
  );
};
