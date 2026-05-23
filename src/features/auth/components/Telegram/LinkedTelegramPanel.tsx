import React from "react";

import { TelegramBody } from "./Telegram";
import type { ContentComponentProps } from "../../../island/hud/components/settings-menu/types";

/**
 * Settings sub-menu wrapper for the Telegram linking flow. Renders the
 * existing TelegramBody without the modal chrome — GameOptions already
 * provides the title bar, back button, and close button.
 */
export const LinkedTelegramPanel: React.FC<
  Partial<ContentComponentProps>
> = () => <TelegramBody />;
