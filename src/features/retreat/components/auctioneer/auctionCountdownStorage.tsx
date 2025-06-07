export function getAuctionCountdownLastRead(): string | null {
  const value = localStorage.getItem(`auctionCountdownAcknowledged`);

  if (!value) return null;

  return value;
}

export function acknowledgeAuctionCountdown(auctionId: string) {
  return localStorage.setItem("auctionCountdownAcknowledged", auctionId);
}
