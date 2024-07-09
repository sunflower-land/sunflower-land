import React, { useContext } from "react";
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
import lightning from "assets/icons/lightning.png";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type KingdomFeature = "kitchen" | "pet" | "kingdom_chores";

export function getFactionBoosts(game: GameState, feature: KingdomFeature) {
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
    boosts[FACTION_OUTFITS[factionName].shoes] = `${0.05 * 100}%`;
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

  if (feature === "pet" && isWearableActive({ game, name: "Paw Shield" })) {
    boosts["Paw Shield"] = `${0.25 * 100}%`;
  }

  const rank = getFactionRanking(
    factionName,
    game.inventory[FACTION_EMBLEMS[factionName]]?.toNumber() ?? 0,
  );

  if (rank) {
    const boost = rankBoostPercentage(rank.name);
    if (boost > 0) {
      boosts[`${rank.name} rank`] = `${boost * 100}%`;
    }
  }

  return boosts;
}

interface Props {
  show: boolean;
  feature: KingdomFeature;
  baseAmount: number;
  onClick: () => void;
}

const _game = (state: MachineState) => state.context.state;

export const BoostInfoPanel: React.FC<Props> = ({
  show,
  feature,
  baseAmount,
  onClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const game = useSelector(gameService, _game);

  const boosts = getFactionBoosts(game, feature);
  const hasBoosts = getKeys(boosts).length > 0;

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
      className="flex top-8 -left-[80%] absolute z-40"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer">
        <div className="flex flex-col mb-1">
          <span className="text-xs mb-2 ml-0.5 font-bold whitespace-nowrap">{`${baseAmount} ${baseAmount === 1 ? "Mark" : "Marks"}`}</span>
          {hasBoosts ? (
            <>
              <div className="flex space-x-1 mb-1">
                <img src={lightning} alt="Boost" className="w-3" />
                <span className="text-xs whitespace-nowrap">
                  {t("faction.boostsApplied")}
                </span>
              </div>
              <div className="space-y-1">
                {Object.entries(boosts).map(([name, boost]) => (
                  <div
                    key={`${name}-${boost}`}
                    className="capitalize space-x-1 text-xs"
                  >
                    <span className="text-xs whitespace-nowrap">{`+${boost} ${name}`}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className="text-xs whitespace-nowrap">
              {t("faction.no.boostsApplied")}
            </span>
          )}
        </div>
      </InnerPanel>
    </Transition>
  );
};
