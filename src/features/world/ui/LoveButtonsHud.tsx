import React from "react";
import classNames from "classnames";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useLoveButtonsHud } from "../lib/loveButtonsHud";

/** The pressed button, as the icon for the count of them. */
const BUTTON_ICON = "world/bumpkin_button_pressed.png";

/**
 * The Love Buttons counter at the top of the screen: how many of the
 * island's buttons are pressed, and how many players are standing on one.
 * Pinned in the HUD (not the world) so it's readable wherever you are on
 * the island. Fed by the Phaser scene through `loveButtonsHud`; nothing
 * renders until the scene is running the puzzle.
 */
export const LoveButtonsHud: React.FC<{
  /** Something else (the connecting/failed label) has the top slot. */
  lower?: boolean;
}> = ({ lower }) => {
  const { t } = useAppTranslation();
  const { visible, pressed, total, standing, standingOnOne, solved } =
    useLoveButtonsHud();

  if (!visible) return null;

  return (
    <div
      className={classNames(
        "fixed z-10 left-1/2 -translate-x-1/2 flex items-center gap-1",
        lower ? "top-10" : "top-2",
      )}
    >
      {/* Keyed by the count so every change remounts it and plays the pop -
          it's the number everyone is watching */}
      <Label
        key={pressed}
        type={solved ? "success" : "default"}
        icon={BUTTON_ICON}
        className="animate-bump"
      >
        {t("loveButtons.hud.pressed", { pressed, total })}
      </Label>
      <Label
        type={solved || standingOnOne ? "success" : "chill"}
        icon={SUNNYSIDE.icons.player}
      >
        {solved
          ? t("loveButtons.hud.solved")
          : t("loveButtons.hud.standing", { standing })}
      </Label>
    </div>
  );
};
