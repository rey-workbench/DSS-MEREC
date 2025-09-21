import { Merec } from "../merec";

describe("Merec Static Method", () => {
  it("should calculate weights using static CalculateWeight method", () => {
    const matrix = [
      [8, 7, 6, 5],
      [6, 8, 7, 6],
      [7, 6, 8, 7],
      [5, 9, 5, 8],
    ];

    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "benefit",
      "cost",
      "benefit",
    ];

    const weights = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(weights).toHaveLength(4);
    expect(weights.every((w) => w >= 0 && w <= 1)).toBe(true);

    // Total weights should sum to 1
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    expect(totalWeight).toBeCloseTo(1, 10);
  });

  it("should throw error with empty matrix", () => {
    expect(() => {
      Merec.CalculateWeight([], ["benefit"]);
    }).toThrow("Matrix tidak boleh kosong");
  });

  it("should throw error with empty criteria types", () => {
    const matrix = [[1, 2, 3]];
    expect(() => {
      Merec.CalculateWeight(matrix, []);
    }).toThrow("Tipe kriteria tidak boleh kosong");
  });

  it("should throw error when matrix columns don't match criteria length", () => {
    const matrix = [[1, 2, 3]];
    const criteriaTypes: ("benefit" | "cost")[] = ["benefit", "benefit"];

    expect(() => {
      Merec.CalculateWeight(matrix, criteriaTypes);
    }).toThrow(
      "Jumlah kolom matrix (3) harus sama dengan jumlah tipe kriteria (2)"
    );
  });

  it("should throw error when matrix rows have inconsistent lengths", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5], // Missing one column
      [7, 8, 9],
    ];
    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "benefit",
      "cost",
    ];

    expect(() => {
      Merec.CalculateWeight(matrix, criteriaTypes);
    }).toThrow("Baris 2 harus memiliki 3 kolom");
  });

  it("should handle single criterion", () => {
    const matrix = [[10], [8], [12]];
    const criteriaTypes: ("benefit" | "cost")[] = ["benefit"];

    const weights = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(weights).toHaveLength(1);
    expect(weights[0]).toBe(1);
  });

  it("should handle mix of benefit and cost criteria", () => {
    const matrix = [
      [8, 100, 7], // benefit, cost, benefit
      [6, 80, 8],
      [7, 120, 6],
    ];
    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "cost",
      "benefit",
    ];

    const weights = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(weights).toHaveLength(3);
    expect(weights.every((w) => w >= 0 && w <= 1)).toBe(true);

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    expect(totalWeight).toBeCloseTo(1, 10);
  });

  it("should produce consistent results with same input", () => {
    const matrix = [
      [8, 7, 6],
      [6, 8, 7],
      [7, 6, 8],
    ];
    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "benefit",
      "cost",
    ];

    const weights1 = Merec.CalculateWeight(matrix, criteriaTypes);
    const weights2 = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(weights1).toEqual(weights2);
  });

  it("should handle large matrix", () => {
    // 10 alternatives, 5 criteria
    const matrix = Array.from({ length: 10 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) => (i + 1) * (j + 1))
    );
    const criteriaTypes: ("benefit" | "cost")[] = [
      "benefit",
      "cost",
      "benefit",
      "cost",
      "benefit",
    ];

    const weights = Merec.CalculateWeight(matrix, criteriaTypes);

    expect(weights).toHaveLength(5);
    expect(weights.every((w) => w >= 0 && w <= 1)).toBe(true);

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    expect(totalWeight).toBeCloseTo(1, 10);
  });
});
