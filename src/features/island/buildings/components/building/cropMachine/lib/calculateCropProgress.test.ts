import { calculateCropProgress } from "./calculateCropProgress";

describe("calculateCropProgress", () => {
  it("returns 0 if a 1hr crop does not have any oil allocated (no startTime)", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const now = 0;
    const growTimeRemaining = oneHour;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      now,
      growTimeRemaining,
    });

    // Assert
    expect(result).toBe(0);
  });

  it("returns 0 if a 1hr crop has enough oil and has not started", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 1;
    const now = 0;
    const growTimeRemaining = 0;
    const readyAt = startTime + totalGrowTime;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      readyAt,
    });

    // Assert
    expect(result).toBe(0);
  });

  it("returns 100 if a 1hr crop has grown for 1hr and was ready 1hr ago", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour * 2;
    const growTimeRemaining = 0;
    const readyAt = oneHour;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      readyAt,
    });

    // Assert
    expect(result).toBeCloseTo(100);
  });

  it("returns 50% if a 1hr crop has enough oil and has grown for 30 minutes", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour / 2;
    const growTimeRemaining = 0;
    const readyAt = oneHour;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      readyAt,
    });

    // Assert
    expect(result).toBeCloseTo(50);
  });

  it("returns 100 if 1hr crop has enough oil and has grown for more than 1hr", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour + 1000;
    const growTimeRemaining = 0;
    const readyAt = oneHour;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      readyAt,
    });

    // Assert
    expect(result).toBeCloseTo(100);
  });

  it("returns 50 if a 1hr crop has enough oil for 30 minutes and has grown for 30 minutes", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour / 2;
    const growTimeRemaining = oneHour / 2;
    const growsUntil = oneHour / 2;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      growsUntil,
    });

    // Assert
    expect(result).toBeCloseTo(50);
  });

  it("return 50 if a 1hr crop has grown for 30 minutes but stopped 30 minutes ago", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour;
    const growTimeRemaining = oneHour / 2;
    const growsUntil = oneHour / 2;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      growsUntil,
    });

    // Assert
    expect(result).toBeCloseTo(50);
  });

  it("return 75 if a 1hr if a crop grew for 30 mins then stopped for 30 mins and then grew another 15 mins", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const fifteenMinutes = 15 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour + fifteenMinutes;
    const growTimeRemaining = fifteenMinutes;
    const growsUntil = oneHour + fifteenMinutes;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      growsUntil,
    });

    // Assert
    expect(result).toBeCloseTo(75);
  });

  it("return 75 if a 1hr if a crop grew for 30 mins then stopped for 30 mins and then grew another 15 mins and has a readyAt in 15 mins", () => {
    // Arrange
    const oneHour = 60 * 60 * 1000;
    const fifteenMinutes = 15 * 60 * 1000;
    const totalGrowTime = oneHour;
    const startTime = 0;
    const now = oneHour + fifteenMinutes;
    const growTimeRemaining = 0;
    const readyAt = oneHour + fifteenMinutes + fifteenMinutes;

    // Act
    const result = calculateCropProgress({
      totalGrowTime,
      startTime,
      now,
      growTimeRemaining,
      readyAt,
    });

    // Assert
    expect(result).toBeCloseTo(75);
  });
});
