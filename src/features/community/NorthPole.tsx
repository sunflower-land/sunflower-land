import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

// import background from "./assets/community_garden.gif";
import ocean from "assets/events/christmas/decorations/ocean.png";
import { CommunityHud } from "./components/CommunityHUD";
import { CommunityProvider } from "./lib/CommunityProvider";
import { NorthPole } from "features/community/northpole/NorthPole";

export const CommunityNorthPole: React.FC = () => {
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with crops centered
    //scrollIntoView(Section.Merchant, "auto");
    scrollIntoView(Section.NorthPole, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <CommunityProvider>
      <ScrollContainer
        className="bg-blue-300 overflow-scroll relative w-full h-full"
        innerRef={container}
      >
        <div
          className="relative"
          style={{
            width: `${60 * GRID_WIDTH_PX}px`,
            height: `${60 * GRID_WIDTH_PX}px`,
          }}
        >
          <div
            className="absolute inset-0 bg-repeat w-full h-full"
            style={{
              backgroundImage: `url(${ocean})`,
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
          />
          {/*<img src={background} className="absolute inset-0 w-full h-full" />*/}
          <CommunityHud />
          <NorthPole />
        </div>
      </ScrollContainer>
    </CommunityProvider>
  );
};
