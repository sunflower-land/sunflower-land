import React from "react";

import { TwitterRewards } from "./Twitter";
import type { ContentComponentProps } from "../../../island/hud/components/settings-menu/types";

/**
 * Settings sub-menu wrapper for the X (Twitter) linking flow. Renders the
 * existing TwitterRewards body without the modal chrome — GameOptions
 * already provides the title bar, back button, and close button.
 */
export const LinkedTwitterPanel: React.FC<
  Partial<ContentComponentProps>
> = () => <TwitterRewards />;
