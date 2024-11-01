import { Button } from "components/ui/Button";
import { KNOWN_IDS } from "features/game/types";
import React, { ChangeEvent, useState } from "react";
import GameABI from "lib/blockchain/abis/SunflowerLandGame";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";
import { readContract } from "viem/actions";
import { createPublicClient, encodePacked, http } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
import { CONFIG } from "lib/config";

export const DEV_HoarderCheck: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();
  const [loading, setLoading] = useState(false);
  const [farmId, setFarmId] = useState("");
  const [inventoryLimits, setInventoryLimits] = useState<string[]>([]);
  const [wardrobeLimits, setWardrobeLimits] = useState<string[]>([]);

  async function search() {
    setLoading(true);
    setInventoryLimits([]);
    setWardrobeLimits([]);

    const API_URL = CONFIG.API_URL;

    try {
      const result = await window.fetch(`${API_URL}/community/getFarms`, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          ids: [Number(farmId)],
        }),
      });

      const json = await result.json();

      // INVENTORY LIMITS
      const current = json.farms[farmId].inventory;
      const previous = json.farms[farmId].previousInventory;

      const maxIds = Object.keys(current)
        .filter(
          (k) => ((current as any)[k] ?? 0) - ((previous as any)[k] ?? 0) > 0,
        )
        .map(String)
        .map((key) => (KNOWN_IDS as any)[key]);

      const publicClient = createPublicClient({
        transport: http(),
        chain: CONFIG.NETWORK === "mainnet" ? polygon : polygonAmoy,
      });

      const gameContract = CONFIG.GAME_CONTRACT;

      // Note this is imported from viem, not wagmi
      const maxAmount = (
        await readContract(publicClient, {
          abi: GameABI,
          address: gameContract,
          functionName: "getMaxItemAmounts",
          args: [maxIds],
        })
      ).map(Number);

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

        const storage = encodePacked(["uint256, uint"], [id, 9] as any);
        const hex = await publicClient.getStorageAt({
          address: gameContract,
          slot: storage,
        });

        return parseInt(hex as any, 16);
      };

      for (const key of Object.keys(currentWardrobe)) {
        const diff =
          Number((currentWardrobe as any)[key]) -
          Number((previousWardrobe as any)[key] ?? 0);
        if (diff > 0) {
          const limit = await getOnChainMax(key);
          if (diff > limit) {
            wardrobeLimits.push(
              `${key} (Diff ${diff} > Limit ${await getOnChainMax(key)})`,
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
    return <div>{t("loading")}</div>;
  }

  return (
    <>
      {CONFIG.NETWORK}
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
        <div>{t("no.limits.exceeded")}</div>
      )}
      {inventoryLimits.map((limit) => (
        <div key={limit}>{limit}</div>
      ))}
      {wardrobeLimits.map((limit) => (
        <div key={limit}>{limit}</div>
      ))}

      <Button onClick={search} className="pt-2">
        {t("check")}
      </Button>
    </>
  );
};
