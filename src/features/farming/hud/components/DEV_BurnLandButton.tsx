import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

import { Button } from "components/ui/Button";
import { Context } from "features/auth/lib/Provider";

const LAND_EXPANSION_ADDRESS = "0x1bAF4b9b954eD537c355469A47A995e3E4e31B48";

const BALACE_OF_ABI: AbiItem = {
  name: "balanceOf",
  type: "function",
  inputs: [
    {
      type: "address",
      name: "owner",
    },
  ],
};

const TOKEN_OF_OWNER_BY_INDEX_ABI: AbiItem = {
  name: "tokenOfOwnerByIndex",
  type: "function",
  inputs: [
    {
      type: "address",
      name: "owner",
    },
    {
      type: "uint256",
      name: "index",
    },
  ],
};

const GAME_BURN_ABI: AbiItem = {
  name: "gameBurn",
  type: "function",
  inputs: [
    {
      type: "uint256",
      name: "tokenId",
    },
  ],
};

const loadBalance = async (web3: Web3, address: string) => {
  const balanceOf = web3.eth.abi.encodeFunctionCall(BALACE_OF_ABI, [address]);

  const balance = await web3.eth.call({
    to: LAND_EXPANSION_ADDRESS,
    data: balanceOf,
  });

  return parseInt(balance);
};

const loadTokenIds = async (web3: Web3, address: string, balance: number) => {
  const tokenOfOwnerByIndex = (index: number) =>
    web3.eth.abi.encodeFunctionCall(TOKEN_OF_OWNER_BY_INDEX_ABI, [
      address,
      String(index),
    ]);

  const tokenIds = await Promise.all(
    Array.from({ length: balance }, (_, i) =>
      web3.eth.call({
        to: LAND_EXPANSION_ADDRESS,
        data: tokenOfOwnerByIndex(i),
      })
    )
  );

  return tokenIds.map(Number);
};

const loadExpansions = async (web3: Web3, address: string) => {
  const balance = await loadBalance(web3, address);
  const tokenIds = await loadTokenIds(web3, address, balance);

  return tokenIds;
};

const burnTokens = async (web3: Web3, tokens: Record<number, boolean>) => {
  const account = (await web3.eth.getAccounts())[0];

  const batch = new web3.BatchRequest();

  const checkedTokens = Object.entries(tokens).filter(
    ([id, checked]) => checked
  );

  let resolved = 0;

  await new Promise((reject, resolve) => {
    checkedTokens.forEach(([id]) =>
      batch.add(
        (web3.eth.sendTransaction as any).request(
          {
            from: account,
            to: LAND_EXPANSION_ADDRESS,
            data: web3.eth.abi.encodeFunctionCall(GAME_BURN_ABI, [id]),
          },
          () => ++resolved === checkedTokens.length && resolve()
        )
      )
    );

    batch.execute();
  });
};

export const DEV_BurnLandButton: React.FC = () => {
  const { authService } = useContext(Context);
  const [
    {
      context: { address },
    },
  ] = useActor(authService);

  const [showBurnForm, setShowBurnForm] = useState(false);
  const [tokens, setTokens] = useState<Record<number, boolean>>();

  const allSelected = Object.values(tokens ?? {}).every((token) => token);

  useEffect(() => {
    const web3 = new Web3((window as any).ethereum);

    if (showBurnForm === true) {
      const fetchTokenIds = async () => {
        const tokenIds = await loadExpansions(web3, String(address));
        const tokens = tokenIds.reduce(
          (tokens, id) => ({ ...tokens, [id]: false }),
          {}
        );

        setTokens(tokens);
      };

      fetchTokenIds();
    } else {
      setTokens(undefined);
    }
  }, [showBurnForm]);

  const burn = async (tokens: Record<number, boolean>) => {
    const web3 = new Web3((window as any).ethereum);

    await burnTokens(web3, tokens);

    setShowBurnForm(false);

    authService.send("REFRESH");
  };

  return (
    <>
      <Button onClick={() => setShowBurnForm(!showBurnForm)}>Burn Land</Button>

      {showBurnForm && (
        <div className="p-2">
          {tokens === undefined ? (
            <div className="loading">Loading</div>
          ) : Object.entries(tokens).length > 0 ? (
            <>
              <div className="flex">
                <input
                  type="checkbox"
                  id="select-all"
                  name="token"
                  checked={allSelected}
                  onChange={() =>
                    setTokens(
                      Object.keys(tokens).reduce(
                        (tokens, id) => ({ ...tokens, [id]: !allSelected }),
                        {}
                      )
                    )
                  }
                />
                <label htmlFor="select-all" className="text-xss">
                  Select All
                </label>
              </div>
              <hr />
              <hr />
              {Object.entries(tokens)
                .sort(([id1], [id2]) => parseInt(id2) - parseInt(id1))
                .map(([id, checked], i) => (
                  <div key={`checkbox-${String(i)}`} className="flex">
                    <input
                      type="checkbox"
                      id={String(id)}
                      name="token"
                      value={id}
                      checked={checked}
                      onChange={() =>
                        setTokens({
                          ...tokens,
                          [Number(id)]: !tokens[Number(id)],
                        })
                      }
                    />
                    <label htmlFor={String(id)} className="text-xss">
                      Level {i + 2}
                    </label>
                  </div>
                ))}
              <hr />
              <Button onClick={() => burn(tokens)}>Burn!</Button>
            </>
          ) : (
            "No Expansions"
          )}
        </div>
      )}
    </>
  );
};
