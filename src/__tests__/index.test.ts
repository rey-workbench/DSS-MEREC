import { calculateMerecWeights, CriteriaType } from "../index";

describe("Package Exports", () => {
  it("should export calculateMerecWeights function", () => {
    expect(calculateMerecWeights).toBeDefined();
    expect(typeof calculateMerecWeights).toBe("function");
  });

  it("should calculate weights correctly", () => {
    const matrix = [
      [8, 7, 6, 5],
      [6, 8, 7, 6],
      [7, 6, 8, 7],
    ];

    const criteriaTypes: CriteriaType[] = [
      "benefit",
      "benefit",
      "cost",
      "benefit",
    ];

    const weights = calculateMerecWeights(matrix, criteriaTypes);

    expect(Array.isArray(weights)).toBe(true);
    expect(weights).toHaveLength(4);
    expect(weights.every((w) => w >= 0 && w <= 1)).toBe(true);

    // Check sum equals 1
    const sum = weights.reduce((acc, w) => acc + w, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});
