import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useLayoutEffect } from "react";
import { GoblinProvider } from "features/game/GoblinProvider";
import { Game } from "./Game";

export const Retreat: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  console.log("RETERAT");
  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.RetreatBackground, "auto");
  }, []);

  // Load data
  return (
    <GoblinProvider>
      <Game />
    </GoblinProvider>
  );
};
