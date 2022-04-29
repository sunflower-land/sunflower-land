export type Contributor = {
  name: string;
  url: string;
  farmId: number;
  role: string;
  avatar: "bumpkin" | "goblin";
};

function shuffledArrary(array: Contributor[]) {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

/**
 * Randomize the list of contributors
 */
export const CONTRIBUTORS = shuffledArrary([
  {
    name: "Bumpkin Builder",
    url: "https://twitter.com/bumpkinbuilder",
    farmId: 1,
    role: "Developer, Game Designer",
    avatar: "bumpkin",
  },

  {
    name: "Romy",
    url: "https://twitter.com/rofrtd",
    farmId: 2,
    role: "Developer, Musician - Willow Tree",
    avatar: "goblin",
  },
]);
