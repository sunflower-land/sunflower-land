import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

export const Social: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Social`}</Label>
      </div>
      <p className="text-xs px-2 my-1">
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
