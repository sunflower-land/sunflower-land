import { CONFIG } from "lib/config";
import { BumpkinParts, tokenUriBuilder } from "lib/utils/tokenUriBuilder";

export enum ANIMATION {
  attack = "attack",
  axe = "axe",
  carry = "carry",
  casting = "casting",
  caught = "caught",
  death = "death",
  dig = "dig",
  doing = "doing",
  hammering = "hammering",
  hurt = "hurt",
  idle = "idle",
  jump = "jump",
  mining = "mining",
  reeling = "reeling",
  roll = "roll",
  run = "run",
  swimming = "swimming",
  waiting = "waiting",
  walking = "walking",
  watering = "watering",
}

export const getAnimationUrl = (
  bumpkinParts: BumpkinParts,
  animation: keyof typeof ANIMATION,
) => {
  return `${CONFIG.ANIMATION_URL}/animate/0_v1_${tokenUriBuilder(bumpkinParts)}/${animation}`;
};
