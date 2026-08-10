import type { BaseScene } from "features/world/scenes/BaseScene";
import type { Player } from "features/world/types/Room";
import { NPC_WEARABLES } from "lib/npcs";

/** Fallback outfit when the room doesn't replicate a player's clothing. */
export const DEFAULT_CLOTHING = NPC_WEARABLES[
  "pumpkin' pete"
] as unknown as Player["clothing"];

/**
 * Render EVERY other player in the room at the position they broadcast.
 *
 * The giveaway `party_games` room only ever holds giveaway players (and during an
 * event everyone's in the same game), so we deliberately do NOT filter by
 * `sceneId` — that filter silently hid everyone whenever the room didn't
 * replicate a (correct) `sceneId`. We also fall back to a default outfit if the
 * room doesn't replicate `clothing`, so a slim room state still shows people.
 *
 * `pinY` fixes every remote's Y to a constant (used by Egg Catch, whose players
 * broadcast their SCORE as the Y coordinate rather than a real height).
 */
/** TEMP diagnostic throttle. */
let _dbgAt = 0;

export function renderRoomPlayers(
  scene: BaseScene,
  opts: { lerp?: number; pinY?: number } = {},
) {
  const { lerp = 0.2, pinY } = opts;
  const server = scene.mmoServer;

  // TEMP DIAGNOSTIC — logs once a second so we can see, per client: whether the
  // room is wired, how many players are in OUR state, how many we've drawn, and
  // each player's sceneId / position / whether their clothing replicated.
  const nowMs = Date.now();
  if (nowMs - _dbgAt > 1000) {
    _dbgAt = nowMs;
    const players: unknown[] = [];
    server?.state.players.forEach((p, sid) =>
      players.push({
        sid,
        farmId: p.farmId,
        sceneId: p.sceneId,
        x: Math.round(p.x),
        y: Math.round(p.y),
        body: p.clothing?.body ?? null,
        self: sid === server.sessionId,
      }),
    );
    // eslint-disable-next-line no-console
    console.log("[giveaway] render", {
      hasServer: !!server,
      self: server?.sessionId,
      sceneKey: scene.scene.key,
      count: players.length,
      drawn: Object.keys(scene.playerEntities).length,
      players,
    });
  }

  if (!server) return;

  // Drop anyone who has left the room.
  Object.keys(scene.playerEntities).forEach((sessionId) => {
    if (!server.state.players.get(sessionId)) scene.destroyPlayer(sessionId);
  });

  server.state.players.forEach((player, sessionId) => {
    if (sessionId === server.sessionId) return;

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
