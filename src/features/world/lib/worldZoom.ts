/**
 * The outdoor world maps are drawn to fill a 1920x1080 screen at the base
 * zoom of 4 (e.g. the Kingdom is 30 tiles = 1920px wide). On a bigger screen
 * that zoom leaves such a map narrower than the window and the rest shows as
 * black bars, so the zoom grows just enough for the map to fill it. Maps that
 * already fill the screen (Plaza, Woodlands...) keep the base zoom, and small
 * rooms that never filled a 1080p screen stay centered as designed.
 */
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export const getBaseWorldZoom = (screenWidth: number) =>
  screenWidth < 500 ? 3 : 4;

export const getWorldZoom = ({
  screenWidth,
  screenHeight,
  mapWidth,
  mapHeight,
}: {
  screenWidth: number;
  screenHeight: number;
  /** Map size in world pixels (tiles * tile size). */
  mapWidth: number;
  mapHeight: number;
}) => {
  const baseZoom = getBaseWorldZoom(screenWidth);

  const fillsDesignScreen =
    mapWidth * baseZoom >= DESIGN_WIDTH &&
    mapHeight * baseZoom >= DESIGN_HEIGHT;
  if (!fillsDesignScreen) return baseZoom;

  return Math.max(baseZoom, screenWidth / mapWidth, screenHeight / mapHeight);
};
