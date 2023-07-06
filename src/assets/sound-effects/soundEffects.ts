/**
 * Sound effects are not stored in this repository
 */

import { CONFIG } from "lib/config";

export type Footsteps = "dirt_footstep" | "wood_footstep";

export const SOUNDS = {
  footsteps: {
    dirt: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Dirt/Farm_Game_Footsteps_Dirt_1_Soil_Walk_Run_Ground_Surface.mp3`,
    wood: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Wood/Farm_Game_Footsteps_Wood_5_House_Walk_Run_Ground_Surface.mp3`,
  },
  loops: {
    fire: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Fire_1_Crackle_Hum_Warm_Relaxing.mp3`,
    nature_1: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Birds_&_Noise_1_Outside_Trees_Peaceful_Wind.mp3`,
    nature_2: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Birds_&_Noise_2_Outside_Trees_Peaceful_Wind.mp3`,
    engine: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Mechanical Loops/Farm_Game_Loop_Mechanical_Engine_Tractor_Drive_1.mp3`,
    shoreline: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Beach_Waves_1_Water_Shoreline_Crashing_Soft.mp3`,
  },
  songs: {
    royal_farms: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/songs/royal_farms.mp3`,
  },
  doors: {
    open: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Farming/Door/Farm_Game_Farming_Door_Open_Chest_2_Wood_Creak_Storage_Hinge.mp3`,
  },
  notifications: {
    chime: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Notifications/Farm_Game_Notification_Alert_Magic_New_Order_Task_Alert_Chime_Tone.mp3`,
  },
  voices: {
    howdy: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Animals/Human/Farm_Game_Animal_Vocal_Human_Character_Voice_Farmer_Howdy.mp3`,
  },
  animals: {
    toad: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Animals/Frog/toad.mp3`,
  },
};
