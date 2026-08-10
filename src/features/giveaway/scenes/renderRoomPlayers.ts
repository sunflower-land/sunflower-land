import type { BaseScene } from "features/world/scenes/BaseScene";
import type { Player } from "features/world/types/Room";
import { NPC_WEARABLES } from "lib/npcs";
import type { GiveawayBridge } from "../lib/bridge";

/** Fallback outfit when the room doesn't replicate a player's clothing. */
export const DEFAULT_CLOTHING = NPC_WEARABLES[
  "pumpkin' pete"
] as unknown as Player["clothing"];

/** True if a remote player belongs to the giveaway this scene is running. The
 * party room holds everyone across concurrent / back-to-back giveaways, each
 * tagged with their current `giveawayId`, so we only show players in ours. */
export function inThisGiveaway(scene: BaseScene, player: Player): boolean {
  const gid = (scene.registry.get("giveawayBridge") as GiveawayBridge)
    ?.giveawayId;
  // Before we know our own id, show everyone (avoids a blank scene).
  return !gid || player.giveawayId === gid;
}

/**
 * Render every other player in the CURRENT giveaway at the position they
 * broadcast. Players tagged with a different `giveawayId` (a concurrent or
 * previous game they never left) are filtered out. Falls back to a default
 * outfit if the room doesn't replicate `clothing`.
 *
 * `pinY` fixes every remote's Y to a constant (used by Egg Catch, whose players
 * broadcast their SCORE as the Y coordinate rather than a real height).
 */
export function renderRoomPlayers(
  scene: BaseScene,
  opts: { lerp?: number; pinY?: number } = {},
) {
  const { lerp = 0.2, pinY } = opts;
  const server = scene.mmoServer;
  if (!server) return;

  // Drop anyone who has left the room OR is no longer in our giveaway.
  Object.keys(scene.playerEntities).forEach((sessionId) => {
    const player = server.state.players.get(sessionId);
    if (!player || !inThisGiveaway(scene, player))
      scene.destroyPlayer(sessionId);
  });

  server.state.players.forEach((player, sessionId) => {
    if (sessionId === server.sessionId) return;
    if (!inThisGiveaway(scene, player)) return;

    const targetY = pinY ?? player.y;

    let entity = scene.playerEntities[sessionId];
    if (!entity) {
      try {
        entity = scene.createPlayer({
          x: player.x,
          y: targetY,
          farmId: player.farmId,
          username: player.username,
          faction: player.faction,
          clothing: player.clothing?.body ? player.clothing : DEFAULT_CLOTHING,
          isCurrentPlayer: false,
          npc: player.npc,
          experience: player.experience,
        });
        scene.playerEntities[sessionId] = entity;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[giveaway] failed to render remote player", e, {
          sessionId,
          sceneId: player.sceneId,
          hasClothing: !!player.clothing?.body,
        });
        return;
      }
    }

    // Face + animate based on how far they are from where they should be.
    if (!entity.isInteracting()) {
      if (player.x > entity.x + 0.5) entity.faceRight();
      else if (player.x < entity.x - 0.5) entity.faceLeft();

      const distance = Phaser.Math.Distance.Between(
        player.x,
        targetY,
        entity.x,
        entity.y,
      );
      distance < 2 ? entity.idle() : entity.walk();
    }

    // Glide toward their broadcast position (Y pinned if requested).
    entity.x = Phaser.Math.Linear(entity.x, player.x, lerp);
    entity.y = Phaser.Math.Linear(entity.y, targetY, lerp);
    entity.setDepth(entity.y);
  });
}
