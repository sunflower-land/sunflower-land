import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

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
      <NoticeboardItems
        items={[
          {
            text: "Pet XP follows a triangular curve: Level 2 is 100 XP, Level 3 is 300 XP, Level 4 is 600 XP, Level 5 is 1,000 XP, and so on following 100 × (n − 1) × n / 2.",
            icon: SUNNYSIDE.icons.xpIcon,
          },
          {
            text: "Energy grows with experience—each pet gains +5 max energy at levels 5, 35, and 75. NFT auras multiply the total (No Aura, 1.5× Basic, 2× Epic, 3× Mega).",
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: "Fetch unlocks arrive in waves: Level 1 (Acorn), Level 3 primary resource, Level 7 secondary resource, Level 12 Moonfur (NFTs), Level 20 Fossil Shell, Level 25 tertiary category (NFTs).",
            icon: SUNNYSIDE.icons.treasure,
          },
          {
            text: "Higher levels improve haul sizes—extra drop rolls start at level 15, grow again at levels 50 and 100, grant Acorn doubles at 18, and NFTs add a +1 bonus to non-Acorn/Moonfur fetches at level 60 with a Moonfur double chance at 150.",
            icon: SUNNYSIDE.icons.powerup,
          },
          {
            text: "Social actions accelerate leveling: each visitor help grants 5 XP (capped at 50 XP per pet daily) and waking a napping pet by petting it awards 10 XP immediately.",
            icon: SUNNYSIDE.icons.playIcon,
          },
        ]}
      />
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
            <li>{`Level 5: +5 max energy (15 total before aura)`}</li>
            <li>{`Level 35: +5 max energy (20 total before aura)`}</li>
            <li>{`Level 75: +5 max energy (25 total before aura)`}</li>
            <li>{`NFT Auras: Basic ×1.5, Epic ×2, Mega ×3 to the post-bonus max energy.`}</li>
          </ul>
        </div>
        <div className="bg-[#ead4aa] rounded p-2">
          <p className="text-xs font-semibold mb-1">{`Fetch Unlock Timeline`}</p>
          <ul className="text-xxs space-y-1 list-disc list-inside">
            <li>{`Lvl 1: Acorn runs (100 energy).`}</li>
            <li>{`Lvl 3: Primary category resource (200 energy).`}</li>
            <li>{`Lvl 7: Secondary category resource (200 energy, if the pet has one).`}</li>
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
            <li>{`Neglect timer: feeding any requested dish refreshes the 3-day (common) or 7-day (NFT) countdown.`}</li>
            <li>{`Higher level pets consume the same energy but finish Chapter goals faster due to larger fetch hauls.`}</li>
          </ul>
        </div>
      </div>
    </InnerPanel>
  );
};
