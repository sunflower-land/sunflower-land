export function getStreamCountdownLastRead(): string | null {
  const value = localStorage.getItem(`streamCountdownAcknowledged`);

  if (!value) return null;

  return value;
}

export function acknowledgeStreamCountdown(today: string) {
  return localStorage.setItem("streamCountdownAcknowledged", today);
}
