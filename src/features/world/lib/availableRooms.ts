import { Server, ServerId } from "../mmoMachine";

export const MAX_PLAYERS = 150 - 10;

export const serverCurrentPopulation = (
  servers: Server[],
  serverId: ServerId,
) => {
  return servers.find((server) => server.id === serverId)?.population ?? 0;
};

export const isServerFull = (servers: Server[], serverId: ServerId) =>
  serverCurrentPopulation(servers, serverId) >= MAX_PLAYERS;
