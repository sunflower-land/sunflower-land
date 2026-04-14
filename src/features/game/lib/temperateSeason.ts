const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `season.${host}-${window.location.pathname}`;
const SEASON_TUTORIAL_KEY = `season-tutorial.${host}-${window.location.pathname}`;
export const getLastTemperateSeasonStartedAt = () => {
  return Number(localStorage.getItem(LOCAL_STORAGE_KEY));
};

export const setLastTemperateSeasonStartedAt = (startedAt: number) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, startedAt.toString());
};

export const getHasReadTemperateSeasonTutorial = () => {
  return Boolean(localStorage.getItem(SEASON_TUTORIAL_KEY));
};

export const setHasReadTemperateSeasonTutorial = () => {
  localStorage.setItem(SEASON_TUTORIAL_KEY, Date.now().toString());
};
