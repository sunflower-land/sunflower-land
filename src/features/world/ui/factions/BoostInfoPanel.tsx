import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";

import { MachineState } from "features/game/lib/gameMachine";
import { GameState } from "features/game/types/game";
import lightning from "assets/icons/lightning.png";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKingdomChoreBoost } from "features/game/events/landExpansion/completeKingdomChore";
import { getKingdomPetBoost } from "features/game/events/landExpansion/feedFactionPet";
import { getKingdomKitchenBoost } from "features/game/events/landExpansion/deliverFactionKitchen";
import { AnimatedPanel } from "../AnimatedPanel";

type KingdomFeature = "kitchen" | "pet" | "kingdom_chores";

export function getFactionBoosts(
  game: GameState,
  feature: KingdomFeature,
  base: number,
) {
  switch (feature) {
    case "kitchen":
      return getKingdomKitchenBoost(game, base)[1];
    case "pet":
      return getKingdomPetBoost(game, base)[1];
    case "kingdom_chores":
      return getKingdomChoreBoost(game, base)[1];
  }
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

  const boosts = getFactionBoosts(game, feature, baseAmount);
  const hasBoosts = getKeys(boosts).length > 0;

  return (
    <AnimatedPanel show={show} className="top-8 -left-[80%]" onClick={onClick}>
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
                  <span className="text-xs whitespace-nowrap">{`${boost} ${name}`}</span>
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
    </AnimatedPanel>
  );
};
