const PAGE_SCROLL_CONTAINER_CLASS = "page-scroll-container";
const ISLAND_SCROLL_STORAGE_KEY = "sunflower-land:island-scroll";

type SavedIslandScrollPosition = {
  left: number;
  top: number;
};

const getIslandScrollKey = (pathname: string) => {
  const visitMatch = pathname.match(/^\/visit\/([^/]+)/);

  if (visitMatch) {
    return `${ISLAND_SCROLL_STORAGE_KEY}:visit:${visitMatch[1]}`;
  }

  return `${ISLAND_SCROLL_STORAGE_KEY}:own`;
};

const getPageScrollContainer = () =>
  document.getElementsByClassName(PAGE_SCROLL_CONTAINER_CLASS)[0] as
    | HTMLElement
    | undefined;

export const saveIslandScrollPosition = () => {
  if (typeof window === "undefined") return;

  const scrollContainer = getPageScrollContainer();

  if (!scrollContainer) return;

  const scrollPosition: SavedIslandScrollPosition = {
    left: scrollContainer.scrollLeft,
    top: scrollContainer.scrollTop,
  };

  sessionStorage.setItem(
    getIslandScrollKey(window.location.pathname),
    JSON.stringify(scrollPosition),
  );
};

export const restoreIslandScrollPosition = () => {
  if (typeof window === "undefined") return false;

  const scrollContainer = getPageScrollContainer();
  const key = getIslandScrollKey(window.location.pathname);
  const savedScrollPosition = sessionStorage.getItem(key);

  if (!scrollContainer || !savedScrollPosition) return false;

  try {
    const { left, top } = JSON.parse(
      savedScrollPosition,
    ) as SavedIslandScrollPosition;

    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        left,
        top,
        behavior: "auto",
      });
    });

    sessionStorage.removeItem(key);

    return true;
  } catch {
    sessionStorage.removeItem(key);

    return false;
  }
};
