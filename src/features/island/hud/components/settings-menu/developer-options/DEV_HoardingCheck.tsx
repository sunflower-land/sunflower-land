/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "components/ui/Button";
import { KNOWN_IDS } from "features/game/types";
import React, { ChangeEvent, useContext, useState } from "react";
import GameABI from "lib/blockchain/abis/SunflowerLandGame";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ContentComponentProps } from "../GameOptions";
import { readContract } from "viem/actions";
import { createPublicClient, encodePacked, http, keccak256 } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
import { CONFIG } from "lib/config";
import { Loading } from "features/auth/components";
import { getOffChainItems } from "features/game/lib/offChainItems";
import { InventoryItemName } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/lib/crafting";
import { useNow } from "lib/utils/hooks/useNow";
import { makeGame } from "features/game/lib/transforms";

const _apiKey = (state: MachineState) => state.context.apiKey;

export const DEV_HoarderCheck: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const apiKey = useSelector(gameService, _apiKey);
  const [loading, setLoading] = useState(false);
  const [farmId, setFarmId] = useState("");
  const [inventoryLimits, setInventoryLimits] = useState<string[]>([]);
  const [wardrobeLimits, setWardrobeLimits] = useState<string[]>([]);
  const now = useNow();
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
          "x-api-key": apiKey || "",
        },
        body: JSON.stringify({
          ids: [Number(farmId)],
        }),
      });

      const json = await result.json();

      // INVENTORY LIMITS
      const current = json.farms[farmId].inventory as Partial<
        Record<InventoryItemName, string>
      >;
      const previous = json.farms[farmId].previousInventory as Partial<
        Record<InventoryItemName, string>
      >;

      const maxIds = getKeys(current)
        .filter(
          (k) => Number(current[k] ?? "0") - Number(previous[k] ?? "0") > 0,
        )
        .map((key) => BigInt(KNOWN_IDS[key]));

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
      const offChainItems = new Set(
        getOffChainItems(now, makeGame(json.farms[farmId])),
      );

      getKeys(current).forEach((key) => {
        const diff = Number(current[key] ?? "0") - Number(previous[key] ?? "0");
        if (diff > 0) {
          let limit = maxAmount[maxIds.indexOf(BigInt(KNOWN_IDS[key]))];

          if (limit > 100000) {
            limit = limit / 10 ** 18;
          }

          if (offChainItems.has(key)) return;

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

        const storage = encodePacked(["uint256", "uint256"], [id, 9] as any);
        const hex = await publicClient.getStorageAt({
          address: gameContract,
          slot: keccak256(storage),
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

  return (
    <div className="flex flex-col gap-2 p-3">
      <h2 className="text-base text-start capitalize ">{CONFIG.NETWORK}</h2>
      <div className="flex mb-2">
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
          placeholder="Enter Farm ID"
          className="text-shadow rounded-sm shadow-inner text-black placeholder-black shadow-black bg-brown-200 w-full p-2 h-10"
        />
      </div>

      <div className="flex-1">
        {loading ? (
          <Loading />
        ) : inventoryLimits.length === 0 && wardrobeLimits.length === 0 ? (
          <div className="text-sm">{t("no.limits.exceeded")}</div>
        ) : (
          <div className="space-y-1">
            {inventoryLimits.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-1">{`Inventory Limits`}</h3>
                {inventoryLimits.map((limit) => (
                  <div key={limit} className="text-xs text-red-500">
                    {limit}
                  </div>
                ))}
              </div>
            )}
            {wardrobeLimits.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-1">{`Wardrobe Limits`}</h3>
                {wardrobeLimits.map((limit) => (
                  <div key={limit} className="text-xs text-red-500">
                    {limit}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={search} className="w-full">
        {t("check")}
      </Button>
    </div>
  );
};
