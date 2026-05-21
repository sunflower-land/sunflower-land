let count = 0;
let initialized = false;

function record(event: MouseEvent) {
  if (!event.isTrusted) count++;
}

export function initInteractionMetrics() {
  if (initialized) return;
  initialized = true;
  document.addEventListener("click", record, { passive: true });
}

export function flushMetrics(): { count: number } | undefined {
  if (count === 0) return undefined;
  const result = { count: count };
  count = 0;
  return result;
}
