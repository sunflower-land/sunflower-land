import React, { useLayoutEffect } from "react";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { GoblinProvider } from "features/game/GoblinProvider";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";

import { Game } from "./Game";

export const Retreat: React.FC = () => {
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.RetreatBackground, "auto");
  }, []);

  // Load data
  return (
    <GoblinProvider>
      <ToastProvider>
        <Game />
      </ToastProvider>
    </GoblinProvider>
  );
};
