/**
 * Sound effects are not stored in this repository
 */

import { CONFIG } from "lib/config";

export type Footsteps = "dirt_footstep" | "wood_footstep" | "sand_footstep";

export const SOUNDS = {
  footsteps: {
    dirt: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Dirt/Farm_Game_Footsteps_Dirt_1_Soil_Walk_Run_Ground_Surface.mp3`,
    wood: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Wood/Farm_Game_Footsteps_Wood_5_House_Walk_Run_Ground_Surface.mp3`,
    sand: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Footsteps/Sand/Farm_Game_Footsteps_Sand_5_Beach_Walk_Run_Ground_Surface.mp3`,
  },
  loops: {
    fire: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Fire_1_Crackle_Hum_Warm_Relaxing.mp3`,
    nature_1: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/ambience_birds_crickets.mp3`,
    engine: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Mechanical Loops/Farm_Game_Loop_Mechanical_Engine_Tractor_Drive_1.mp3`,
    shoreline: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Loops/Nature Loops/Farm_Game_Loop_Nature_Ambience_Beach_Waves_1_Water_Shoreline_Crashing_Soft.mp3`,
  },
  songs: {},
  doors: {
    open: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Farming/Door/Farm_Game_Farming_Door_Open_Chest_2_Wood_Creak_Storage_Hinge.mp3`,
  },
  notifications: {
    chime: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Notifications/Farm_Game_Notification_Alert_Magic_New_Order_Task_Alert_Chime_Tone.mp3`,
    crow_collected: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Notifications/crow_collected.mp3`,
    portal_travel: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Notifications/Farm_Game_Notification_Alert_Farming_Tool_Power_Charge_Up_Ding_2_Heavy_Flow_Transition.mp3`,
    maze_over: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Fishing/Notification/Farm_Game_Fishing_Notification_Negative_Unsuccessful_Catch_3_Fail_Capture_Sad_Complete_Fish.mp3`,
  },
  voices: {
    ouph: `${CONFIG.PROTECTED_IMAGE_URL}/sfx/Animals/Human/Farm_Game_Animal_Vocal_Human_Character_Voice_Farmer_Ouph_Pain.mp3`,
  },
  animals: {},
};
