export function getExchangeRate(supply: number) {
  if (supply < 100000) {
    return 1;
  }

  if (supply < 500000) {
    return 0.5;
  }

  if (supply < 1000000) {
    return 0.1;
  }

  if (supply < 5000000) {
    return 0.05;
  }

  if (supply < 10000000) {
    return 0.01;
  }

  if (supply < 50000000) {
    return 0.005;
  }

  if (supply < 100000000) {
    return 0.001;
  }

  if (supply < 500000000) {
    return 0.0005;
  }

  if (supply < 1000000000) {
    return 0.0001;
  }

  // Linear growth
  return (1 / supply) * 100000;
}

export function getMarketRate(supply: number) {
  if (supply < 100000) {
    // 1 Farm Dollar gets you 1 FMC token
    return 1;
  }

  // Less than 500, 000 tokens
  if (supply < 500000) {
    return 5;
  }

  // Less than 1, 000, 000 tokens
  if (supply < 1000000) {
    return 10;
  }

  // Less than 5, 000, 000 tokens
  if (supply < 5000000) {
    return 50;
  }

  // Less than 10, 000, 000 tokens
  if (supply < 10000000) {
    return 100;
  }

  // Less than 50, 000, 000 tokens
  if (supply < 50000000) {
    return 500;
  }

  // Less than 100, 000, 000 tokens
  if (supply < 100000000) {
    return 1000;
  }

  // Less than 500, 000, 000 tokens
  if (supply < 500000000) {
    return 5000;
  }

  // Less than 1, 000, 000, 000 tokens
  if (supply < 1000000000) {
    return 10000;
  }

  // 1 Farm Dollar gets you a 0.00001 of a token - Linear growth from here
  return supply / 10000;
}

export function getNextHalvingThreshold(supply: number): number {
  const thresholds = [
    100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000,
    500000000, 1000000000,
  ];

  const currentThresholdIdx = thresholds.findIndex(
    (threshold) => supply < threshold
  );

  if (currentThresholdIdx >= 0) {
    return thresholds[currentThresholdIdx];
  }

  return null;
}

export function getNextMarketRate(supply: number) {
  const nextThreshold = getNextHalvingThreshold(supply);

  if (nextThreshold) {
    return getMarketRate(nextThreshold);
  }
}
