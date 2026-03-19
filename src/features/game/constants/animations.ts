import { FarmHandAnimation } from "../types/farmhands";

/**
 * Single source of truth for animation display dimensions.
 * Keep frameWidth/frameHeight in sync with backend ANIMATION_CROP_CONFIG
 * (extract.width, extract.height) for cropped animations like watering.
 */
export const BASE_FRAME_WIDTH = 20;

export type AnimationEndpointKey = "idle-small" | "watering";

export interface AnimationDisplayConfig {
  endpointKey: AnimationEndpointKey;
  frameWidth: number;
  frameHeight: number;
  cssScale: number;
  previewContainerSize: number;
  previewImageWidth: number;
  npcImgTopMultiplierManual: number;
  npcImgTopMultiplierPlaced: number;
  equipIcon: {
    scale: number;
    left: number;
  };
}

export const ANIMATION_DISPLAY_CONFIG: Record<
  FarmHandAnimation,
  AnimationDisplayConfig
> = {
  idle: {
    endpointKey: "idle-small",
    frameWidth: 20,
    frameHeight: 19,
    cssScale: 1,
    previewContainerSize: 40,
    previewImageWidth: 32,
    npcImgTopMultiplierManual: -0.31,
    npcImgTopMultiplierPlaced: 0.31,
    equipIcon: {
      scale: 1,
      left: 0,
    },
  },
  watering: {
    endpointKey: "watering",
    frameWidth: 33,
    frameHeight: 21,
    cssScale: 33 / BASE_FRAME_WIDTH,
    previewContainerSize: 56,
    previewImageWidth: 64,
    npcImgTopMultiplierManual: -0.3,
    npcImgTopMultiplierPlaced: 1.2,
    equipIcon: {
      scale: 1.5,
      left: -9,
    },
  },
};

export const getAnimationEndpointKey = (
  animation: FarmHandAnimation,
): AnimationEndpointKey => ANIMATION_DISPLAY_CONFIG[animation].endpointKey;
