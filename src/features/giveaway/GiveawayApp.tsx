import React from "react";
import { useParams, useSearchParams } from "react-router";

import { GiveawayProvider } from "./lib/GiveawayProvider";
import { GiveawayGame } from "./GiveawayGame";
import { type MinigameType, DEFAULT_MINIGAME } from "./lib/minigames";

/**
 * Entry point for the `/giveaway/play/:id` route (mounted inside GameWrapper, so
 * the game session + gameService are already loaded). Hosts the giveaway
 * mini-game for the giveaway named in the URL. The `?type=` query selects which
 * mini-game to run (falls back to the race).
 */
export const GiveawayApp: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  if (!id) return null;

  const minigame =
    (searchParams.get("type") as MinigameType) ?? DEFAULT_MINIGAME;

  return (
    <GiveawayProvider id={id}>
      <GiveawayGame minigame={minigame} />
    </GiveawayProvider>
  );
};
