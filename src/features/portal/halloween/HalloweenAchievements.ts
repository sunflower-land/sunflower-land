export type HalloweenAchievementsName = "Achievement 1";

export const AVAILABLE_ACHIEVEMENTS: Record<
  HalloweenAchievementsName,
  { title: string; description: string; icon: string }
> = {
  "Achievement 1": {
    title: "Achievement 1 Title",
    description: "Achievement 1 Description",
    icon: "world/achievement.but-its-honest-work.png",
  },
};
