import { CommunityIsland, Wardrobe } from "features/game/types/game";
import { loadIsland } from "../actions/loadIsland";
import { resetIsland, updateIsland } from "../actions/updateIsland";
import { InventoryItemName } from "../types/community";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import { CONFIG } from "lib/config";

/**
 * Injects some player values for use in the API.
 */
export function prepareAPI({
  jwt,
  farmId,
  gameService,
}: {
  jwt: string;
  farmId: number;
  gameService: MachineInterpreter;
}) {
  class CommunityAPI {
    private islandId: string;

    private apiKey: string;

    constructor({ id, apiKey }: { id: string; apiKey: string }) {
      this.islandId = id;
      this.apiKey = apiKey;
    }

    public get game() {
      return gameService.getSnapshot().context.state;
    }

    public get user() {
      return { farmId };
    }

    public async loadIsland(): Promise<CommunityIsland | null> {
      const response = await loadIsland({ farmId, islandId: this.islandId });

      if (!response) {
        return null;
      }

      return response.island;
    }

    public async saveProgress({ metadata }: { metadata: string }) {
      const response = await updateIsland({
        apiKey: this.apiKey,
        farmId: farmId,
        token: jwt,
        islandId: this.islandId,
        metadata,
      });

      return { updatedAt: response?.updatedAt };
    }

    public async mint({
      metadata,
      items,
      wearables,
    }: {
      metadata?: string;
      items: Partial<Record<InventoryItemName, number>>;
      wearables: Wardrobe;
    }) {
      const response = await updateIsland({
        apiKey: this.apiKey,
        farmId: farmId,
        token: jwt,
        islandId: this.islandId,
        metadata,
        mintItems: items,
        mintWearables: wearables,
      });

      gameService.send({ type: "COMMUNITY_UPDATE", game: response?.game });

      return { updatedAt: response?.updatedAt };
    }

    public async burn({
      metadata,
      items,
      sfl,
    }: {
      metadata?: string;
      items: Partial<Record<InventoryItemName, number>>;
      sfl: number;
    }) {
      const response = await updateIsland({
        apiKey: this.apiKey,
        farmId: farmId,
        token: jwt,
        islandId: this.islandId,
        metadata,
        burnItems: items,
        burnSFL: sfl,
      });

      gameService.send({ type: "COMMUNITY_UPDATE", game: response?.game });

      return { updatedAt: response?.updatedAt };
    }

    public async reset() {
      if (CONFIG.NETWORK !== "amoy") return;

      await resetIsland({
        apiKey: this.apiKey,
        farmId: farmId,
        token: jwt,
        islandId: this.islandId,
      });
    }
  }

  return CommunityAPI;
}
