import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";

import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/game/GameProvider";
import { harvestMutantCrop } from "features/game/actions/harvestMutantCrop";
import { CropName } from "features/game/types/crops";

import questionMark from "assets/icons/expression_confused.png";

import mutantImg from "./mutant_example.png";

interface Props {
  crop: CropName;
  fieldIndex: number;
  onClose: () => void;
}

export const MutantReward: React.FC<Props> = ({
  crop,
  onClose,
  fieldIndex,
}) => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [mutantCrop, setMutantCrop] = useState<{ id: number; image: string }>({
    id: 2,
    image: mutantImg,
  });

  const [state, setState] = useState<
    "idle" | "catching" | "rewarded" | "empty"
  >("idle");

  const catchIt = async () => {
    setState("catching");

    const mutantCrop = await harvestMutantCrop({
      crop,
      farmId: authState.context.farmId as number,
      token: authState.context.rawToken as string,
      fieldIndex,
    });

    setState(!!mutantCrop ? "rewarded" : "empty");

    if (mutantCrop) {
      setMutantCrop(mutantCrop);
    }
  };

  const Content = () => {
    if (state === "idle") {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-center mb-2">
            You encountered a mutant crop!
          </p>
          <div className="relative w-1/3">
            <img src={mutantCrop?.image} className="w-full opacity-20" />
            <img src={questionMark} className="absolute w-10 top-10 left-14" />
          </div>
          <span className="text-xs text-center mb-2">
            You must be quick, try your luck and see if you can catch it
          </span>
          <Button onClick={catchIt}>Catch</Button>
        </div>
      );
    }
    if (state === "catching") {
      return <span className="loading">Trying to catch</span>;
    }

    if (state === "rewarded") {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-center mb-2">You caught a mutant crop!</p>
          <img src={mutantCrop?.image} className="w-1/3" />
          <span className="text-lg text-center mb-2">#1</span>
          <a className="text-xs underline text-center mb-2 cursor-pointer">
            View on Open Sea
          </a>
          <span className="text-xs text-center mb-2">
            This has been sent to your farm's address. Sync on chain for it to
            appear in your inventory.
          </span>
          <Button onClick={onClose}>Continue</Button>
        </div>
      );
    }

    if (state === "empty") {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg text-center mb-2">It got away!</p>
          <div className="relative w-1/3">
            <img src={mutantCrop?.image} className="w-full opacity-20" />
            <img src={questionMark} className="absolute w-10 top-10 left-14" />
          </div>
          <a className="text-sm text-center mb-2 ">
            The mutant crop ran away. Better luck next time!
          </a>
          <Button onClick={onClose}>Continue</Button>
        </div>
      );
    }
  };
  return (
    <Modal centered show={true}>
      <Panel>
        <img
          src={close}
          className="h-6 cursor-pointer mr-2 mb-1 absolute right-2"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-between px-4">
          {Content()}
        </div>
      </Panel>
    </Modal>
  );
};
