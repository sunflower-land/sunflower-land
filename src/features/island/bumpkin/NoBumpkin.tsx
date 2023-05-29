import React, { useContext, useEffect, useState } from "react";

import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import chest from "assets/icons/chest.png";
import { Button } from "components/ui/Button";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { loadBumpkins } from "lib/blockchain/BumpkinDetails";
import { wallet } from "lib/blockchain/wallet";
import * as AuthProvider from "features/auth/lib/Provider";
import { FullUser } from "features/auth/lib/authMachine";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { NPC } from "./components/NPC";
import { PIXEL_SCALE } from "features/game/lib/constants";

const selectBumpkins = (state: MachineState) => state.context.bumpkins;

export const NoBumpkin: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);

  const [selectedBumpkinId, setSelectedBumpkinId] = useState<number>();

  const bumpkins = useSelector(gameService, selectBumpkins);
  const [hasFarmBumpkins, setHasFarmBumpkins] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const farmBumpkins = await loadBumpkins(
        wallet.web3Provider,
        (authState.context.user as FullUser).farmAddress as string
      );

      if (farmBumpkins.length > 0) {
        setHasFarmBumpkins(true);
      }

      setIsLoading(false);
    };

    load();
  }, []);

  const deposit = () => {
    const bumpkin = bumpkins.find(
      (b) => Number(b.tokenId) === selectedBumpkinId
    );

    if (!bumpkin) {
      return;
    }
    const wearableIds = interpretTokenUri(bumpkin.tokenURI).orderedIds.filter(
      Boolean
    );
    const wearableAmounts = new Array(wearableIds.length).fill(1);

    gameService.send("DEPOSIT", {
      bumpkinId: Number(bumpkin.tokenId),
      wearableIds,
      wearableAmounts,
      sfl: 0,
      itemIds: [],
      itemAmounts: [],
    });
  };

  const refresh = () => {
    gameService.send("REFRESH");
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <p className="loading">Loading</p>
      </div>
    );
  }

  if (hasFarmBumpkins) {
    return (
      <>
        <div className="p-2">
          <p className="mb-2 text-center">
            Awesome, your Bumpkin is ready to farm!
          </p>
        </div>
        <Button onClick={refresh}>Play</Button>
      </>
    );
  }

  if (bumpkins.length === 0) {
    return (
      <>
        <div className="flex items-center flex-col p-2">
          <span>You are missing your Bumpkin</span>
          <img src={SUNNYSIDE.icons.heart} className="w-20 my-2" />
          <p className="text-sm my-2">
            A Bumpkin is an NFT that is minted on the Blockchain.
          </p>
          <p className="text-sm my-2">
            You need a Bumpkin to help you plant, harvest, chop, mine and expand
            your land.
          </p>
          <p className="text-sm my-2">
            If you misplaced your Bumpkin, you can mint one below:
          </p>
          <p className="text-xs sm:text-sm text-shadow text-white p-1">
            <a
              className="underline"
              href={
                CONFIG.NETWORK === "mumbai"
                  ? "https://testnet.bumpkins.io"
                  : "https://bumpkins.io"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              Bumpkins.io
            </a>
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <p className="mb-3 text-center">Wow, look at all those Bumpkins!</p>
        <p className="mb-2 text-center text-xs">
          Which Bumpkin would you like to play with?
        </p>
        <div className="flex flex-wrap max-h-48 overflow-y-scroll">
          {bumpkins.map((bumpkin) => {
            const parts = interpretTokenUri(bumpkin.tokenURI).equipped;
            return (
              <OuterPanel
                onClick={() => setSelectedBumpkinId(Number(bumpkin.tokenId))}
                className="flex flex-col relative cursor-pointer hover:bg-brown-200 h-20 w-20 items-center justify-center mr-2"
              >
                {selectedBumpkinId === Number(bumpkin.tokenId) && (
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    className="absolute"
                    style={{
                      width: `${PIXEL_SCALE * 8}px`,
                      top: `${PIXEL_SCALE * 0}px`,
                      right: `${PIXEL_SCALE * 0}px`,
                    }}
                  />
                )}

                <div className="h-16 w-16 ml-3.5 -mt-4">
                  <NPC parts={parts} />
                </div>
                <p className="text-xxs">{`ID: ${bumpkin.tokenId}`}</p>
              </OuterPanel>
            );
          })}
        </div>
      </div>
      <Button disabled={!selectedBumpkinId} onClick={deposit}>
        Deposit
      </Button>
    </>
  );
};
