import React from "react";

import { Discord } from "../general-settings/DiscordModal";
import type { ContentComponentProps } from "../types";

/**
 * Settings sub-menu wrapper for the Discord linking flow. The existing
 * Discord component already renders as a settings-style panel (no
 * CloseButtonPanel wrapper), so this is a thin pass-through that keeps
 * the import surface tidy.
 */
export const LinkedDiscordPanel: React.FC<
  Partial<ContentComponentProps>
> = () => <Discord />;
