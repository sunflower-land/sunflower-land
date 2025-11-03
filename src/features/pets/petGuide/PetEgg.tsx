import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { ChestRewardsList } from "components/ui/ChestRewardsList";

export const PetEgg: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg">{`Pet Egg`}</h2>

      <ChestRewardsList
        type="Pet Egg"
        chestDescription={[
          {
            text: "Pick up your first Pet Egg from the Pet Shop counter for 150,000 coins. It’s a one-time purchase per farm.",
            icon: SUNNYSIDE.icons.money_icon,
          },
          {
            text: "Love Island offers a single additional Pet Egg for 10,000 Love Charms. One-and-done for romantics!",
            icon: SUNNYSIDE.icons.heart,
          },
          {
            text: "The Megastore refreshes one Pet Egg every Chapter for 1,500 seasonal tickets—plan your burns around the reset.",
            icon: SUNNYSIDE.icons.treasure,
          },
          {
            text: "Crack an egg to reveal a pet category you don’t already manage. You’ll cycle through all seven categories before any duplicates appear.",
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: "There are 20 common pets spread across the seven categories—collecting every companion is a multi-year chase aligned with Chapter cadence (~4.5 years).",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Common pets stay bound to your farm and underpin upcoming FLOWER burn moments. They cannot be traded or transferred.",
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
