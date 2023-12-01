import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { KNOWN_IDS } from "features/game/types";
import React, { ChangeEvent, useState } from "react";
import { Modal } from "react-bootstrap";
import GameABI from "lib/blockchain/abis/SunflowerLandGame.json";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

const HoarderCheck: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [farmId, setFarmId] = useState("");
  const [inventoryLimits, setInventoryLimits] = useState<string[]>([]);
  const [wardrobeLimits, setWardrobeLimits] = useState<string[]>([]);

  async function search() {
    setLoading(true);
    setInventoryLimits([]);
    setWardrobeLimits([]);

    try {
      const result = await window.fetch(
        `https://api.sunflower-land.com/community/getFarms`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            ids: [Number(farmId)],
          }),
        }
      );

      const json = await result.json();

      // INVENTORY LIMITS
      const current = json.farms[farmId].inventory;
      const previous = json.farms[farmId].previousInventory;

      const maxIds = Object.keys(current)
        .filter(
          (k) => ((current as any)[k] ?? 0) - ((previous as any)[k] ?? 0) > 0
        )
        .map(String)
        .map((key) => (KNOWN_IDS as any)[key]);

      const web3 = new Web3("https://polygon-rpc.com/");
      const contract = new web3.eth.Contract(
        GameABI as AbiItem[],
        "0xfB84a7D985f9336987C89e1518E9A897b013080B"
      );
      const maxAmount = await contract.methods.getMaxItemAmounts(maxIds).call();
      const inventoryLimits: string[] = [];

      Object.keys(current).forEach((key) => {
        const diff =
          Number((current as any)[key]) - Number((previous as any)[key] ?? 0);
        if (diff > 0) {
          let limit = maxAmount[maxIds.indexOf((KNOWN_IDS as any)[key])];

          if (limit > 100000) {
            limit = limit / 10 ** 18;
          }

          if (diff > limit) {
            inventoryLimits.push(`${key} (Diff ${diff} > Limit ${limit})`);
          }
        }
      });

      setInventoryLimits(inventoryLimits);

      // WARDROBE LIMITS

      const wardrobeLimits: string[] = [];

      const currentWardrobe = json.farms[farmId].wardrobe;
      const previousWardrobe = json.farms[farmId].previousWardrobe;

      const getOnChainMax = async (wearableName: string) => {
        const id = ITEM_IDS[wearableName as BumpkinItem];
        const storage = web3.utils.soliditySha3(
          { type: "uint256", value: String(id) },
          { type: "uint", value: "13" }
        ) as string;

        const hex = await web3.eth.getStorageAt(
          "0xfB84a7D985f9336987C89e1518E9A897b013080B",
          storage
        );

        return parseInt(hex, 16);
      };

      for (const key of Object.keys(currentWardrobe)) {
        const diff =
          Number((currentWardrobe as any)[key]) -
          Number((previousWardrobe as any)[key] ?? 0);
        if (diff > 0) {
          const limit = await getOnChainMax(key);
          if (diff > limit) {
            wardrobeLimits.push(
              `${key} (Diff ${diff} > Limit ${await getOnChainMax(key)})`
            );
          }
        }
      }

      setWardrobeLimits(wardrobeLimits);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Panel>Loading...</Panel>;
  }

  return (
    <Panel className="flex flex-col p-1">
      <input
        style={{
          boxShadow: "#b96e50 0px 1px 1px 1px inset",
          border: "2px solid #ead4aa",
        }}
        type="text"
        min={1}
        value={farmId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setFarmId(e.target.value);
        }}
        className={
          "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10"
        }
      />
      {inventoryLimits.length === 0 && wardrobeLimits.length === 0 && (
        <div>No Limits Exceeded</div>
      )}
      {inventoryLimits.map((limit) => (
        <div key={limit}>{limit}</div>
      ))}
      {wardrobeLimits.map((limit) => (
        <div key={limit}>{limit}</div>
      ))}

      <Button onClick={search} className="pt-2">
        Check
      </Button>
    </Panel>
  );
};

export const DEV_HoardingCheck: React.FC = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Modal show={show} centered onHide={() => setShow(false)}>
        <HoarderCheck />
      </Modal>
      <Button onClick={() => setShow(!show)}>Hoarder Check (Mainnet)</Button>
    </>
  );
};
