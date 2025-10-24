export const prng = (seed: number) => {
  // This uses a splitmix32 algorithm to generate a random number between 0 and 1
  // https://github.com/bryc/code/blob/master/jshash/PRNGs.md#splitmix32
  seed |= 0;
  seed = (seed + 0x9e3779b9) | 0;

  let t = seed ^ (seed >>> 16);
  t = Math.imul(t, 0x21f0aaad);
  t = t ^ (t >>> 15);
  t = Math.imul(t, 0x735a2d97);

  return { value: ((t = t ^ (t >>> 15)) >>> 0) / 4294967296, nextSeed: seed };
};
