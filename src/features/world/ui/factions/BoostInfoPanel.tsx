import { Transition } from "@headlessui/react";
import { useSelector } from "@xstate/react";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { FACTION_EMBLEMS } from "features/game/events/landExpansion/joinFaction";
import {
  getFactionRanking,
  rankBoostPercentage,
} from "features/game/lib/factionRanks";
import { FACTION_OUTFITS } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { isWearableActive } from "features/game/lib/wearables";
import { FactionName, GameState } from "features/game/types/game";
import React, { useContext } from "react";

interface Props {
  show: boolean;
  totalBoostAmount: number;
}

export function getFactionBoosts(game: GameState) {
  const factionName = game.faction?.name as FactionName;

  const boosts: Record<string, string> = {};

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].pants,
    })
  ) {
    boosts[FACTION_OUTFITS[factionName].pants] = `${0.05 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shoes,
    })
  ) {
    boosts[FACTION_OUTFITS[factionName].pants] = `${0.05 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].tool,
    })
  ) {
    boosts[FACTION_OUTFITS[factionName].tool] = `${0.1 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].hat,
    })
  ) {
    boosts[FACTION_OUTFITS[factionName].hat] = `${0.1 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shirt,
    })
  ) {
    boosts[FACTION_OUTFITS[factionName].shirt] = `${0.2 * 100}%`;
  }

  if (isWearableActive({ game, name: "Paw Shield" })) {
    boosts["Paw Shield"] = `${0.25 * 100}%`;
  }

  const rank = getFactionRanking(
    factionName,
    game.inventory[FACTION_EMBLEMS[factionName]]?.toNumber() ?? 0,
  );

  if (rank) {
    const boost = rankBoostPercentage(rank.name);

    boosts[rank.name] = `${boost * 100}%`;
  }

  return boosts;
}

const _game = (state: MachineState) => state.context.state;

export const BoostInfoPanel: React.FC<Props> = ({ show, totalBoostAmount }) => {
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);

  const boosts = getFactionBoosts(game);

  return (
    <Transition
      appear={true}
      id="pet-boost-info-panel"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className="flex top-2 right-[40%] absolute z-40 pointer-events-none"
    >
      <InnerPanel>
        <div className="flex flex-col p-1">
          <div></div>
          {Object.entries(boosts).map(([name, boost]) => (
            <div
              key={`${name}-${boost}`}
              className="capitalize space-x-1 text-xs"
            >
              <span>{`+${boost}`}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </InnerPanel>
    </Transition>
  );
};
