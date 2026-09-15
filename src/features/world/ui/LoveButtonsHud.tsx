import React from "react";
import classNames from "classnames";

import { Label } from "components/ui/Label";
import { useLoveButtonsHud } from "../lib/loveButtonsHud";

/** The pressed button, as the icon for the count of them. */
const BUTTON_ICON = "world/bumpkin_button_pressed.png";

/**
 * The Love Buttons counter at the top of the screen - just `n/25`, the
 * buttons that are down, on a label with the button as its icon. Pinned in
 * the HUD (not the world) so it's readable wherever you are on the island.
 * It pops when the count goes up and turns green once solved. Fed by the
 * Phaser scene through `loveButtonsHud`; nothing renders until the scene is
 * running the puzzle.
 */
export const LoveButtonsHud: React.FC<{
  /** Something else (the connecting/failed label) has the top slot. */
  lower?: boolean;
}> = ({ lower }) => {
  const { visible, pressed, total, solved } = useLoveButtonsHud();

  if (!visible) return null;

  return (
    <div
      className={classNames(
        "fixed z-10 left-1/2 -translate-x-1/2 pointer-events-none select-none",
        lower ? "top-10" : "top-2",
      )}
    >
      {/* Keyed by the count so every change remounts it and plays the pop */}
      <Label
        key={pressed}
        type={solved ? "success" : "default"}
        icon={BUTTON_ICON}
        className="animate-bump"
      >
        {`${pressed}/${total}`}
      </Label>
    </div>
  );
};
