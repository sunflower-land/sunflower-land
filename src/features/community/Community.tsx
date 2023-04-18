import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "./assets/community_garden.gif";

import { CommunityHud } from "./components/CommunityHUD";
import { CommunityProvider } from "./lib/CommunityProvider";
import { CommunityGarden } from "features/community/components/CommunityGarden";

export const Community: React.FC = () => {
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with crops centered
    scrollIntoView(Section.Merchant, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <CommunityProvider>
      <ScrollContainer
        className="bg-blue-300 overflow-scroll relative w-full h-full overscroll-none"
        innerRef={container}
      >
        <div
          className="relative"
          style={{
            width: `${60 * GRID_WIDTH_PX}px`,
            height: `${60 * GRID_WIDTH_PX}px`,
          }}
        >
          <img src={background} className="absolute inset-0 w-full h-full" />
          <CommunityHud />
          <CommunityGarden />
        </div>
      </ScrollContainer>
    </CommunityProvider>
  );
};
