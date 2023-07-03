export function acknowledgePotionHouseIntro() {
  return localStorage.setItem("potionHouseIntro", new Date().toISOString());
}

export function getPotionHouseIntroRead() {
  const value = localStorage.getItem("potionHouseIntro");
  if (!value) return null;

  return new Date(value);
}
