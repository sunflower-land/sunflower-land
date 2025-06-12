import React from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";
import { GameState } from "features/game/types/game";
import { getKingdomChoreBoost } from "features/game/events/landExpansion/completeKingdomChore";
import { getKingdomPetBoost } from "features/game/events/landExpansion/feedFactionPet";
import { getKingdomKitchenBoost } from "features/game/events/landExpansion/deliverFactionKitchen";

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
  className?: string;
  onClick?: () => void;
}

export const AnimatedPanel: React.FC<Props> = ({
  show,
  onClick,
  children,
  className,
}) => {
  return (
    <Transition
      appear={true}
      id="animated-panel"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`flex absolute z-40 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer">
        {children}
      </InnerPanel>
    </Transition>
  );
};
