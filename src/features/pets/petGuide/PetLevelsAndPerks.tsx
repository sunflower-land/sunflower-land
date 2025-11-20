import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";

export const PetLevelsAndPerks: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Levels & Perks`}</h2>
      <div className="flex flex-col gap-2 mt-2">
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`XP Benchmarks`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Level 1 → 2: 100 XP total`}</li>
            <li>{`Level 2 → 3: 200 XP more (300 total)`}</li>
            <li>{`Level 3 → 4: 300 XP more (600 total)`}</li>
            <li>{`Level 4 → 5: 400 XP more (1,000 total)`}</li>
            <li>{`Level 5 → 6: 500 XP more (1,500 total)`}</li>
            <li>{`Level 9 → 10: 900 XP more (4,500 total)`}</li>
            <li>{`Level 14 → 15: 1,400 XP more (10,500 total)`}</li>
          </ul>
        </div>
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`Max Energy Milestones`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Level 5: +5 max energy`}</li>
            <li>{`Level 35: +5 max energy`}</li>
            <li>{`Level 75: +5 max energy`}</li>
            <li>{`NFT Auras: Basic ×1.5, Epic ×2, Mega ×3 to the post-bonus max energy.`}</li>
          </ul>
        </div>
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`Fetch Unlock Timeline`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Lvl 1: Acorn runs (100 energy).`}</li>
            <li>{`Lvl 3: Primary category resource (200 energy).`}</li>
            <li>{`Lvl 7: Secondary category resource (200 energy).`}</li>
            <li>{`Lvl 12: Moonfur (1,000 energy, NFT pets only).`}</li>
            <li>{`Lvl 20: Fossil Shell (300 energy).`}</li>
            <li>{`Lvl 25: Tertiary category resource (NFT pets only).`}</li>
          </ul>
        </div>
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`Fetch Yield Bonuses`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Lvl 15: +10% chance for an extra drop (all fetches).`}</li>
            <li>{`Lvl 18: Acorn fetches return +1 guaranteed.`}</li>
            <li>{`Lvl 50: +5% extra-drop chance (total +15%).`}</li>
            <li>{`Lvl 60 (NFT): +1 guaranteed on non-Acorn/Moonfur fetches.`}</li>
            <li>{`Lvl 100: +10% extra-drop chance (total +25%).`}</li>
            <li>{`Lvl 150 (NFT, Moonfur only): +25% extra-drop chance (50% total).`}</li>
          </ul>
        </div>
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`Social & Utility Perks`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Visitor help: +5 XP per friend, up to 50 XP per pet per day.`}</li>
            <li>{`Petting while napping: +10 XP instant bump and resets the nap.`}</li>
            <li>{`Neglect timer: Tapping on a neglected pet loses 500 XP and refreshes the 3-day (common) or 7-day (NFT) countdown.`}</li>
            <li>{`Higher level pets consume the same energy but finish Chapter goals faster due to larger fetch hauls.`}</li>
          </ul>
        </div>
      </div>
    </InnerPanel>
  );
};
