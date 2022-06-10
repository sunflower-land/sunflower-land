import React, { useLayoutEffect } from "react";
import baseBlock from "assets/land/blocks/base-block.png";
import { GRID_WIDTH_PX } from "./lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

export const Land: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.Base, "auto");
  }, []);

  return (
    <div
      style={{ width: `${GRID_WIDTH_PX * 7}px` }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <img id="base" src={baseBlock} alt="land" className="w-full" />
    </div>
  );
};
