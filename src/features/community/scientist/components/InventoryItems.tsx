import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import * as AuthProvider from "features/auth/lib/Provider";
import { Context } from "features/community/lib/CommunityProvider";

import { Box } from "components/ui/Box";
import { CONFIG } from "lib/config";

import { Frog } from "features/community/project-dignity/models/frog";
import { loadFrogs } from "features/community/merchant/actions/loadFrogs";
import { Tadpole } from "features/community/types/community";
import { loadTadpoles } from "features/community/scientist/actions/loadTadpoles";
import {
  Token,
  loadTokens,
} from "features/community/scientist/actions/loadWhitelistTokens";
import { ITEM_DETAILS } from "features/community/types/images";

import token from "features/community/assets/icons/token.png";
import { setPrecision } from "lib/utils/formatNumber";

export const InventoryItems: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);
  const { communityService } = useContext(Context);

  const [tadpoleData, setTadpoleData] = useState<Tadpole[]>([]);
  const [frogData, setFrogData] = useState<Frog[]>([]);
  const [whitelistTokenData, setWhitelistTokenData] = useState<Token>({
    balance: new Decimal(0),
  });

  useEffect(() => {
    const fetchTadpoles = async () => {
      const data = await loadTadpoles();
      setTadpoleData(data);
    };

    const fetchFrogs = async () => {
      const data = await loadFrogs();
      setFrogData(data);
    };

    const fetchTokens = async () => {
      const data = await loadTokens();
      setWhitelistTokenData(data);
    };

    fetchTadpoles();
    fetchFrogs();
    fetchTokens();
  }, []);

  // links
  const tadpoleLink =
    CONFIG.NETWORK == "mainnet"
      ? "https://opensea.io/collection/project-dignity-x-sfl-tadpole-collection"
      : "https://testnets.opensea.io/collection/project-dignity-tadpoles-v1";
  const frogLink =
    CONFIG.NETWORK == "mainnet"
      ? "https://opensea.io/collection/sunflower-land-frogs-collection"
      : "https://testnets.opensea.io/collection/sunflower-land-frogs-collection-testnet";
  const projectDignity = "https://www.projectdignity.work";
  console.log("tadpole", tadpoleData);
  return (
    <>
      <div className="my-2 px-2 lf">
        <p className="mb-2">Tadpole Inventory</p>
        <div className="flex flex-wrap h-fit mb-2">
          {tadpoleData?.length <= 0 && (
            <span className="text-xxs">
              No tadpoles found, see it on{" "}
              <a href={tadpoleLink} className="underline">
                Open Sea
              </a>
            </span>
          )}
          {tadpoleData.map((tadpole, index) => {
            return (
              <Box key={index} image={ITEM_DETAILS[tadpole.health].image} />
            );
          })}
        </div>

        <p className="mt-3 mb-2">Frog Inventory</p>
        <div className="flex flex-wrap h-fit mb-2">
          {frogData?.length <= 0 && (
            <span className="text-xxs">
              No frogs found, grab one on{" "}
              <a href={frogLink} className="underline">
                Open Sea
              </a>
            </span>
          )}
          {frogData.map((frog, index) => {
            return <Box key={index} image={frog.pixel_image} />;
          })}
        </div>

        <p className="mt-3">WL Tokens in Wallet</p>
        <div className="mr-2 ml-2 flex items-center">
          <img src={token} className="h-5 mr-2" />
          <p className="mt-1 mb-2">
            {setPrecision(whitelistTokenData.balance).toString()} PD-WL
          </p>
        </div>
      </div>
    </>
  );
};
