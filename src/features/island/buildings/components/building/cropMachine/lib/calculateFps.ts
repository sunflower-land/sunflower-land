/**
 * Helper function to calculate the fps for each frame of a sprite sheet
 * @param frameDurations Array of each frame's duration in milliseconds
 * @param totalDurationSeconds number of seconds the sprite sheet should last
 * @returns Array of fps values for each frame
 */
export function calculateFPS(
  frameDurations: number[],
  totalDurationSeconds: number,
): number[] {
  // Calculate total number of frames
  const totalFrames: number = frameDurations.length;

  // Calculate the total duration of all frames in seconds
  const totalFrameDurationSeconds: number =
    frameDurations.reduce((acc, curr) => acc + curr, 0) / 1000;

  // Calculate fps for each frame
  const fpsArray: number[] = frameDurations.map(
    (duration) => 1 / (duration / 1000),
  );

  // Scale the fps values to fit the total duration of the sprite sheet
  const fpsScaleFactor: number =
    totalDurationSeconds / totalFrameDurationSeconds;
  for (let i = 0; i < totalFrames; i++) {
    fpsArray[i] *= fpsScaleFactor;
  }

  return fpsArray;
}
