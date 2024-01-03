import React, { useContext, useEffect, useState } from "react";

import { CONFIG } from "lib/config";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { OnChainBumpkin, loadBumpkins } from "lib/blockchain/BumpkinDetails";
import { wallet } from "lib/blockchain/wallet";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

export const NoBumpkin: React.FC = () => {
  const { gameService } = useContext(Context);

  const [selectedBumpkinId, setSelectedBumpkinId] = useState<number>();

  const [walletBumpkins, setWalletBumpkins] = useState<OnChainBumpkin[]>();
  const [farmBumpkins, setFarmBumpkins] = useState<OnChainBumpkin[]>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [walletBumpkins, farmBumpkins] = await Promise.all([
        loadBumpkins(wallet.web3Provider, wallet.myAccount as string),
        loadBumpkins(
          wallet.web3Provider,
          gameService.state.context.farmAddress as string
        ),
      ]);

      setWalletBumpkins(walletBumpkins);
      setFarmBumpkins(farmBumpkins);

      setIsLoading(false);
    };

    load();
  }, []);

  const hasFarmBumpkins = (farmBumpkins?.length ?? 0) > 0;

  const deposit = () => {
    const bumpkin = (walletBumpkins ?? []).find(
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
      bumpkinTokenUri: bumpkin.tokenURI,
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

  if (walletBumpkins?.length === 0) {
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
          <p className="text-sm my-2">You can get a Bumpkin from OpenSea:</p>
          <p className="text-xs sm:text-sm text-shadow text-white p-1">
            <a
              className="underline"
              href={
                CONFIG.NETWORK === "mumbai"
                  ? "https://testnets.opensea.io/collection/bumpkin-vptgvexdat"
                  : "https://opensea.io/collection/bumpkins"
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenSea
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
          {(walletBumpkins ?? []).map((bumpkin) => {
            const parts = interpretTokenUri(bumpkin.tokenURI).equipped;
            return (
              <OuterPanel
                key={bumpkin.tokenId}
                onClick={() => setSelectedBumpkinId(Number(bumpkin.tokenId))}
                className="flex flex-col relative cursor-pointer hover:bg-brown-200 h-20 w-20 items-center justify-center mr-2 mb-2"
              >
                {selectedBumpkinId === Number(bumpkin.tokenId) && (
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    className="absolute z-10"
                    style={{
                      width: `${PIXEL_SCALE * 8}px`,
                      top: `${PIXEL_SCALE * 0}px`,
                      right: `${PIXEL_SCALE * 0}px`,
                    }}
                  />
                )}

                <div className="h-14 rounded-md overflow-hidden">
                  <DynamicNFT showBackground bumpkinParts={parts} />
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
