import { Merec } from "../index";

describe("Package Exports", () => {
  it("should export Merec class", () => {
    expect(Merec).toBeDefined();
    expect(typeof Merec).toBe("function");
  });

  it("should have CalculateWeight static method", () => {
    expect(typeof Merec.CalculateWeight).toBe("function");
  });

  it("should calculate weights correctly", () => {
    const matrix = [
      [8, 7, 6, 5],
      [6, 8, 7, 6],
      [7, 6, 8, 7],
    ];

    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "benefit",
      "cost",
      "benefit",
    ];

    const weights = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(Array.isArray(weights)).toBe(true);
    expect(weights).toHaveLength(4);
    expect(weights.every((w) => w >= 0 && w <= 1)).toBe(true);

    // Check sum equals 1
    const sum = weights.reduce((acc, w) => acc + w, 0);
    expect(sum).toBeCloseTo(1, 10);
  });
});
