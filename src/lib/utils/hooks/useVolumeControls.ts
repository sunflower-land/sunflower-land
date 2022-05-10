import { Howler } from "howler";

import { SfxMutedControl } from "../../../features/farming/hud/types/settings";
import { getSettings } from "../../../features/farming/hud/lib/settings";

/**
 * Hook for volume controls.
 * TODO: refactor
 */
export const useVolumeControls = () => {
  /**
   * Toggle All SFX, Uses Howler
   * NOTE: localStorage is also UPDATED, no need to update it manually again
   */
  const toggleAllSFX = (_isMuted: boolean) => {
    Howler.mute(_isMuted);
  };

  /**
   * Init the master volume states from cached settings.
   * TODO: refactor if other OP vol controls are used (o_O)
   */
  const initMasterVolume = (): void => {
    const cached = getSettings("SfxMutedControl") as unknown as SfxMutedControl;
    toggleAllSFX(cached.isSfxMuted);
  };

  // TODO: update the return if you use OP volumeControls to + or - the vol
  return [initMasterVolume, toggleAllSFX];
};
