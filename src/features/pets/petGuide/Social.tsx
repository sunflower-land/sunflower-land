import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const Social: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Social`}</h2>
      <p className="text-xs text-center px-2 mb-2">
        {`Interact with friends and boost your pets through social features.`}
      </p>
      <NoticeboardItems
        items={[
          {
            text: "Visitor help: Friends can pet your companions for +5 XP each. Your pets can receive up to 50 XP per day from visitors.",
            icon: SUNNYSIDE.icons.player,
          },
          {
            text: "Pet Walking: NFT pets can follow you in multiplayer areas like the Plaza! Toggle walking from the pet management screen. Only one pet can walk at a time.",
            icon: SUNNYSIDE.icons.worldIcon,
          },
          {
            text: "Help friends by visiting their farms and petting their pets. It's a win-win—they get XP and you build community bonds!",
            icon: SUNNYSIDE.icons.happy,
          },
        ]}
      />
    </InnerPanel>
  );
};
