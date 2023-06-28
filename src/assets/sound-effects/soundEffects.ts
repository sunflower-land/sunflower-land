/**
 * Sound effects are not stored in this repository
 */

import { CONFIG } from "lib/config";

export const SOUNDS = {
  footsteps: {
    dirt: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Dirt/Farm_Game_Footsteps_Dirt_1_Soil_Walk_Run_Ground_Surface.mp3`,
  },
  loops: {
    fire: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Fire_1_Crackle_Hum_Warm_Relaxing.mp3`,
    nature_1: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Birds_&_Noise_1_Outside_Trees_Peaceful_Wind.mp3`,
    nature_2: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Birds_&_Noise_2_Outside_Trees_Peaceful_Wind.mp3`,
  },
  songs: {
    royal_farms: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/songs/royal_farms.mp3`,
  },
};
