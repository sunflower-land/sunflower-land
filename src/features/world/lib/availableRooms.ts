import { Server, ServerId } from "../mmoMachine";
import { GameState } from "features/game/types/game";

export const MAX_PLAYERS = 150 - 10;

export const serverCurrentPopulation = (
  servers: Server[],
  serverId: ServerId
) => {
  return servers.find((server) => server.id === serverId)?.population ?? 0;
};

export const isServerFull = (
  servers: Server[],
  serverId: ServerId,
  gameState: GameState
) => {
  const isMod = gameState.bumpkin && gameState.bumpkin.equipped.hat === "Halo";
  const serverPopulation = serverCurrentPopulation(servers, serverId);

  // isMod, 5 reserved slots, if not server is full
  return isMod
    ? serverPopulation >= MAX_PLAYERS - 5
    : serverPopulation >= MAX_PLAYERS;
};
