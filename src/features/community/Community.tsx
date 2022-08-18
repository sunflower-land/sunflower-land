import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "./assets/community_garden.png";
import { CommunityGarden } from "./components/CommunityGarden";
import { CommunityHud } from "./components/CommunityHUD";
import { CommunityProvider } from "./lib/CommunityProvider";

export const Community: React.FC = () => {
  const container = useRef(null);
  // Load data
  return (
    <CommunityProvider>
      <ScrollContainer
        className="relative w-full h-full bg-[#0099db] flex items-center justify-center overflow-scroll"
        innerRef={container}
      >
        <img
          src={background}
          className="absolute"
          style={{
            minWidth: `${30 * GRID_WIDTH_PX}px`,
          }}
        />
        <CommunityHud />
        <CommunityGarden />
      </ScrollContainer>
    </CommunityProvider>
  );
};
