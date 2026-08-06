import type { BaseScene } from "features/world/scenes/BaseScene";

/**
 * Render EVERY other player in the room at the position they broadcast — WITHOUT
 * requiring a `sceneId` match.
 *
 * BaseScene's own `updateOtherPlayers` only draws remotes whose
 * `sceneId === scene.key`, because in the world one room is shared across many
 * scenes. The giveaway `party_games` room only ever holds giveaway players, so
 * we render them all. This also survives a party room that doesn't replicate
 * `sceneId` into its state (which otherwise filters everyone out and leaves you
 * looking at an empty track).
 *
 * Used by the scenes that move around (race, eggs). Log Chop pins players to
 * fixed spots, so it does its own thing.
 */
export function renderRoomPlayers(scene: BaseScene, lerp = 0.2) {
  const server = scene.mmoServer;
  if (!server) return;

  // Drop anyone who has left the room.
  Object.keys(scene.playerEntities).forEach((sessionId) => {
    if (!server.state.players.get(sessionId)) scene.destroyPlayer(sessionId);
  });

  server.state.players.forEach((player, sessionId) => {
    if (sessionId === server.sessionId) return;
    // Only honour sceneId when the room actually replicates one — that keeps us
    // from mixing scenes on a shared server, while still working on a party room
    // that doesn't send sceneId at all.
    if (player.sceneId && player.sceneId !== scene.scene.key) return;

    let entity = scene.playerEntities[sessionId];
    if (!entity) {
      try {
        entity = scene.createPlayer({
          x: player.x,
          y: player.y,
          farmId: player.farmId,
          username: player.username,
          faction: player.faction,
          clothing: player.clothing,
          isCurrentPlayer: false,
          npc: player.npc,
          experience: player.experience,
        });
        scene.playerEntities[sessionId] = entity;
      } catch {
        // A single bad player (e.g. missing clothing) shouldn't break the scene.
        return;
      }
    }

    // Face + animate based on how far they are from where they say they are.
    if (!entity.isInteracting()) {
      if (player.x > entity.x + 0.5) entity.faceRight();
      else if (player.x < entity.x - 0.5) entity.faceLeft();

      const distance = Phaser.Math.Distance.BetweenPoints(player, entity);
      distance < 2 ? entity.idle() : entity.walk();
    }

    // Glide toward their broadcast position.
    entity.x = Phaser.Math.Linear(entity.x, player.x, lerp);
    entity.y = Phaser.Math.Linear(entity.y, player.y, lerp);
    entity.setDepth(entity.y);
  });
}
