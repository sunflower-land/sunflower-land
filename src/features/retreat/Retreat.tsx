import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useEffect } from "react";
import { GoblinProvider } from "features/game/GoblinProvider";
import { Game } from "./Game";

export const Retreat: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with island centered
    scrollIntoView(Section.RetreatBackground, "auto");
  }, [scrollIntoView]);

  // Load data
  return (
    <GoblinProvider>
      <Game />
    </GoblinProvider>
  );
};
