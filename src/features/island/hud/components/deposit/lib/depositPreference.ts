const host = window.location.host.replace(/^www\./, "");
const DEPOSIT_PREFERENCE_KEY = `depositPreference.${host}-${window.location.pathname}`;
export const getDepositPreference = () => {
  return Number(localStorage.getItem(DEPOSIT_PREFERENCE_KEY));
};

export const setDepositPreference = (chainId: number) => {
  localStorage.setItem(DEPOSIT_PREFERENCE_KEY, chainId.toString());
};
